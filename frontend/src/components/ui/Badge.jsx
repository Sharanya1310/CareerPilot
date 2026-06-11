import React from 'react';

export const Badge = ({ children, variant = "default" }) => {
  const styles = {
    default: "bg-zinc-800 text-zinc-200 border-zinc-700",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    brand: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${styles[variant]}`}>
      {children}
    </span>
  );
};
