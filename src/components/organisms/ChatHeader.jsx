import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ChatHeader = ({ soundEnabled, onToggleSound, onClearConversation }) => {
  return (
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
        <Button
          onClick={onToggleSound}
          className={`p-2 rounded-lg ${soundEnabled ? 'bg-primary text-white' : 'bg-surface-700 text-surface-400'}`}
        >
          <ApperIcon name={soundEnabled ? "Volume2" : "VolumeX"} size={16} />
        </Button>
        
        <Button
          onClick={onClearConversation}
          className="p-2 rounded-lg bg-surface-700 text-surface-400 hover:bg-surface-600 hover:text-white"
        >
          <ApperIcon name="Trash2" size={16} />
        </Button>
      </div>
    </motion.header>
  );
};

export default ChatHeader;