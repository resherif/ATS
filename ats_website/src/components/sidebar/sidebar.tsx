import React from 'react'
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
type sidebarProps = {
    isOpen: boolean;
}
export const Sidebar = ({isOpen}:sidebarProps) => {
    
  return (
      <aside className={` w-64 bg-slate-900 text-white flex-shrink-0  h-[calc(100vh-56px)]  border-r fixed left-0 top-14 z-40 shadow-sm transition-all duration-300  ${isOpen ? 'translate-x-0 w-64' : 'w-0 translate-x-full'} overflow-hidden`}>
         <div className="p-6 text-2xl font-bold border-b border-slate-700">ATS Pro</div>
          <nav className='d-flex flex-direction-column'>
              <NavLink to='/dashboard' className={({isActive})=>`flex items-center gap-3 px-3 py-2 rounded-md ${isActive? 'bg-white text-blue-400':'hover:text-blue-400 '}`}>dashboard</NavLink>
              <NavLink to='/Jobs' className='flex items-center gap-3 px-3 py-2 rounded-md'>Jobs</NavLink>
              <NavLink to='/Candidates' className='flex items-center gap-3 px-3 py-2 rounded-md'>Candidates</NavLink>
              <NavLink to='/Interviews' className='flex items-center gap-3 px-3 py-2 rounded-md'>Interviews</NavLink>
              <NavLink to='/Settings' className='flex items-center gap-3 px-3 py-2 rounded-md'>Settings</NavLink>
              
          </nav>
          
    </aside>
  )
}
export default Sidebar;