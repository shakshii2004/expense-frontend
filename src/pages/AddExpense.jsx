import React, { useState, useEffect } from "react";
import API from "../api";
import {
  IndianRupee,
  FileText,
  Users,
  Calendar,
  ChevronDown,
  PlusCircle,
  X,
  Check
} from "lucide-react";
import Layout from "../components/Layout";
import GlassCard from "../components/GlassCard";
import Button from "../components/Button";
import Input from "../components/Input";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../utils/cn";

export default function AddExpense() {
  const [groups, setGroups] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [form, setForm] = useState({
    group: "",
    amount: "",
    description: "",
    paidBy: currentUser._id || "",
    splitWith: [], // only OTHER members selected
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const { data } = await API.get("/groups");
        setGroups(data);
        if (data.length > 0) {
          const firstGroup = data[0];
          setForm(prev => ({
            ...prev,
            group: firstGroup._id,
            paidBy: currentUser._id || "",
            // Filter out current user from initial split selection
            splitWith: (firstGroup.members || [])
              .filter(m => String(m._id) !== String(currentUser._id))
              .map(m => m._id)
          }));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchGroups();
  }, []);

  const selectedGroup = groups.find(g => g._id === form.group);

  const handleGroupChange = (groupId) => {
    const group = groups.find(g => g._id === groupId);
    setForm({
      ...form,
      group: groupId,
      paidBy: currentUser._id || "",
      // Filter out current user from selection
      splitWith: group?.members
        .filter(m => String(m._id) !== String(currentUser._id))
        .map(m => m._id) || []
    });
  };

  const participants = [...new Set([currentUser._id, ...form.splitWith])];
  const totalParticipants = participants.length;
  const sharePerPerson = form.amount && totalParticipants > 0
    ? (parseFloat(form.amount) / totalParticipants).toFixed(2)
    : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (totalParticipants === 0) {
      alert("Please select at least one participant.");
      return;
    }

    setLoading(true);
    try {
      const amount = parseFloat(form.amount);
      const share = amount / totalParticipants;

      const payload = {
        group: form.group,
        description: form.description,
        amount: amount,
        paidBy: currentUser._id,
        splitBetween: participants.map(userId => ({
          user: userId,
          share: share
        }))
      };

      await API.post("/expenses", payload);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setForm({
        group: groups[0]?._id || "",
        amount: "",
        description: "",
        paidBy: currentUser._id || "",
        // Filter out current user on reset
        splitWith: (groups[0]?.members || [])
          .filter(m => String(m._id) !== String(currentUser._id))
          .map(m => m._id),
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error adding expense");
    } finally {
      setLoading(false);
    }
  };

  const toggleMember = (memberId) => {
    setForm(prev => {
      const splitWith = prev.splitWith.includes(memberId)
        ? prev.splitWith.filter(id => id !== memberId)
        : [...prev.splitWith, memberId];
      return { ...prev, splitWith };
    });
  };

  const selectAllMembers = () => {
    if (selectedGroup) {
      setForm(prev => ({
        ...prev,
        // Select everyone EXCEPT current user
        splitWith: selectedGroup.members
          .filter(m => String(m._id) !== String(currentUser._id))
          .map(m => m._id)
      }));
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold">Add <span className="gradient-text">Expense</span></h1>
          <p className="mt-2 text-slate-400">Splitting between {totalParticipants} people (including you)</p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <GlassCard className="p-8 space-y-8">
            {/* Amount Input - Large and Center */}
            <div className="py-10 space-y-6 text-center border-b border-white/5">
              <label className="text-sm font-medium font-black tracking-widest uppercase text-slate-500">Amount</label>
              <div className="relative flex items-center justify-center gap-4 max-w-[400px] mx-auto mt-4">
                <div className="text-primary-400">
                  <IndianRupee size={48} strokeWidth={2.5} />
                </div>
                <input
                  type="number"
                  placeholder="0"
                  className="bg-transparent border-none text-7xl font-black focus:ring-0 placeholder:text-slate-800 selection:bg-primary-500/20 w-auto min-w-[100px] text-left"
                  style={{ width: form.amount.length > 0 ? `${form.amount.length + 1}ch` : '2ch' }}
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  required
                />
              </div>
              {form.amount && totalParticipants > 0 && (
                <p className="text-emerald-400 font-bold bg-emerald-500/10 inline-block px-4 py-1.5 rounded-full border border-emerald-500/20 animate-pulse">
                  ₹{sharePerPerson} per person
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold tracking-wider uppercase text-slate-400">Select Group</label>
                  <div className="relative">
                    <div className="absolute -translate-y-1/2 left-4 top-1/2 text-slate-500">
                      <Users size={18} />
                    </div>
                    <select
                      className="w-full appearance-none glass-input pl-11"
                      value={form.group}
                      onChange={(e) => handleGroupChange(e.target.value)}
                      required
                    >
                      {groups.map((g) => (
                        <option key={g._id} value={g._id} className="text-white bg-dark-800">
                          {g.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute -translate-y-1/2 pointer-events-none right-4 top-1/2 text-slate-500">
                      <ChevronDown size={18} />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold tracking-wider uppercase text-slate-400">Paid By</label>
                  <div className="relative">
                    <div className="absolute -translate-y-1/2 left-4 top-1/2 text-slate-500">
                      <Users size={18} />
                    </div>
                    <div className="flex items-center w-full cursor-not-allowed glass-input pl-11 text-white/50 bg-white/5">
                      {currentUser.name || "Me"} (You)
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 italic">Expenses are recorded as paid by you.</p>
                </div>

                <Input
                  label="Description"
                  placeholder="Dinner, Movie, Groceries..."
                  icon={FileText}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold tracking-wider uppercase text-slate-400">Split With</label>
                  <button
                    type="button"
                    onClick={selectAllMembers}
                    className="text-xs font-bold transition-colors text-primary-400 hover:text-primary-300"
                  >
                    SELECT ALL
                  </button>
                </div>
                <div className="glass-card p-4 border border-white/5 bg-white/5 min-h-[140px] flex flex-col">
                  {selectedGroup ? (
                    <div className="flex flex-wrap gap-2.5">
                      {selectedGroup.members
                        .filter(member => String(member._id) !== String(currentUser._id))
                        .map((member) => (
                          <button
                            type="button"
                            key={member._id}
                            onClick={() => toggleMember(member._id)}
                            className={cn(
                              "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-300 border",
                              form.splitWith.includes(member._id)
                                ? "bg-primary-500/20 border-primary-500/50 text-white shadow-lg shadow-primary-500/10"
                                : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10"
                            )}
                          >
                            <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[8px] font-black">
                              {member.name?.charAt(0)}
                            </div>
                            {member.name}
                            {form.splitWith.includes(member._id) && <Check size={12} strokeWidth={3} />}
                          </button>
                        ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center flex-1 space-y-2 text-slate-500">
                      <Users size={24} className="opacity-20" />
                      <p className="text-sm">Select a group first</p>
                    </div>
                  )}
                  {totalParticipants > 0 && (
                    <div className="pt-4 mt-auto border-t border-white/5">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Selected: {totalParticipants} people (Including you)</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, height: 0, scale: 0.9 }}
                  animate={{ opacity: 1, height: 'auto', scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.9 }}
                  className="flex items-center gap-3 p-4 border bg-emerald-500/10 border-emerald-500/20 rounded-2xl text-emerald-400"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20">
                    <Check size={20} strokeWidth={3} />
                  </div>
                  <div>
                    <p className="font-bold">Expense added successfully!</p>
                    <p className="text-xs opacity-70">The group balances have been updated.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-6">
              <Button type="submit" className="w-full py-5 text-xl font-black shadow-2xl shadow-primary-500/20" disabled={loading}>
                {loading ? (
                  <div className="w-6 h-6 border-2 rounded-full border-white/30 border-t-white animate-spin" />
                ) : (
                  <>
                    <PlusCircle size={24} strokeWidth={2.5} />
                    Add Transaction
                  </>
                )}
              </Button>
            </div>
          </GlassCard>
        </form>
      </div>
    </Layout>
  );
}