import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

const GlassCard = ({ children, className, hover = true, ...props }) => {
    return (
        <motion.div
            whileHover={hover ? { y: -8, transition: { duration: 0.3, ease: "easeOut" } } : {}}
            className={cn(
                "bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-[2rem] overflow-hidden relative group",
                className
            )}
            {...props}
        >
            {/* Premium Glow Effect */}
            <div className="absolute -inset-px bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem] pointer-events-none" />

            {/* Reflective Highlight */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>

            {/* Interactive Border */}
            {hover && (
                <div className="absolute inset-0 border border-primary-500/0 group-hover:border-primary-500/40 transition-colors duration-700 rounded-[2rem] pointer-events-none shadow-[0_0_20px_rgba(16,185,129,0)] group-hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]" />
            )}
        </motion.div>
    );
};

export default GlassCard;
