import React, { ReactNode } from 'react';

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'white' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'md', className = '', children, ...props }) => {
  const baseStyles = "inline-flex items-center justify-center font-bold transition-all duration-300 rounded-full focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95";
  
  const variants = {
    // Primary: Brand Blue background, White text. For main actions on light backgrounds.
    primary: "bg-brand-blue text-white hover:bg-brand-dark hover:shadow-lg hover:shadow-brand-blue/30 border border-transparent",
    
    // Secondary: White background, Dark text. For secondary actions on light backgrounds.
    secondary: "bg-white text-slate-700 border border-slate-200 hover:border-brand-blue hover:text-brand-blue hover:shadow-md",
    
    // Outline: Transparent background, Blue border/text.
    outline: "border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white shadow-none",
    
    // Ghost: No background, simple text.
    ghost: "text-slate-500 hover:text-brand-blue shadow-none hover:shadow-none bg-transparent hover:bg-brand-light",
    
    // White: White background, Blue text. CRITICAL for Blue Backgrounds.
    white: "bg-white text-brand-blue hover:bg-slate-100 hover:scale-105 hover:shadow-xl border border-white",
    
    // Glass: Semi-transparent white. For subtle actions on Blue backgrounds.
    glass: "bg-white/10 backdrop-blur-md text-white border border-white/30 hover:bg-white/20 hover:border-white/50"
  };

  const sizes = {
    sm: "px-5 py-2 text-sm",
    md: "px-8 py-3.5 text-base",
    lg: "px-10 py-4 text-lg"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// --- Section Title ---
export const SectionTitle: React.FC<{ title: string; subtitle?: string; align?: 'left' | 'center'; light?: boolean }> = ({ title, subtitle, align = 'center', light = false }) => (
  <div className={`mb-16 ${align === 'center' ? 'text-center' : 'text-left'}`}>
    {subtitle && <span className={`block text-sm font-bold uppercase tracking-[0.2em] mb-3 ${light ? 'text-blue-200' : 'text-brand-blue'}`}>{subtitle}</span>}
    <h2 className={`text-4xl md:text-6xl font-display font-bold uppercase leading-none tracking-tight ${light ? 'text-white' : 'text-slate-900'}`}>
      {title}
    </h2>
    {/* Decorative line */}
    <div className={`h-1.5 w-24 bg-brand-blue mt-6 rounded-full ${align === 'center' ? 'mx-auto' : ''}`} />
  </div>
);

// --- Card ---
export const Card: React.FC<{ children: ReactNode; className?: string; hoverEffect?: boolean }> = ({ children, className = '', hoverEffect = true }) => (
  <div className={`bg-white rounded-3xl p-8 border border-slate-100 ${hoverEffect ? 'hover:shadow-hover transition-all duration-500 hover:-translate-y-1 hover:border-brand-blue/20' : ''} shadow-soft ${className}`}>
    {children}
  </div>
);

// --- Badge ---
export const Badge: React.FC<{ children: ReactNode; color?: 'blue' | 'dark' | 'white' }> = ({ children, color = 'blue' }) => {
  const colors = {
    blue: "bg-brand-light text-brand-blue border-blue-100",
    dark: "bg-brand-dark text-white border-brand-dark",
    white: "bg-white/20 backdrop-blur-md text-white border-white/40"
  };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${colors[color]}`}>
      {children}
    </span>
  );
};