import React, { useEffect, useState } from "react";
import API from "../api";
import {
  TrendingUp,
  Users,
  CreditCard,
  IndianRupee, // Changed from DollarSign
  ArrowUpRight,
  Activity,
  Plus,
  Calendar,
  ArrowRight,
  History as HistoryIcon
} from "lucide-react";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import GlassCard from "../components/GlassCard";
import Button from "../components/Button";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expensesRes, groupsRes] = await Promise.all([
          API.get("/expenses"),
          API.get("/groups")
        ]);
        setExpenses(expensesRes.data);
        setGroups(groupsRes.data);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate stats excluding internal settlements
  const filteredExpenses = expenses.filter(exp => exp.description !== "Settlement Payment");
  const totalSpent = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const averageSpent = filteredExpenses.length > 0 ? (totalSpent / filteredExpenses.length).toFixed(2) : 0;
  const largestExpense = filteredExpenses.length > 0 ? [...filteredExpenses].sort((a, b) => b.amount - a.amount)[0] : null;

  // Use all expenses for the activity feed count, but maybe only show count of real expenses?
  // Let's stick to real expenses for the "Recent Transactions" count to be consistent.
  const transactionsCount = filteredExpenses.length;

  // Mock data for the chart (would ideally come from an API)
  const chartData = [
    { name: 'Mon', amount: 400 },
    { name: 'Tue', amount: 300 },
    { name: 'Wed', 'amount': 900 },
    { name: 'Thu', amount: 200 },
    { name: 'Fri', amount: 500 },
    { name: 'Sat', amount: 800 },
    { name: 'Sun', amount: 600 },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-bold">Hello, <span className="gradient-text">Alex!</span> 👋</h1>
            <p className="text-slate-400 mt-2">Here's what's happening with your expenses today.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex gap-4"
          >
            <Button variant="secondary" onClick={() => navigate('/history')}>
              <Calendar size={18} />
              View History
            </Button>
            <Button onClick={() => navigate('/add-expense')}>
              <Plus size={18} />
              Add Expense
            </Button>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Spent"
            value={`₹${totalSpent.toLocaleString()}`}
            icon={IndianRupee}
            trend="up"
            trendValue="+12%"
          />
          <StatCard
            title="Recent Transactions"
            value={transactionsCount.toString()}
            icon={Activity}
            color="accent"
            trend="down"
            trendValue="-4%"
          />
          <StatCard
            title="Active Groups"
            value={groups.length.toString()}
            icon={Users}
            color="primary"
          />
          <StatCard
            title="Average Spent"
            value={`₹${averageSpent}`}
            icon={CreditCard}
            color="accent"
            trend="up"
            trendValue="+8.5%"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <GlassCard className="lg:col-span-2 p-8" hover={false}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold">Spending Patterns</h3>
                <p className="text-sm text-slate-400">Weekly breakdown of your expenses</p>
              </div>
              <div className="flex gap-2">
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">
                  <TrendingUp size={14} />
                  +12.5%
                </span>
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 10 }}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#fff'
                    }}
                    itemStyle={{ color: '#10b981' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#10b981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorAmount)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Recent Activity */}
          <GlassCard className="p-8" hover={false}>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold">Recent Activity</h3>
              <ArrowUpRight size={18} className="text-slate-500" />
            </div>

            <div className="space-y-6">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <div key={i} className="flex gap-4 animate-pulse">
                    <div className="w-10 h-10 rounded-xl bg-slate-800" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-800 rounded w-1/2" />
                      <div className="h-3 bg-slate-800 rounded w-1/3" />
                    </div>
                  </div>
                ))
              ) : expenses.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HistoryIcon size={20} className="text-slate-500" />
                  </div>
                  <p className="text-slate-400">No recent transactions</p>
                </div>
              ) : (
                expenses.slice(0, 5).map((exp, idx) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={exp._id}
                    className="flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400 group-hover:bg-primary-500/20 transition-colors">
                        <CreditCard size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-white group-hover:text-primary-400 transition-colors line-clamp-1">{exp.description}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(exp.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white">₹{exp.amount}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            <Button variant="ghost" className="w-full mt-8 group" onClick={() => navigate('/history')}>
              View All Activity
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </GlassCard>
        </div>

        {/* Smart Insights Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard className="p-8 bg-gradient-to-r from-primary-500/5 to-accent-500/5 border-primary-500/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-400">
                  <TrendingUp size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Smart Insights</h3>
                  <p className="text-slate-400 mt-1">Based on your activity, you've spent 15% less than last month. Keep it up!</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="glass-card px-4 py-2 bg-white/5 text-xs font-medium border-white/5">
                  <span className="text-slate-500 mr-2">Last 7 Days:</span>
                  <span className="text-white">₹{chartData.reduce((s, d) => s + d.amount, 0).toLocaleString()}</span>
                </div>
                <div className="glass-card px-4 py-2 bg-white/5 text-xs font-medium border-white/5">
                  <span className="text-slate-500 mr-2">Largest Bill:</span>
                  <span className="text-white">
                    {largestExpense ? `₹${largestExpense.amount.toLocaleString()} (${largestExpense.description})` : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </Layout>
  );
}
