import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { JournalView } from './components/JournalView';
import { CalendarView } from './components/CalendarView';
import { TodoView } from './components/TodoView';
import { JournalEntry, TodoItem, View } from './types';
import { db } from './firebase';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  where,
  getDocs,
  limit
} from 'firebase/firestore';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [todos, setTodos] = useState<TodoItem[]>([]);

  // Effect to listen for real-time updates on Journal Entries
  useEffect(() => {
    const q = query(collection(db, 'journalEntries'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const entriesData: JournalEntry[] = [];
      querySnapshot.forEach((doc) => {
        entriesData.push({ ...doc.data(), id: doc.id } as JournalEntry);
      });
      setJournalEntries(entriesData);
    });
    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // Effect to listen for real-time updates on Todos
  useEffect(() => {
    const q = query(collection(db, 'todos'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const todosData: TodoItem[] = [];
      querySnapshot.forEach((doc) => {
        todosData.push({ ...doc.data(), id: doc.id } as TodoItem);
      });
      setTodos(todosData);
    });
    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // --- Journal CRUD Functions ---
  const addOrUpdateJournalEntry = async (entryData: Omit<JournalEntry, 'id'>) => {
    // Check if an entry for the same date already exists
    const q = query(collection(db, 'journalEntries'), where('date', '==', entryData.date), limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // No entry for today, create a new one
      await addDoc(collection(db, 'journalEntries'), entryData);
    } else {
      // Entry exists, update it
      const existingDocId = querySnapshot.docs[0].id;
      await updateDoc(doc(db, 'journalEntries', existingDocId), entryData);
    }
  };

  // --- Todo CRUD Functions ---
  const addTodo = async (todoData: { text: string; dueDate?: string; }) => {
    await addDoc(collection(db, 'todos'), {
      ...todoData,
      completed: false,
      createdAt: serverTimestamp(),
    });
  };

  const toggleTodo = async (id: string, currentStatus: boolean) => {
    const todoRef = doc(db, 'todos', id);
    await updateDoc(todoRef, { completed: !currentStatus });
  };

  const deleteTodo = async (id: string) => {
    await deleteDoc(doc(db, 'todos', id));
  };


  const renderView = () => {
    switch (activeView) {
      case 'journal':
        return <JournalView entries={journalEntries} addOrUpdateEntry={addOrUpdateJournalEntry} />;
      case 'calendar':
        return <CalendarView entries={journalEntries} todos={todos} />;
      case 'todo':
        return <TodoView todos={todos} addTodo={addTodo} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />;
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