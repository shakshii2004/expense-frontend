import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import API from "../api";
import {
    Users,
    ArrowRight,
    CheckCircle2,
    AlertCircle,
    Filter,
    ChevronDown,
    ArrowDownLeft,
    IndianRupee
} from "lucide-react";
import Layout from "../components/Layout";
import GlassCard from "../components/GlassCard";
import Button from "../components/Button";
import { motion, AnimatePresence } from "framer-motion";

export default function Settlements() {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState("");
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null); // Track which index is settling
    const [message, setMessage] = useState({ text: "", type: "" });
    const location = useLocation();

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const res = await API.get("/groups");
                setGroups(res.data);

                // Determine which group to select: from state or the first one
                let groupIdToSelect = "";
                if (location.state?.groupId) {
                    groupIdToSelect = location.state.groupId;
                } else if (res.data.length > 0) {
                    groupIdToSelect = res.data[0]._id;
                }

                if (groupIdToSelect) {
                    setSelectedGroup(groupIdToSelect);
                    fetchSettlements(groupIdToSelect);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchGroups();
    }, [location.state?.groupId]);

    const fetchSettlements = async (groupId) => {
        setLoading(true);
        try {
            const res = await API.get(`/settlements/${groupId}`);
            setTransactions(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGroupChange = (e) => {
        const groupId = e.target.value;
        setSelectedGroup(groupId);
        fetchSettlements(groupId);
    };

    const handleConfirmSettle = async (t, index) => {
        setActionLoading(index);
        setMessage({ text: "", type: "" });
        try {
            await API.post("/settlements/settle", {
                groupId: selectedGroup,
                fromId: t.fromId,
                toId: t.toId,
                amount: t.amount
            });
            setMessage({ text: `Successfully settled ₹${t.amount} between ${t.from} and ${t.to}`, type: "success" });
            fetchSettlements(selectedGroup);
            setTimeout(() => setMessage({ text: "", type: "" }), 5000);
        } catch (err) {
            console.error(err);
            setMessage({ text: err.response?.data?.message || "Failed to confirm settlement", type: "error" });
        } finally {
            setActionLoading(null);
        }
    };

    const handleSendReminder = (t) => {
        setMessage({ text: `Reminder sent to ${t.from}!`, type: "success" });
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    };

    return (
        <Layout>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-bold">Debt <span className="gradient-text">Settlements</span></h1>
                        <p className="text-slate-400 mt-2">Settle your balances and keep track of who owes who.</p>
                    </div>

                    <div className="relative min-w-[200px]">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                            <Filter size={18} />
                        </div>
                        <select
                            value={selectedGroup}
                            onChange={handleGroupChange}
                            className="glass-input w-full pl-11 appearance-none pr-10"
                        >
                            {groups.map((g) => (
                                <option key={g._id} value={g._id} className="bg-dark-800">
                                    {g.name}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                            <ChevronDown size={18} />
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {message.text && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={cn(
                                "p-4 rounded-xl flex items-center gap-3 border",
                                message.type === "success"
                                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                    : "bg-red-500/10 border-red-500/20 text-red-400"
                            )}
                        >
                            {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                            <span className="text-sm font-bold">{message.text}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-24 glass-card animate-pulse bg-slate-800/20" />
                        ))}
                    </div>
                ) : transactions.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-20 text-center"
                    >
                        <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6 border border-emerald-500/20">
                            <CheckCircle2 size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-white">All Settled Up!</h2>
                        <p className="text-slate-400 mt-2 max-w-sm mx-auto">
                            No outstanding balances for this group. Great work keeping things fair!
                        </p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <AnimatePresence>
                            {transactions.map((t, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <GlassCard className="p-0 overflow-hidden group">
                                        <div className="p-6 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="flex -space-x-2">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center border-2 border-dark-900 shadow-lg text-xs font-bold">
                                                        {t.from?.charAt(0)}
                                                    </div>
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center border-2 border-dark-900 shadow-lg text-xs font-bold">
                                                        {t.to?.charAt(0)}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-white">
                                                        {t.from} <ArrowRight size={14} className="inline mx-1 text-slate-500" /> {t.to}
                                                    </p>
                                                    <p className="text-xs text-slate-500">Direct settlement</p>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-xl font-bold text-white">₹{t.amount.toLocaleString()}</p>
                                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Pending</p>
                                            </div>
                                        </div>

                                        <div className="bg-white/5 p-4 flex gap-3 border-t border-white/5">
                                            <Button
                                                className="flex-1 py-2 text-sm font-bold"
                                                variant="primary"
                                                onClick={() => handleConfirmSettle(t, i)}
                                                disabled={actionLoading !== null}
                                            >
                                                {actionLoading === i ? (
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                ) : "Confirm Settle"}
                                            </Button>
                                            <Button
                                                className="flex-1 py-2 text-sm font-bold"
                                                variant="secondary"
                                                onClick={() => handleSendReminder(t)}
                                                disabled={actionLoading !== null}
                                            >
                                                Send Reminder
                                            </Button>
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                <GlassCard className="p-6 bg-primary-500/5 border-primary-500/10 flex items-start gap-4">
                    <div className="p-2 bg-primary-500/20 rounded-lg text-primary-400 mt-1">
                        <AlertCircle size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold text-white">Smart Settlement Tip</h4>
                        <p className="text-sm text-slate-400 mt-1">
                            Confirmed settlements will automatically update group balances and clear the transaction from the list.
                            Always verify payments before confirming.
                        </p>
                    </div>
                </GlassCard>
            </div>
        </Layout>
    );
}

const cn = (...classes) => classes.filter(Boolean).join(" ");
