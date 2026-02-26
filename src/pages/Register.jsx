import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import { User, Mail, Lock, UserPlus, Scale, ArrowRight, ShieldCheck } from "lucide-react";
import GlassCard from "../components/GlassCard";
import Button from "../components/Button";
import Input from "../components/Input";
import { motion } from "framer-motion";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await API.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-mesh opacity-50" />
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-accent-500/20 blur-[100px] rounded-full" />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-primary-500/20 blur-[100px] rounded-full" />

      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Side: Content */}
        <div className="hidden lg:flex flex-col gap-6 text-white p-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-600 to-accent-400 flex items-center justify-center text-white mb-8 shadow-2xl shadow-accent-500/40">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-5xl font-bold leading-tight">
              Start your <br />
              financial <br />
              <span className="gradient-text">Journey.</span>
            </h1>
            <p className="text-slate-400 text-lg mt-6 max-w-md">
              Join thousands of users who have revolutionized the way they manage shared expenses.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-12 space-y-4"
          >
            <div className="glass-card p-6 bg-white/5 border-white/5">
              <p className="italic text-slate-300">
                "SplitTrack has completely changed how our flatmates handle bills. No more awkward conversations!"
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-500/20" />
                <div>
                  <p className="text-sm font-bold">Alex Johnson</p>
                  <p className="text-xs text-slate-500">Power User</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Register Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard className="p-10 border-white/5 bg-white/5 backdrop-blur-2xl">
            <div className="mb-8">
              <h2 className="text-3xl font-bold">Create Account</h2>
              <p className="text-slate-400 mt-2">Get started with SplitTrack today</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                icon={User}
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                icon={Mail}
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full py-4 text-lg" disabled={loading}>
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus size={20} className="mr-2" />
                    Create Account
                  </>
                )}
              </Button>

              <div className="text-center text-slate-400 mt-8">
                Already have an account?{" "}
                <Link to="/login" className="text-white hover:text-primary-400 font-semibold transition-colors">
                  Log in here
                </Link>
              </div>
            </form>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}