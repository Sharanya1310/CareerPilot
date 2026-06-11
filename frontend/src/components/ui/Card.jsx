import React from 'react';

export const Card = ({ children, className = "" }) => (
  <div className={`bg-card border border-border rounded-xl p-5 shadow-sm transition-all duration-200 hover:border-zinc-700 ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ children, className = "" }) => (
  <div className={`flex flex-col space-y-1.5 pb-4 ${className}`}>{children}</div>
);

export const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-sm font-medium text-muted-foreground tracking-tight ${className}`}>{children}</h3>
);

export const CardContent = ({ children, className = "" }) => (
  <div className={className}>{children}</div>
);