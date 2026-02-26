import React from 'react';
import GlassCard from './GlassCard';
import { cn } from '../utils/cn';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'primary' }) => {
    return (
        <GlassCard className="flex flex-col items-center text-center gap-3 relative py-4">
            {trend && (
                <div className={cn(
                    "absolute top-3 right-3 flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                    trend === 'up' ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                )}>
                    {trend === 'up' ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                    {trendValue}
                </div>
            )}

            <div className={cn(
                "p-3 rounded-xl mb-1",
                color === 'primary' ? "bg-primary-500/10 text-primary-400" : "bg-accent-500/10 text-accent-400"
            )}>
                <Icon size={20} />
            </div>

            <div className="space-y-0.5">
                <h3 className="text-slate-400 text-[10px] font-bold tracking-wider uppercase">{title}</h3>
                <p className="text-3xl font-black text-white">{value}</p>
            </div>
        </GlassCard>
    );
};

export default StatCard;
