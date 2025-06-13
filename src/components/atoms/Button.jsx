import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, className, onClick, disabled, ...props }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;