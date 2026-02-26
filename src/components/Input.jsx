import React from 'react';
import { cn } from '../utils/cn';

const Input = ({ label, icon: Icon, className, error, ...props }) => {
    return (
        <div className="space-y-2 w-full group">
            {label && (
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 group-focus-within:text-primary-400 transition-colors ml-1">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-400 transition-colors">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    className={cn(
                        "bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 w-full focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500/50 transition-all duration-300 placeholder:text-slate-600 text-white shadow-inner",
                        Icon && "pl-12",
                        error && "border-red-500/50 focus:ring-red-500/10 focus:border-red-500/50",
                        className
                    )}
                    {...props}
                />
                {/* Focus Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-primary-500/5 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity duration-300" />
            </div>
            {error && <p className="text-xs text-red-400 mt-1 ml-1 font-medium">{error}</p>}
        </div>
    );
};

export default Input;
