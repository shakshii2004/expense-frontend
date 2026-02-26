import React, { useEffect, useState } from "react";
import API from "../api";
import {
    History as HistoryIcon,
    Search,
    Filter,
    Calendar,
    CreditCard,
    ArrowUpRight,
    ArrowDownRight,
    ChevronRight,
    ShoppingCart,
    Coffee,
    Car,
    Home,
    Utensils,
    CheckCircle2
} from "lucide-react";
import Layout from "../components/Layout";
import GlassCard from "../components/GlassCard";
import Button from "../components/Button";
import Input from "../components/Input";
import { motion } from "framer-motion";

export default function History() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const { data } = await API.get("/expenses");
                setExpenses(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchExpenses();
    }, []);

    const getCategoryIcon = (description) => {
        const desc = description.toLowerCase();
        if (desc.includes('settlement')) return CheckCircle2;
        if (desc.includes('food') || desc.includes('dinner') || desc.includes('lunch')) return Utensils;
        if (desc.includes('coffee') || desc.includes('starbucks')) return Coffee;
        if (desc.includes('rent') || desc.includes('utility')) return Home;
        if (desc.includes('uber') || desc.includes('taxi') || desc.includes('car')) return Car;
        if (desc.includes('grocery') || desc.includes('shop')) return ShoppingCart;
        return CreditCard;
    };

    const filteredExpenses = expenses.filter(exp =>
        exp.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Layout>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-bold">Transaction <span className="gradient-text">History</span></h1>
                        <p className="text-slate-400 mt-2">A detailed log of all your shared expenses and activities.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative w-full md:w-64">
                            <Input
                                placeholder="Search history..."
                                icon={Search}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="py-2"
                            />
                        </div>
                        <Button variant="secondary" className="px-4">
                            <Filter size={18} />
                        </Button>
                    </div>
                </div>

                <div className="space-y-4">
                    {loading ? (
                        Array(5).fill(0).map((_, i) => (
                            <div key={i} className="h-20 glass-card animate-pulse bg-slate-800/20" />
                        ))
                    ) : filteredExpenses.length === 0 ? (
                        <div className="text-center py-20">
                            <HistoryIcon size={48} className="mx-auto text-slate-800 mb-4" />
                            <p className="text-slate-500">No transactions found matching your search.</p>
                        </div>
                    ) : (
                        filteredExpenses.map((exp, idx) => {
                            const Icon = getCategoryIcon(exp.description);
                            return (
                                <motion.div
                                    key={exp._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <GlassCard className="p-4 hover:bg-white/10 transition-colors cursor-pointer group">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary-500/20 group-hover:text-primary-400 transition-colors shadow-inner">
                                                    <Icon size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white group-hover:text-primary-400 transition-colors">
                                                        {exp.description}
                                                    </h4>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-xs text-slate-500 flex items-center gap-1">
                                                            <Calendar size={12} />
                                                            {new Date(exp.date).toLocaleDateString(undefined, {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })}
                                                        </span>
                                                        <span className="text-xs text-slate-500 flex items-center gap-1">
                                                            <CreditCard size={12} />
                                                            {exp.description.includes('Settlement')
                                                                ? 'Debt Settlement'
                                                                : `Split with ${exp.splitBetween?.length || 0} members`}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <p className="text-xl font-bold text-white">₹{exp.amount.toFixed(2)}</p>
                                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Amount</p>
                                                </div>
                                                <ChevronRight size={20} className="text-slate-700 group-hover:text-white transition-colors" />
                                            </div>
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </div>
        </Layout>
    );
}
