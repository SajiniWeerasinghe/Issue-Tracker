import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';
import logo from '../assets/logo.png';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
        setShowDropdown(false);
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <img src={logo} alt="Issue Tracker Logo" className="h-12 mb-0" />
                        <span className="text-4xl p-8 font-bold text-blue-600"> Issue Tracker</span>
                    </Link>

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition-all duration-200"
                        >
                            <div className="h-8 w-8 flex items-center justify-center bg-blue-600 text-white rounded-full">
                                <User className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-semibold text-gray-700">{user?.username}</span>
                        </button>

                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-gray-100 z-50">
                                {/* Header */}
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="text-sm font-medium text-gray-800">{user?.username}</p>
                                    <p className="text-xs text-gray-500">{user?.email}</p>
                                </div>

                                {/* Sign out */}
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition"
                                >
                                    <LogOut className="h-4 w-4 text-gray-500" />
                                    Sign out
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* Close dropdown when clicking outside */}
            {showDropdown && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDropdown(false)}
                />
            )}
        </nav>
    );
};

export default Navbar;
