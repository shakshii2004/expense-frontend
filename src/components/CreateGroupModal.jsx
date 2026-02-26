import React, { useState, useEffect } from "react";
import { X, Search, Users, Plus, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "./GlassCard";
import Button from "./Button";
import Input from "./Input";
import API from "../api";
import { cn } from "../utils/cn";

const CreateGroupModal = ({ isOpen, onClose, onGroupCreated }) => {
    const [name, setName] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setName("");
            setSearchQuery("");
            setSearchResults([]);
            setSelectedMembers([]);
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

    const toggleMember = (user) => {
        if (selectedMembers.find((m) => m._id === user._id)) {
            setSelectedMembers(selectedMembers.filter((m) => m._id !== user._id));
        } else {
            setSelectedMembers([...selectedMembers, user]);
        }
    };

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        try {
            const memberIds = selectedMembers.map((m) => m._id);
            await API.post("/groups", {
                name,
                members: memberIds,
            });
            onGroupCreated();
            onClose();
        } catch (err) {
            console.error("Error creating group", err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 h-full w-full">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-dark-900/80 backdrop-blur-sm"
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg z-10"
                >
                    <GlassCard className="p-8 shadow-2xl overflow-hidden border-white/10">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-primary-500/10 rounded-xl text-primary-400">
                                    <Users size={24} />
                                </div>
                                <h3 className="text-2xl font-bold text-white">New Group</h3>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/5 rounded-xl text-slate-500 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateGroup} className="space-y-8">
                            <Input
                                label="Group Name"
                                placeholder="Summer Trip, Roomies, etc."
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />

                            <div className="space-y-4">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
                                    Invite Members
                                </label>
                                <Input
                                    placeholder="Search by email..."
                                    icon={Search}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />

                                {/* Selected Members */}
                                {selectedMembers.length > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {selectedMembers.map((member) => (
                                            <div
                                                key={member._id}
                                                className="flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 text-primary-400 py-1.5 pl-2 pr-1 rounded-lg text-sm"
                                            >
                                                <span>{member.email}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => toggleMember(member)}
                                                    className="p-0.5 hover:bg-primary-500/20 rounded-md transition-colors"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Search Results */}
                                {searchResults.length > 0 && (
                                    <div className="glass-card mt-2 divide-y divide-white/5 max-h-[160px] overflow-y-auto">
                                        {searchResults.map((user) => (
                                            <div
                                                key={user._id}
                                                className="flex items-center justify-between p-3 hover:bg-white/5 transition-colors cursor-pointer group"
                                                onClick={() => toggleMember(user)}
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
                                                <div className={cn(
                                                    "w-5 h-5 rounded-full border border-white/10 flex items-center justify-center transition-all",
                                                    selectedMembers.find(m => m._id === user._id) ? "bg-emerald-500 border-emerald-500 text-white" : "group-hover:border-primary-500/50"
                                                )}>
                                                    {selectedMembers.find(m => m._id === user._id) && <Check size={12} />}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button
                                    variant="secondary"
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading || !name.trim()}
                                    className="flex-1 px-8"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Plus size={18} />
                                            Create Group
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </GlassCard>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default CreateGroupModal;
