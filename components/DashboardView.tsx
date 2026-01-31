
import React from 'react';
import { JournalEntry, TodoItem } from '../types';

interface DashboardViewProps {
  journalEntries: JournalEntry[];
  todos: TodoItem[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({ journalEntries, todos }) => {
  const today = new Date().toISOString().split('T')[0];
  const todaysTodos = todos.filter(todo => todo.dueDate === today && !todo.completed);
  const overdueTodos = todos.filter(todo => todo.dueDate && todo.dueDate < today && !todo.completed);
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">{greeting()}!</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold text-indigo-400 mb-2">Today's Focus</h2>
          <p className="text-4xl font-bold">{todaysTodos.length}</p>
          <p className="text-gray-400">tasks due today</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold text-rose-400 mb-2">Overdue</h2>
          <p className="text-4xl font-bold">{overdueTodos.length}</p>
          <p className="text-gray-400">tasks need attention</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold text-emerald-400 mb-2">Completed</h2>
          <p className="text-4xl font-bold">{todos.filter(t => t.completed).length}</p>
          <p className="text-gray-400">total tasks done</p>
        </div>
      </div>
    </div>
  );
};
