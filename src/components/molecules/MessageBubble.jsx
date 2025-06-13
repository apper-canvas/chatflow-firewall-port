import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';

const MessageBubble = React.forwardRef(({ message, index }, ref) => {
  const formatTimestamp = (timestamp) => {
    return format(new Date(timestamp), 'h:mm a');
  };

  return (
    <motion.div
      ref={ref}
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
});

MessageBubble.displayName = 'MessageBubble';
export default MessageBubble;