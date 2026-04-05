import React, { useState } from 'react'
import { FaSearch, FaBell, FaBars, FaUserCircle, FaTimes } from "react-icons/fa";

type NavbarProps = {
    IsOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar = ({ IsOpen, setIsOpen }: NavbarProps) => {
    const [showSearch, setShowSearch] = useState(false);

    return (
        <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 h-14 shadow-sm">
            <div className="h-full flex items-center px-4 gap-3">

                {/* === Mobile search mode === */}
                {showSearch ? (
                    <>
                        <div className="flex-1 flex items-center bg-gray-100 px-3 py-1.5 rounded-full border border-transparent focus-within:border-blue-400 focus-within:bg-white transition-all">
                            <FaSearch className="text-gray-400 flex-shrink-0" size={13} />
                            <input
                                autoFocus
                                type="search"
                                placeholder="Search candidates, jobs..."
                                className="bg-transparent border-none outline-none px-2 flex-1 text-sm min-w-0"
                            />
                        </div>
                        <button
                            onClick={() => setShowSearch(false)}
                            className="flex-shrink-0 p-2 rounded-lg text-slate-500 hover:bg-gray-100 transition-colors"
                        >
                            <FaTimes size={16} />
                        </button>
                    </>
                ) : (
                    /* === Normal mode === */
                    <>
                        {/* Left: hamburger + logo */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                            <button
                                onClick={() => setIsOpen(!IsOpen)}
                                className="p-2 rounded-lg text-slate-600 hover:bg-gray-100 transition-colors"
                            >
                                <FaBars size={18} />
                            </button>
                            <div className="text-xl font-bold text-slate-800 tracking-tight">
                                ATS <span className="text-blue-600">Pro</span>
                            </div>
                        </div>

                        {/* Center: search bar — desktop only */}
                        <div className="hidden md:flex flex-1 max-w-sm mx-auto items-center bg-gray-100 px-3 py-1.5 rounded-full border border-transparent focus-within:border-blue-400 focus-within:bg-white transition-all">
                            <input
                                type="search"
                                placeholder="Search..."
                                className="bg-transparent border-none outline-none px-2 flex-1 text-sm"
                            />
                            <FaSearch className="text-gray-400 flex-shrink-0" size={13} />
                        </div>

                        {/* Right: icons */}
                        <div className="flex items-center gap-2 sm:gap-4 ml-auto">
                            {/* Search icon — mobile only */}
                            <button
                                className="md:hidden p-2 text-slate-500 hover:text-blue-600 transition-colors"
                                onClick={() => setShowSearch(true)}
                            >
                                <FaSearch size={16} />
                            </button>

                            {/* Bell */}
                            <div className="relative cursor-pointer p-1">
                                <FaBell className="text-slate-500 hover:text-blue-600" size={18} />
                                <span className="absolute top-0 right-0 bg-red-500 w-2 h-2 rounded-full border border-white"></span>
                            </div>

                            {/* User */}
                            <div className="flex items-center gap-2 cursor-pointer group">
                                <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600 hidden sm:block">
                                    Reham Sherif
                                </span>
                                <FaUserCircle
                                    className="text-slate-400 group-hover:text-blue-600 flex-shrink-0"
                                    size={26}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar;