import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, style }) => {
  return (
    <div className={`card ${className}`} style={style}>
      {title && <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '1.1rem' }}>{title}</h3>}
      {children}
    </div>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const styles: React.CSSProperties = {
    width: fullWidth ? '100%' : 'auto',
    backgroundColor: `var(--${variant}-color)`,
    color: variant === 'ghost' ? 'var(--text-secondary)' : 'var(--text-primary)',
    boxShadow: variant === 'ghost' ? 'none' : '0 2px 10px rgba(0,0,0,0.05)',
  };

  if (variant === 'ghost') {
    styles.backgroundColor = 'transparent';
    styles.padding = '8px 16px';
  }

  return (
    <button className={className} style={styles} {...props}>
      {children}
    </button>
  );
};
