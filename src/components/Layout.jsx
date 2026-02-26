import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-dark-900 text-white selection:bg-primary-500/30">
            {/* Background Mesh Overlay */}
            <div className="fixed inset-0 bg-mesh opacity-60 pointer-events-none" />

            {/* Animated Background Blobs */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 blur-[120px] rounded-full animate-pulse-slow" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-500/10 blur-[120px] rounded-full animate-pulse-slow delay-1000" />

            <Navbar />

            <main className="relative z-10 pt-32 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {children}
            </main>
        </div>
    );
};

export default Layout;
