import React from 'react';

interface NeonButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

export function NeonButton({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '',
  disabled = false,
  type = 'button'
}: NeonButtonProps) {
  const baseClasses = 'px-8 py-4 rounded-full transition-all duration-300 relative overflow-hidden backdrop-blur-sm';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-cyan-500 via-purple-500 to-magenta-500 text-white shadow-[0_0_20px_rgba(138,43,226,0.5)] hover:shadow-[0_0_30px_rgba(138,43,226,0.7)]',
    secondary: 'bg-white/10 text-white border border-white/20 hover:bg-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]',
    outline: 'bg-transparent text-cyan-400 border-2 border-cyan-400/50 hover:border-cyan-400 hover:bg-cyan-400/10 shadow-[0_0_15px_rgba(0,255,255,0.3)]'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
}
