import React, { useState, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import styled from 'styled-components';

interface VoiceRecognitionProps {
  onCommand: (command: string) => void;
  onTranscriptChange: (transcript: string) => void;
  onListeningChange: (isListening: boolean) => void;
}

const VoiceContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
`;

const MicButton = styled.button<{ $isListening: boolean }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: ${({ $isListening }) => ($isListening ? '#ff4f4f' : '#0084ff')};
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
  }
`;

const StatusText = styled.p`
  margin-top: 10px;
  font-size: 0.9rem;
  color: #666;
`;

const FeedbackContainer = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 10px;
`;

const FeedbackButton = styled.button`
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  background-color: #0084ff;
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    background-color: #0069d9;
  }
`;

const VoiceRecognition: React.FC<VoiceRecognitionProps> = ({ 
  onCommand, 
  onTranscriptChange,
  onListeningChange
}) => {
  const [listening, setListening] = useState(false);
  const [autoSend, setAutoSend] = useState<boolean>(true);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTranscriptRef = useRef<string>('');
  
  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
    finalTranscript,
    interimTranscript,
    listening: isListening
  } = useSpeechRecognition();

  // Reset silence timer when transcript changes
  useEffect(() => {
    if (listening) {
      // If transcript changed, reset the silence timer
      if (transcript !== lastTranscriptRef.current) {
        lastTranscriptRef.current = transcript;
        resetSilenceTimer();
      }
    }
  }, [transcript, listening]);

  // Update transcript in parent component
  useEffect(() => {
    onTranscriptChange(transcript);
  }, [transcript, onTranscriptChange]);

  // Update listening status in parent component
  useEffect(() => {
    if (listening !== isListening) {
      setListening(isListening);
      onListeningChange(isListening);
    }
  }, [isListening, listening, onListeningChange]);

  // Initialize speech recognition and check browser compatibility on mount
  useEffect(() => {
    console.log("Speech Recognition Support Check:", {
      browserSupport: browserSupportsSpeechRecognition,
      microphoneAvailable: isMicrophoneAvailable
    });
    
    // Check if the Web Speech API is properly initialized
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      console.log("Web Speech API is available");
    } else {
      console.error("Web Speech API is NOT available in this browser");
    }
  }, [browserSupportsSpeechRecognition, isMicrophoneAvailable]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };
  }, []);

  if (!browserSupportsSpeechRecognition) {
    return (
      <VoiceContainer>
        <StatusText>Browser doesn't support speech recognition. Please try Chrome, Edge, or Safari.</StatusText>
        <FeedbackButton 
          onClick={() => window.open('https://caniuse.com/speech-recognition', '_blank')}
          style={{ marginTop: '10px' }}
        >
          Check Browser Compatibility
        </FeedbackButton>
      </VoiceContainer>
    );
  }

  if (!isMicrophoneAvailable) {
    return (
      <VoiceContainer>
        <StatusText>Please allow microphone access to use voice commands.</StatusText>
        <FeedbackButton 
          onClick={() => {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
              navigator.mediaDevices.getUserMedia({ audio: true })
                .then(() => alert('Microphone access granted!'))
                .catch(err => alert('Error accessing microphone: ' + err.message));
            } else {
              alert('Your browser does not support accessing the microphone');
            }
          }}
          style={{ marginTop: '10px' }}
        >
          Request Microphone Access
        </FeedbackButton>
      </VoiceContainer>
    );
  }

  // Reset the silence timer (called whenever there's new speech)
  const resetSilenceTimer = () => {
    // Clear existing timer
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    
    // Set new timer - stop listening after 4 seconds of silence
    silenceTimerRef.current = setTimeout(() => {
      if (listening) {
        stopListening();
      }
    }, 4000);
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    
    if (transcript && autoSend) {
      onCommand(transcript);
    }
  };

  const toggleListening = () => {
    if (listening) {
      stopListening();
    } else {
      resetTranscript();
      lastTranscriptRef.current = '';
      
      try {
        // Check if the browser supports SpeechRecognition
        if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
          console.error("SpeechRecognition API not available in this browser");
          alert("Speech recognition is not supported in this browser. Please try Chrome, Edge, or Safari.");
          return;
        }

        // If permission is already granted, start listening directly
        let permissionState = hasMicPermission;
        if (permissionState === 'granted') {
          SpeechRecognition.startListening({ 
            continuous: true,
            interimResults: true,
            language: 'en-US'
          });
          resetSilenceTimer();
          return;
        }

        // Otherwise, request permission
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(() => {
            setHasMicPermission('granted');
            SpeechRecognition.startListening({ 
              continuous: true,
              interimResults: true,
              language: 'en-US'
            });
            resetSilenceTimer();
          })
          .catch(err => {
            setHasMicPermission('denied');
            console.error("Microphone access error:", err);
            alert("Failed to access microphone. Please check your microphone permissions and try again.");
          });
      } catch (err) {
        console.error("Error starting speech recognition:", err);
        alert("There was an error starting speech recognition. Please refresh the page and try again.");
      }
    }
  };

  const toggleAutoSend = () => {
    setAutoSend(!autoSend);
  };

  return (
    <VoiceContainer>
      <MicButton $isListening={listening} onClick={toggleListening}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"
            fill="white"
          />
          <path
            d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"
            fill="white"
          />
        </svg>
      </MicButton>
      <StatusText>
        {listening ? 'Listening... (will stop after 4s of silence)' : 'Click to start voice recognition'}
      </StatusText>
      
      <FeedbackContainer>
        <FeedbackButton 
          onClick={toggleAutoSend}
          style={{ backgroundColor: autoSend ? '#28a745' : '#6c757d' }}
        >
          Auto-Send: {autoSend ? 'ON' : 'OFF'}
        </FeedbackButton>
      </FeedbackContainer>
    </VoiceContainer>
  );
};

export default VoiceRecognition;
