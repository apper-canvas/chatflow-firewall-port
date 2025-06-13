import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import { messageService } from '../services';
import { format } from 'date-fns';

const MainFeature = () => {
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

  const formatTimestamp = (timestamp) => {
    return format(new Date(timestamp), 'h:mm a');
  };

  const TypingIndicator = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center space-x-2 px-4 py-2 mb-4"
    >
      <div className="flex items-center space-x-1 bg-surface-700 rounded-2xl px-4 py-3">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-surface-400 rounded-full typing-dot"></div>
          <div className="w-2 h-2 bg-surface-400 rounded-full typing-dot"></div>
          <div className="w-2 h-2 bg-surface-400 rounded-full typing-dot"></div>
        </div>
        <span className="text-xs text-surface-400 ml-2">AI is typing...</span>
      </div>
    </motion.div>
  );

  const MessageBubble = ({ message, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className={`flex mb-4 px-4 ${message.isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${message.isUser ? 'order-2' : 'order-1'}`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            message.isUser
              ? 'bg-gradient-to-r from-primary to-secondary text-white'
              : 'bg-surface-700 text-white'
          }`}
        >
          <p className="text-sm leading-relaxed break-words">{message.content}</p>
        </div>
        <div className={`flex items-center mt-1 space-x-2 ${message.isUser ? 'justify-end' : 'justify-start'}`}>
          <span className="text-xs text-surface-400">{message.sender}</span>
          <span className="text-xs text-surface-500">•</span>
          <span className="text-xs text-surface-400">{formatTimestamp(message.timestamp)}</span>
        </div>
      </div>
      
      {!message.isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-secondary to-accent flex items-center justify-center ml-3 order-0 flex-shrink-0">
          <ApperIcon name="Bot" size={16} className="text-white" />
        </div>
      )}
      
      {message.isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent to-primary flex items-center justify-center mr-3 order-1 flex-shrink-0">
          <ApperIcon name="User" size={16} className="text-white" />
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="h-full flex flex-col max-w-full overflow-hidden">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex-shrink-0 h-16 glass border-b border-surface-700 flex items-center justify-between px-4 z-40"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <ApperIcon name="MessageCircle" size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-heading font-semibold text-white">ChatFlow</h1>
            <p className="text-xs text-surface-400">Offline Chat Simulator</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg ${soundEnabled ? 'bg-primary text-white' : 'bg-surface-700 text-surface-400'}`}
          >
            <ApperIcon name={soundEnabled ? "Volume2" : "VolumeX"} size={16} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearConversation}
            className="p-2 rounded-lg bg-surface-700 text-surface-400 hover:bg-surface-600 hover:text-white"
          >
            <ApperIcon name="Trash2" size={16} />
          </motion.button>
        </div>
      </motion.header>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto chat-scroll px-0 py-4">
        <div className="min-h-full flex flex-col justify-end">
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <MessageBubble key={message.id} message={message} index={index} />
            ))}
            {isTyping && <TypingIndicator key="typing" />}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex-shrink-0 glass border-t border-surface-700 p-4"
      >
        <div className="flex items-end space-x-3 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full bg-surface-700 border border-surface-600 rounded-2xl px-4 py-3 pr-12 text-white placeholder-surface-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent max-h-32 min-h-[44px] leading-relaxed"
              rows={1}
              style={{
                height: 'auto',
                minHeight: '44px'
              }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
              }}
              disabled={isTyping}
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <ApperIcon name="Send" size={18} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default MainFeature;