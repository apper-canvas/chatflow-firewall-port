import React from 'react';
import { motion } from 'framer-motion';

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

export default TypingIndicator;