
import React, { useState } from 'react';
import { JournalEntry, TodoItem } from '../types';
import { getWeeklySummary } from '../services/geminiService';

interface DashboardViewProps {
  journalEntries: JournalEntry[];
  todos: TodoItem[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({ journalEntries, todos }) => {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const todaysTodos = todos.filter(todo => todo.dueDate === today && !todo.completed);
  const overdueTodos = todos.filter(todo => todo.dueDate && todo.dueDate < today && !todo.completed);
  
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    setError('');
    setSummary('');

    try {
      const last7Days = new Date();
      last7Days.setDate(last7Days.getDate() - 7);
      const recentEntries = journalEntries.filter(entry => new Date(entry.date) >= last7Days);
      const recentTodos = todos.filter(todo => todo.createdAt && new Date(todo.createdAt.toDate()) >= last7Days);

      const generatedSummary = await getWeeklySummary(recentEntries, recentTodos);
      setSummary(generatedSummary);
    } catch (e) {
      console.error("Failed to generate summary:", e);
      setError("An error occurred while generating the summary. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
        
        {/* AI Weekly Summary */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg col-span-1 md:col-span-2 lg:col-span-3">
          <h2 className="text-lg font-semibold text-teal-400 mb-4">AI Weekly Summary</h2>
          {isLoading ? (
            <div className="flex items-center text-gray-400">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating your summary...
            </div>
          ) : summary ? (
            <div className="text-gray-300 space-y-2 prose prose-invert max-w-none">{summary}</div>
          ) : (
            <p className="text-gray-400 mb-4">Click the button to generate an AI-powered summary of your recent activity.</p>
          )}
          {error && <p className="text-rose-400 mt-2">{error}</p>}
          {!summary && (
             <button
                onClick={handleGenerateSummary}
                disabled={isLoading}
                className="mt-4 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed transition-colors flex items-center"
            >
                ✨ Generate Summary
            </button>
          )}
        </div>
      </div>
    </div>
  );
};