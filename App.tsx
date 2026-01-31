
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { JournalView } from './components/JournalView';
import { CalendarView } from './components/CalendarView';
import { TodoView } from './components/TodoView';
import { JournalEntry, TodoItem, View } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [journalEntries, setJournalEntries] = useLocalStorage<JournalEntry[]>('journalEntries', []);
  const [todos, setTodos] = useLocalStorage<TodoItem[]>('todos', []);

  const renderView = () => {
    switch (activeView) {
      case 'journal':
        return <JournalView entries={journalEntries} setEntries={setJournalEntries} />;
      case 'calendar':
        return <CalendarView entries={journalEntries} todos={todos} />;
      case 'todo':
        return <TodoView todos={todos} setTodos={setTodos} />;
      case 'dashboard':
      default:
        return <DashboardView journalEntries={journalEntries} todos={todos} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 font-sans">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
