import React from 'react';

const Input = React.forwardRef(({ className, value, onChange, onKeyPress, placeholder, rows = 1, disabled, onInput, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      placeholder={placeholder}
      className={className}
      rows={rows}
      style={{
        height: 'auto',
        minHeight: '44px'
      }}
      onInput={(e) => {
        e.target.style.height = 'auto';
        e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
        if (onInput) onInput(e); // Allow external onInput handlers
      }}
      disabled={disabled}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;