import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, PlusCircle, History, Landmark, User, LogOut, Scale } from 'lucide-react';
import { cn } from '../utils/cn';
import Button from './Button';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Groups', path: '/groups', icon: Users },
        { name: 'Add Expense', path: '/add-expense', icon: PlusCircle },
        { name: 'Settlements', path: '/settlements', icon: Landmark },
        { name: 'History', path: '/history', icon: History },
    ];

    return (
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-6xl">
            <div className="glass-card px-6 py-3 flex items-center justify-between backdrop-blur-2xl">
                {/* Logo */}
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
                        <Scale size={24} />
                    </div>
                    <span className="text-xl font-bold hidden sm:block">SplitTrack <span className="text-primary-400">⚖️</span></span>
                </div>

                {/* Desktop Links */}
                <div className="hidden lg:flex items-center gap-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => cn(
                                "nav-link",
                                isActive && "active"
                            )}
                        >
                            <item.icon size={18} />
                            <span>{item.name}</span>
                        </NavLink>
                    ))}
                </div>

                {/* Profile & Logout */}
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer">
                        <User size={20} />
                    </div>
                    <Button variant="ghost" className="p-2 text-red-500 hover:bg-red-500/10 hover:text-red-400" onClick={handleLogout}>
                        <LogOut size={20} />
                        <span className="hidden md:block">Logout</span>
                    </Button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
