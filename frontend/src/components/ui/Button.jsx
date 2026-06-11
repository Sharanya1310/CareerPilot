import React from 'react';

export const Button = ({ children, variant = "primary", className = "", isActive = false, ...props }) => {
  const baseStyle = "inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2";
  const variants = {
    primary: "bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-800 dark:bg-zinc-900 dark:border-zinc-850 dark:text-zinc-200 shadow-sm",
    secondary: "bg-[#161920] hover:bg-[#1f2430] text-zinc-700 dark:text-zinc-100 border border-[#232936] dark:border-zinc-700",
    ghost: "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-[#161920]",
    brand: "bg-gradient-to-r from-[#7c4dff] to-[#64b5f6] text-white hover:opacity-95 shadow-md border-transparent",
    pill: isActive
      ? "bg-white border border-zinc-850 text-zinc-900 rounded-full h-8 px-5 text-xs font-bold shadow-sm dark:bg-[#262629] dark:border-zinc-700 dark:text-white"
      : "bg-white border border-zinc-200 text-zinc-550 rounded-full h-8 px-5 text-xs font-medium hover:bg-zinc-50 hover:border-zinc-350 shadow-sm dark:bg-transparent dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-[#1e1e21] dark:hover:border-zinc-700"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
