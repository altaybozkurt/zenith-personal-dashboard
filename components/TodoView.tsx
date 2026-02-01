import React, { useState } from 'react';
import { TodoItem } from '../types';
import { TrashIcon } from './icons';

interface TodoViewProps {
  todos: TodoItem[];
  addTodo: (todoData: { text: string; dueDate?: string }) => Promise<void>;
  toggleTodo: (id: string, currentStatus: boolean) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
}

export const TodoView: React.FC<TodoViewProps> = ({ todos, addTodo, toggleTodo, deleteTodo }) => {
  const [newTodoText, setNewTodoText] = useState('');
  const [newTodoDate, setNewTodoDate] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim() || isAdding) return;

    setIsAdding(true);
    try {
      await addTodo({
        text: newTodoText,
        dueDate: newTodoDate || undefined,
      });

      setNewTodoText('');
      setNewTodoDate('');
    } catch (error) {
      console.error("Failed to add task:", error);
      alert("There was an error adding your task. Please check your connection or Firebase setup and try again.");
    } finally {
      setIsAdding(false);
    }
  };
  
  const incompleteTodos = todos.filter(t => !t.completed);
  const completedTodos = todos.filter(t => t.completed);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">To-Do List</h1>
      <form onSubmit={handleAddTodo} className="bg-gray-800 p-4 rounded-xl shadow-lg mb-8 flex flex-col sm:flex-row items-center gap-4">
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="Add a new task..."
          className="flex-grow w-full sm:w-auto p-3 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
        />
        <input
          type="date"
          value={newTodoDate}
          onChange={(e) => setNewTodoDate(e.target.value)}
          className="p-3 bg-gray-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
        />
        <button
          type="submit"
          disabled={isAdding || !newTodoText.trim()}
          className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-800 disabled:cursor-not-allowed"
        >
          {isAdding ? 'Adding...' : 'Add Task'}
        </button>
      </form>
      
      {/* Incomplete Todos */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-indigo-300">Tasks to do ({incompleteTodos.length})</h2>
        <div className="space-y-3">
            {incompleteTodos.map(todo => (
            <div key={todo.id} className="flex items-center bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700/50 transition-colors">
                <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id, todo.completed)}
                className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-indigo-500 focus:ring-indigo-600"
                />
                <div className="ml-4 flex-grow">
                    <span className={`text-lg ${todo.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                        {todo.text}
                    </span>
                    {todo.dueDate && (
                        <p className="text-sm text-gray-400">
                            Due: {new Date(todo.dueDate + 'T00:00:00').toLocaleDateString()}
                        </p>
                    )}
                </div>
                <button onClick={() => deleteTodo(todo.id)} className="text-gray-500 hover:text-rose-500 ml-4 p-2 rounded-full">
                    <TrashIcon />
                </button>
            </div>
            ))}
        </div>
        {incompleteTodos.length === 0 && <p className="text-gray-500 text-center py-4">All tasks completed! Great job!</p>}
      </div>

      {/* Completed Todos */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-emerald-400">Completed ({completedTodos.length})</h2>
         <div className="space-y-3">
            {completedTodos.map(todo => (
            <div key={todo.id} className="flex items-center bg-gray-800/50 p-4 rounded-lg shadow-md">
                <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id, todo.completed)}
                className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-indigo-500 focus:ring-indigo-600"
                />
                <div className="ml-4 flex-grow">
                    <span className="text-lg line-through text-gray-500">
                        {todo.text}
                    </span>
                </div>
                 <button onClick={() => deleteTodo(todo.id)} className="text-gray-600 hover:text-rose-500 ml-4 p-2 rounded-full">
                    <TrashIcon />
                </button>
            </div>
            ))}
        </div>
         {completedTodos.length === 0 && <p className="text-gray-500 text-center py-4">No tasks completed yet.</p>}
      </div>

    </div>
  );
};