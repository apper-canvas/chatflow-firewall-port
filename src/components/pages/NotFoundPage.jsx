import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <ApperIcon name="MessageCircleX" className="w-16 h-16 text-surface-400 mx-auto" />
        </motion.div>
        <h1 className="mt-4 text-xl font-heading font-semibold text-white">Page Not Found</h1>
        <p className="mt-2 text-surface-400">The chat room you're looking for doesn't exist.</p>
        <Button
          onClick={() => navigate('/')}
          className="mt-4 px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium"
        >
          Back to Chat
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;