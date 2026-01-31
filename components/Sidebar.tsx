
import React from 'react';
import { View } from '../types';
import { CalendarIcon, DashboardIcon, JournalIcon, TodoIcon } from './icons';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const NavItem: React.FC<{
  view: View;
  activeView: View;
  setActiveView: (view: View) => void;
  icon: React.ReactNode;
  label: string;
}> = ({ view, activeView, setActiveView, icon, label }) => {
  const isActive = activeView === view;
  return (
    <button
      onClick={() => setActiveView(view)}
      className={`flex items-center w-full px-4 py-3 my-1 rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-indigo-500 text-white shadow-lg'
          : 'text-gray-400 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {icon}
      <span className="ml-4 font-medium hidden md:inline">{label}</span>
    </button>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  return (
    <nav className="bg-gray-800 p-2 md:p-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-center md:justify-start p-2 mb-8">
          <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4m13 0h4m-4-2v4m-5 12v4m-2-4h4m1-11a8 8 0 11-16 0 8 8 0 0116 0z" />
          </svg>
          <h1 className="text-xl font-bold text-white ml-2 hidden md:inline">Zenith</h1>
        </div>
        <ul>
          <li>
            <NavItem view="dashboard" activeView={activeView} setActiveView={setActiveView} icon={<DashboardIcon />} label="Dashboard" />
          </li>
          <li>
            <NavItem view="journal" activeView={activeView} setActiveView={setActiveView} icon={<JournalIcon />} label="Journal" />
          </li>
          <li>
            <NavItem view="calendar" activeView={activeView} setActiveView={setActiveView} icon={<CalendarIcon />} label="Calendar" />
          </li>
          <li>
            <NavItem view="todo" activeView={activeView} setActiveView={setActiveView} icon={<TodoIcon />} label="To-Do List" />
          </li>
        </ul>
      </div>
       <div className="p-4 border-t border-gray-700 hidden md:block">
            <p className="text-xs text-gray-500">© 2024 Zenith Corp</p>
        </div>
    </nav>
  );
};
