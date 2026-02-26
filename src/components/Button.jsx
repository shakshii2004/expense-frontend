import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

const Button = ({ children, variant = 'primary', className, ...props }) => {
    const variants = {
        primary: 'bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:brightness-110',
        secondary: 'bg-white/10 border border-white/10 hover:bg-white/20 text-white backdrop-blur-md',
        ghost: 'hover:bg-white/5 text-slate-400 hover:text-white',
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "relative overflow-hidden px-8 py-3.5 rounded-2xl font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 group",
                variants[variant],
                className
            )}
            {...props}
        >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />

            <span className="relative z-10 flex items-center gap-2">
                {children}
            </span>
        </motion.button>
    );
};

export default Button;
