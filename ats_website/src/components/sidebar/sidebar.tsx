import { NavLink } from 'react-router-dom';
import { FaChartPie, FaBriefcase, FaUsers, FaCog ,  FaHome 
} from "react-icons/fa";

type sidebarProps = {
    isOpen: boolean;
}

export const Sidebar = ({ isOpen }: sidebarProps) => {
    return (
        <aside className={`fixed left-0 top-14 z-40 bg-slate-900 text-white h-[calc(100vh-56px)] transition-all duration-300 shadow-xl overflow-hidden ${isOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full'}`}>
            <div className="p-6 text-xs font-semibold uppercase tracking-widest text-slate-500">
                Menu
            </div>
            <nav className="flex flex-col gap-2 px-3">
                <NavLink to='/' className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}>
                  <FaHome /> Home
                </NavLink>
                <NavLink to='/dashboard' className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}>
                    <FaChartPie /> Dashboard
                </NavLink>
                <NavLink to='/Jobs' className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}>
                    <FaBriefcase /> Jobs
                </NavLink>
                <NavLink to='/Candidates' className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}>
                    <FaUsers /> Candidates
                </NavLink>
                <NavLink to='/Settings' className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}>
                    <FaCog /> Settings
                </NavLink>
            </nav>
        </aside>
    )
}

export default Sidebar;