import { NavLink , useLocation } from 'react-router-dom';
import { FaChartPie, FaBriefcase, FaUsers, FaCog ,  FaHome 
} from "react-icons/fa";
import { useEffect } from 'react';
type sidebarProps = {
    isOpen: boolean;
        setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;

}

export const Sidebar = ({ isOpen, setIsOpen }: sidebarProps) => {
    const location = useLocation();
    useEffect(() => {
        if (window.innerWidth < 300) {
            setIsOpen(false);
        }
    }, [location.pathname]);
    return (
        <>
        {isOpen && (
                <div
                    className="fixed inset-0 top-14 z-30 bg-black/40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        <aside className={`
                fixed left-0 top-14 z-40 bg-slate-900 text-white
                h-[calc(100vh-56px)] transition-all duration-300 shadow-xl overflow-hidden
                ${isOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full'}
            `}>
                <div className="p-6 text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Menu
                </div>
                <nav className="flex flex-col gap-2 px-3">
                    {[
                        { to: '/', icon: <FaChartPie />, label: 'Dashboard' },
                        { to: '/Jobs', icon: <FaBriefcase />, label: 'Jobs' },
                        { to: '/Candidates', icon: <FaUsers />, label: 'Candidates' },
                        { to: '/Settings', icon: <FaCog />, label: 'Settings' },
                        { to: '/Applications', icon: <FaHome />, label: 'Applications' },
                    ].map(({ to, icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            onClick={() => {
                                // close sidebar on mobile after navigation
                                if (window.innerWidth < 300) setIsOpen(false);
                            }}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                                ${isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                                }`
                            }
                        >
                            {icon} {label}
                        </NavLink>
                    ))}
                </nav>
            </aside>
        </>
    )
}

export default Sidebar;