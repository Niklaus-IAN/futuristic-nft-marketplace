import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  onClick?: () => void;
}

export function GlassCard({ children, className = '', glow = false, onClick }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10
        ${glow ? 'shadow-[0_0_30px_rgba(0,255,255,0.2)]' : 'shadow-lg'}
        transition-all duration-300 hover:bg-white/10
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
