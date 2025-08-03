import React, { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import styled from 'styled-components';

interface VoiceRecognitionProps {
  onCommand: (command: string) => void;
}

const VoiceContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
`;

const MicButton = styled.button<{ isListening: boolean }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: ${({ isListening }) => (isListening ? '#ff4f4f' : '#0084ff')};
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

const TranscriptText = styled.p`
  margin-top: 15px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 5px;
  max-width: 500px;
  min-height: 20px;
  font-style: italic;
  color: #444;
`;

const VoiceRecognition: React.FC<VoiceRecognitionProps> = ({ onCommand }) => {
  const [listening, setListening] = useState(false);
  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return (
      <VoiceContainer>
        <StatusText>Browser doesn't support speech recognition.</StatusText>
      </VoiceContainer>
    );
  }

  if (!isMicrophoneAvailable) {
    return (
      <VoiceContainer>
        <StatusText>Please allow microphone access to use voice commands.</StatusText>
      </VoiceContainer>
    );
  }

  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      if (transcript) {
        onCommand(transcript);
      }
      resetTranscript();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
    setListening(!listening);
  };

  return (
    <VoiceContainer>
      <MicButton isListening={listening} onClick={toggleListening}>
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
        {listening ? 'Listening...' : 'Click to start voice recognition'}
      </StatusText>
      {transcript && <TranscriptText>{transcript}</TranscriptText>}
    </VoiceContainer>
  );
};

export default VoiceRecognition;
