import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import './App.css';
import Chat from './components/Chat';
import VoiceRecognition from './components/VoiceRecognition';
import { apiService } from './services/api.service';
import { Message } from './types';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
`;

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: uuidv4(),
      text: 'Hello! I am your employee directory assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);

  const handleSendMessage = useCallback(async (text: string) => {
    // Add user message to chat
    const userMessage: Message = {
      id: uuidv4(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    
    // Show typing indicator or loading state here if desired
    
    try {
      // Send the command to the MCP server
      const response = await apiService.sendCommand(text);
      
      // Add bot response to chat
      const botMessage: Message = {
        id: uuidv4(),
        text: response.success ? response.message : 'Sorry, I encountered an error processing your request.',
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error handling message:', error);
      
      // Add error message to chat
      const errorMessage: Message = {
        id: uuidv4(),
        text: 'Sorry, there was a problem communicating with the server.',
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  }, []);

  return (
    <AppContainer>
      <Header>
        <Title>Employee Directory</Title>
        <Subtitle>Ask me anything about our employees</Subtitle>
      </Header>
      
      <Chat messages={messages} onSendMessage={handleSendMessage} />
      <VoiceRecognition onCommand={handleSendMessage} />
    </AppContainer>
  );
}

export default App;
