import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import RainGrid from './RainGrid';

const glowAnimation = keyframes`
  0% { text-shadow: 0 0 10px #0f0, 0 0 20px #0f0, 0 0 30px #0f0; }
  50% { text-shadow: 0 0 15px #0f0, 0 0 25px #0f0, 0 0 35px #0f0; }
  100% { text-shadow: 0 0 10px #0f0, 0 0 20px #0f0, 0 0 30px #0f0; }
`;

const typewriterAnimation = keyframes`
  from { width: 0 }
  to { width: 100% }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  background: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  color: #0f0;
  font-family: 'Courier New', monospace;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin: 0;
  animation: ${glowAnimation} 2s ease-in-out infinite;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Console = styled.div`
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid #0f0;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  width: 90%;
  max-width: 800px;
`;

const ConsoleText = styled.div`
  overflow: hidden;
  white-space: nowrap;
  margin: 0;
  animation: ${typewriterAnimation} 3s steps(50, end);
  border-right: 2px solid #0f0;
`;

const ControlPanel = styled.div`
  display: flex;
  gap: 20px;
  margin: 20px 0;
  flex-wrap: wrap;
  justify-content: center;
`;

const Button = styled.button`
  background: transparent;
  border: 2px solid #0f0;
  color: #0f0;
  padding: 10px 20px;
  font-family: 'Courier New', monospace;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    background: rgba(0, 255, 0, 0.1);
    box-shadow: 0 0 15px #0f0;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const StatusBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.9);
  padding: 10px;
  border-top: 1px solid #0f0;
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
`;

const App = () => {
  const [systemStatus, setSystemStatus] = useState('SYSTEM IDLE');
  const [consoleMessages, setConsoleMessages] = useState(['> MATRIX SIMULATION INITIALIZED']);
  const [activeUsers, setActiveUsers] = useState(Math.floor(Math.random() * 100) + 1);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(prev => Math.floor(Math.random() * 100) + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const addConsoleMessage = (message) => {
    setConsoleMessages(prev => [...prev, `> ${message}`].slice(-5));
    setSystemStatus(`PROCESSING: ${message}`);
  };

  return (
    <AppContainer>
      <Header>
        <Title>MATRIX INTERFACE v1.0</Title>
      </Header>

      <ControlPanel>
        <Button onClick={() => addConsoleMessage('INITIATING TRACE PROGRAM')}>
          INITIATE TRACE
        </Button>
        <Button onClick={() => addConsoleMessage('SCANNING NETWORK')}>
          SCAN NETWORK
        </Button>
        <Button onClick={() => addConsoleMessage('DECRYPTING SIGNALS')}>
          DECRYPT
        </Button>
      </ControlPanel>

      <RainGrid />

      <Console>
        {consoleMessages.map((message, index) => (
          <ConsoleText key={index}>{message}</ConsoleText>
        ))}
      </Console>

      <StatusBar>
        <span>STATUS: {systemStatus}</span>
        <span>ACTIVE NODES: {activeUsers}</span>
        <span>SIGNAL STRENGTH: ▮▮▮▮▯</span>
      </StatusBar>
    </AppContainer>
  );
};

export default App;