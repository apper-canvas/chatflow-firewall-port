import React from 'react';
import { AnimatePresence } from 'framer-motion';
import MessageBubble from '@/components/molecules/MessageBubble';
import TypingIndicator from '@/components/molecules/TypingIndicator';

const ChatMessagesDisplay = ({ messages, isTyping, messagesEndRef }) => {
  return (
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
  );
};

export default ChatMessagesDisplay;