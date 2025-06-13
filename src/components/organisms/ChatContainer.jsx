import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { messageService } from '@/services';
import ChatHeader from '@/components/organisms/ChatHeader';
import ChatMessagesDisplay from '@/components/organisms/ChatMessagesDisplay';
import ChatInputForm from '@/components/organisms/ChatInputForm';

const ChatContainer = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load initial welcome message
    const loadWelcomeMessage = async () => {
      try {
        const welcomeMessage = await messageService.getWelcomeMessage();
        setMessages([welcomeMessage]);
      } catch (error) {
        console.error('Failed to load welcome message:', error);
      }
    };
    loadWelcomeMessage();
  }, []);

  const playSound = (type) => {
    if (!soundEnabled) return;
    
    // Create audio context for sound effects
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'send') {
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
    } else if (type === 'receive') {
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
    }
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'You',
      content: inputText.trim(),
      timestamp: new Date(),
      isUser: true
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    playSound('send');

    // Show typing indicator
    setIsTyping(true);

    try {
      // Get mock response
      const response = await messageService.getMockResponse(userMessage.content);
      
      // Hide typing indicator and add response
      setIsTyping(false);
      setMessages(prev => [...prev, response]);
      playSound('receive');
    } catch (error) {
      setIsTyping(false);
      toast.error('Failed to get response');
      console.error('Failed to get mock response:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearConversation = () => {
    if (messages.length <= 1) return; // Don't clear if only welcome message
    
    if (window.confirm('Are you sure you want to clear the conversation?')) {
      setMessages(messages.slice(0, 1)); // Keep only welcome message
      toast.success('Conversation cleared');
    }
  };

  return (
    <div className="h-full flex flex-col max-w-full overflow-hidden">
      <ChatHeader
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onClearConversation={clearConversation}
      />
      <ChatMessagesDisplay
        messages={messages}
        isTyping={isTyping}
        messagesEndRef={messagesEndRef}
      />
      <ChatInputForm
        inputText={inputText}
        setInputText={setInputText}
        handleSendMessage={handleSendMessage}
        handleKeyPress={handleKeyPress}
        isTyping={isTyping}
        inputRef={inputRef}
      />
    </div>
  );
};

export default ChatContainer;