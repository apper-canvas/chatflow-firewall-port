import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';

const ChatInputForm = ({ inputText, setInputText, handleSendMessage, handleKeyPress, isTyping, inputRef }) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex-shrink-0 glass border-t border-surface-700 p-4"
    >
      <div className="flex items-end space-x-3 max-w-4xl mx-auto">
        <div className="flex-1 relative">
          <Input
            ref={inputRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="w-full bg-surface-700 border border-surface-600 rounded-2xl px-4 py-3 pr-12 text-white placeholder-surface-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent max-h-32 min-h-[44px] leading-relaxed"
            disabled={isTyping}
          />
        </div>
        
        <Button
          onClick={handleSendMessage}
          disabled={!inputText.trim() || isTyping}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        >
          <ApperIcon name="Send" size={18} />
        </Button>
      </div>
    </motion.div>
  );
};

export default ChatInputForm;