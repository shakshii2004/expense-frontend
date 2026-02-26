import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { Users, Plus, ArrowRight, UserCheck, MoreVertical, Edit2, Trash2, X, Check } from "lucide-react";
import Layout from "../components/Layout";
import GlassCard from "../components/GlassCard";
import Button from "../components/Button";
import { motion } from "framer-motion";

import CreateGroupModal from "../components/CreateGroupModal";
import AddMemberModal from "../components/AddMemberModal";

export default function Groups() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [menuOpenId, setMenuOpenId] = useState(null);
    const [newName, setNewName] = useState("");
    const navigate = useNavigate();

    const fetchGroups = async () => {
        setLoading(true);
        try {
            const { data } = await API.get("/groups");
            setGroups(data);
        } catch (err) {
            console.error("Error fetching groups", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    const openAddMember = (group) => {
        setSelectedGroup(group);
        setIsAddMemberModalOpen(true);
    };

    const handleNavigateToSettlements = (groupId) => {
        navigate("/settlements", { state: { groupId } });
    };

    const handleRenameClick = (group) => {
        setSelectedGroup(group);
        setNewName(group.name);
        setIsRenameModalOpen(true);
        setMenuOpenId(null);
    };

    const handleRenameGroup = async () => {
        if (!newName.trim() || newName === selectedGroup.name) {
            setIsRenameModalOpen(false);
            return;
        }

        try {
            await API.patch(`/groups/${selectedGroup._id}`, { name: newName });
            fetchGroups();
            setIsRenameModalOpen(false);
        } catch (err) {
            console.error("Error renaming group", err);
            alert(err.response?.data?.message || "Failed to rename group");
        }
    };

    const handleDeleteGroup = async (group) => {
        if (!window.confirm(`Are you sure you want to delete "${group.name}"? This will also delete all associated expenses.`)) {
            return;
        }

        try {
            await API.delete(`/groups/${group._id}`);
            fetchGroups();
            setMenuOpenId(null);
        } catch (err) {
            console.error("Error deleting group", err);
            alert(err.response?.data?.message || "Failed to delete group");
        }
    };

    return (
        <Layout>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold">Your <span className="gradient-text">Groups</span></h1>
                        <p className="text-slate-400 mt-2">Manage shared expenses with your friends and family.</p>
                    </div>
                    <Button className="hidden sm:flex" onClick={() => setIsCreateModalOpen(true)}>
                        <Plus size={18} />
                        Create New Group
                    </Button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-48 glass-card animate-pulse bg-slate-800/20" />
                        ))}
                    </div>
                ) : groups.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 rounded-3xl bg-primary-500/10 flex items-center justify-center text-primary-400 mb-6">
                            <Users size={40} />
                        </div>
                        <h2 className="text-2xl font-bold">No groups found</h2>
                        <p className="text-slate-400 mt-2 max-w-md mx-auto">
                            You haven't joined any groups yet. Create a new group to start splitting expenses!
                        </p>
                        <Button className="mt-8" onClick={() => setIsCreateModalOpen(true)}>
                            <Plus size={18} />
                            Create your first group
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {groups.map((group, idx) => (
                            <motion.div
                                key={group._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <GlassCard
                                    className="group p-8 cursor-pointer hover:border-primary-500/30 transition-all duration-500"
                                    onClick={() => handleNavigateToSettlements(group._id)}
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                                            <Users size={24} />
                                        </div>
                                        <div className="relative">
                                            <button
                                                className={`text-slate-500 hover:text-white transition-colors p-1 rounded-lg ${menuOpenId === group._id ? 'bg-white/10 text-white' : ''}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setMenuOpenId(menuOpenId === group._id ? null : group._id);
                                                }}
                                            >
                                                <MoreVertical size={20} />
                                            </button>

                                            {menuOpenId === group._id && (
                                                <>
                                                    <div
                                                        className="fixed inset-0 z-10"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setMenuOpenId(null);
                                                        }}
                                                    />
                                                    <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-900 border border-white/10 shadow-2xl z-20 overflow-hidden py-1 animate-in fade-in zoom-in duration-200">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRenameClick(group);
                                                            }}
                                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                                                        >
                                                            <Edit2 size={16} />
                                                            Rename Group
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteGroup(group);
                                                            }}
                                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                            Delete Group
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-bold group-hover:text-primary-400 transition-colors">{group.name}</h3>

                                    <div className="flex items-center gap-3 mt-5">
                                        <div className="flex -space-x-2.5 overflow-hidden">
                                            {group.members?.slice(0, 4).map((member, i) => (
                                                <div
                                                    key={i}
                                                    className="inline-block h-9 w-9 rounded-full ring-2 ring-dark-800 bg-slate-800 border border-white/5 flex items-center justify-center text-[10px] font-bold text-white"
                                                    title={member.name}
                                                >
                                                    {member.name?.charAt(0)}
                                                </div>
                                            ))}
                                            {group.members?.length > 4 && (
                                                <div className="inline-block h-9 w-9 rounded-full ring-2 ring-dark-800 bg-slate-900 flex items-center justify-center text-[10px] font-bold text-slate-400 border border-white/5">
                                                    +{group.members.length - 4}
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openAddMember(group);
                                            }}
                                            className="w-9 h-9 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center text-slate-500 hover:text-primary-400 hover:border-primary-500/50 transition-all hover:bg-primary-500/5"
                                            title="Add Member"
                                        >
                                            <Plus size={16} />
                                        </button>
                                        <span className="text-xs font-medium text-slate-500 ml-1">
                                            {group.members?.length} {group.members?.length === 1 ? 'member' : 'members'}
                                        </span>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Total Balance</p>
                                            <p className="text-xl font-black text-white">
                                                ₹{group.totalBalance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            className="p-3 hover:bg-white/5 rounded-2xl group/btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleNavigateToSettlements(group._id);
                                            }}
                                        >
                                            <ArrowRight size={20} className="text-slate-500 group-hover/btn:text-white group-hover/btn:translate-x-0.5 transition-all" />
                                        </Button>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Floating Action Button for Mobile */}
            <div className="sm:hidden fixed bottom-8 right-8">
                <Button className="w-14 h-14 rounded-2xl shadow-2xl shadow-primary-500/40 p-0" onClick={() => setIsCreateModalOpen(true)}>
                    <Plus size={28} />
                </Button>
            </div>

            <CreateGroupModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onGroupCreated={fetchGroups}
            />

            <AddMemberModal
                isOpen={isAddMemberModalOpen}
                onClose={() => setIsAddMemberModalOpen(false)}
                group={selectedGroup}
                onMemberAdded={fetchGroups}
            />

            {/* Rename Modal */}
            {isRenameModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsRenameModalOpen(false)}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-slate-900 border border-white/10 w-full max-w-md rounded-3xl shadow-2xl z-50 overflow-hidden"
                    >
                        <div className="p-6 border-b border-white/5 flex justify-between items-center">
                            <h3 className="text-xl font-bold">Rename <span className="gradient-text">Group</span></h3>
                            <button onClick={() => setIsRenameModalOpen(false)} className="p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-400">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400 ml-1">Group Name</label>
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="Enter new group name"
                                    className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium text-white placeholder:text-slate-600"
                                    autoFocus
                                    onKeyDown={(e) => e.key === 'Enter' && handleRenameGroup()}
                                />
                            </div>
                        </div>
                        <div className="p-6 bg-slate-800/20 border-t border-white/5 flex gap-3">
                            <Button variant="secondary" className="flex-1" onClick={() => setIsRenameModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button className="flex-1" onClick={handleRenameGroup}>
                                <Check size={18} />
                                Update Name
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </Layout>
    );
}
