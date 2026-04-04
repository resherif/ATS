import React from 'react'
import { FaSearch, FaBell, FaBars, FaUserCircle } from "react-icons/fa";

type NavbarProps = {
    IsOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar = ({ IsOpen, setIsOpen }: NavbarProps) => {
    return (
        <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 h-14 flex items-center justify-between px-4 shadow-sm">
            
     
            <div className="flex items-center gap-4">
                <button onClick={() => setIsOpen(!IsOpen)} className="p-2 rounded-lg text-slate-600 hover:bg-gray-100 transition-colors">
                    <FaBars size={18} />
                </button>
                <div className="text-xl font-bold text-slate-800 tracking-tight">
                    ATS <span className="text-blue-600">Pro</span>
                </div>
            </div>

            <div className="hidden md:flex items-center bg-gray-100 px-3 py-1 rounded-full border border-transparent focus-within:border-blue-400 focus-within:bg-white transition-all">
                <input type="search" placeholder="Search..." className="bg-transparent border-none outline-none px-2 w-64 text-sm" />
                <FaSearch className="text-gray-400" />
            </div>

   
            <div className="flex items-center gap-5">
                <div className="relative cursor-pointer">
                    <FaBell className="text-slate-500 hover:text-blue-600" size={18} />
                    <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full border border-white"></span>
                </div>
                
                <div className="flex items-center gap-2 cursor-pointer group">
                    <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600 hidden sm:block">Reham Sherif</span>
                    <FaUserCircle className="text-slate-400 group-hover:text-blue-600" size={26} />
                </div>
            </div>
        </nav>
    )
}

export default Navbar;