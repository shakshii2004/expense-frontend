import React, { useState, useEffect } from "react";
import { X, Search, UserPlus, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "./GlassCard";
import Button from "./Button";
import Input from "./Input";
import API from "../api";
import { cn } from "../utils/cn";

const AddMemberModal = ({ isOpen, onClose, group, onMemberAdded }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setSearchQuery("");
            setSearchResults([]);
        }
    }, [isOpen]);

    useEffect(() => {
        const searchUsers = async () => {
            if (searchQuery.length < 2) {
                setSearchResults([]);
                return;
            }
            try {
                const { data } = await API.get(`/auth/users?email=${searchQuery}`);
                setSearchResults(data);
            } catch (err) {
                console.error("Error searching users", err);
            }
        };

        const timer = setTimeout(searchUsers, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleAddMember = async (user) => {
        setLoading(true);
        try {
            await API.patch(`/groups/${group._id}/members`, {
                userId: user._id
            });
            onMemberAdded();
            onClose();
        } catch (err) {
            console.error("Error adding member", err);
            alert(err.response?.data?.msg || "Error adding member");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-dark-900/80 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-md z-10"
                >
                    <GlassCard className="p-8 shadow-2xl border-white/10">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary-500/10 rounded-lg text-primary-400">
                                    <UserPlus size={20} />
                                </div>
                                <h3 className="text-xl font-bold text-white">Add Member</h3>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-slate-500">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <p className="text-sm text-slate-400">
                                Adding to <span className="text-white font-medium">{group?.name}</span>
                            </p>
                            <Input
                                placeholder="Search by email..."
                                icon={Search}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                            />

                            <div className="glass-card mt-2 divide-y divide-white/5 max-h-[240px] overflow-y-auto">
                                {searchResults.length > 0 ? (
                                    searchResults.map((user) => (
                                        <div
                                            key={user._id}
                                            className="flex items-center justify-between p-3 hover:bg-white/5 transition-colors cursor-pointer group"
                                            onClick={() => handleAddMember(user)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                                                    {user.name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-white">{user.name}</p>
                                                    <p className="text-xs text-slate-500">{user.email}</p>
                                                </div>
                                            </div>
                                            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-primary-500 group-hover:border-primary-500 transition-all text-white">
                                                <Plus size={14} />
                                            </div>
                                        </div>
                                    ))
                                ) : searchQuery.length >= 2 ? (
                                    <p className="p-4 text-center text-sm text-slate-500">No users found</p>
                                ) : null}
                            </div>
                        </div>

                        <div className="mt-6">
                            <Button variant="secondary" onClick={onClose} className="w-full">
                                Cancel
                            </Button>
                        </div>
                    </GlassCard>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

const Plus = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

export default AddMemberModal;
