import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API, { setAuthToken } from "../api";
import { Mail, Lock, LogIn, Scale, ArrowRight } from "lucide-react";
import GlassCard from "../components/GlassCard";
import Button from "../components/Button";
import Input from "../components/Input";
import { motion } from "framer-motion";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await API.post("/auth/login", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user)); // Store user object
      setAuthToken(data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-mesh opacity-50" />
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary-500/20 blur-[100px] rounded-full" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent-500/20 blur-[100px] rounded-full" />

      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Side: Illustration & Text */}
        <div className="hidden lg:flex flex-col gap-6 text-white p-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center text-white mb-8 shadow-2xl shadow-primary-500/40">
              <Scale size={32} />
            </div>
            <h1 className="text-5xl font-bold leading-tight">
              Manage your <br />
              expenses with <br />
              <span className="gradient-text">Precision.</span>
            </h1>
            <p className="text-slate-400 text-lg mt-6 max-w-md">
              Split bills, track spending, and settle debts with ease. Join our community of smart spenders today.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-12 space-y-4"
          >
            {[
              "Real-time expense splitting",
              "Advanced spending analytics",
              "Seamless settlements",
              "Multi-group management"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-300">
                <div className="w-5 h-5 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400">
                  <ArrowRight size={14} />
                </div>
                <span>{text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right Side: Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard className="p-10 border-white/5 bg-white/5 backdrop-blur-2xl">
            <div className="mb-8">
              <h2 className="text-3xl font-bold">Welcome Back</h2>
              <p className="text-slate-400 mt-2">Log in to your account to continue</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                icon={Mail}
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <div className="space-y-1">
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  icon={Lock}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <div className="text-right">
                  <a href="#" className="text-sm font-medium text-primary-400 hover:text-primary-300">
                    Forgot password?
                  </a>
                </div>
              </div>

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
                    <LogIn size={20} className="mr-2" />
                    Sign In
                  </>
                )}
              </Button>

              <div className="text-center text-slate-400 mt-8">
                Don't have an account?{" "}
                <Link to="/register" className="text-white hover:text-primary-400 font-semibold transition-colors">
                  Create an account
                </Link>
              </div>
            </form>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}