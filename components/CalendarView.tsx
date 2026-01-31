
import React, { useState } from 'react';
import { JournalEntry, TodoItem } from '../types';

interface CalendarViewProps {
  entries: JournalEntry[];
  todos: TodoItem[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ entries, todos }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();

  const days = [];
  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} className="border-r border-b border-gray-700"></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateString = date.toISOString().split('T')[0];
    const journalForDay = entries.find(e => e.date === dateString);
    const todosForDay = todos.filter(t => t.dueDate === dateString);
    const isToday = dateString === new Date().toISOString().split('T')[0];

    days.push(
      <div key={day} className={`p-2 border-r border-b border-gray-700 flex flex-col ${isToday ? 'bg-indigo-900/50' : ''}`}>
        <span className={`font-semibold ${isToday ? 'text-indigo-300' : 'text-white'}`}>{day}</span>
        <div className="mt-1 flex-grow space-y-1 overflow-y-auto">
          {journalForDay && <div className="text-2xl cursor-pointer" title={journalForDay.content}>{journalForDay.mood}</div>}
          {todosForDay.map(todo => (
            <div key={todo.id} className={`flex items-center text-xs p-1 rounded ${todo.completed ? 'bg-green-800/50 text-gray-400 line-through' : 'bg-blue-800/50 text-blue-200'}`}>
              <span className="truncate">{todo.text}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Calendar</h1>
        <div className="flex items-center space-x-4">
          <button onClick={() => changeMonth(-1)} className="p-2 rounded-full bg-gray-700 hover:bg-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <h2 className="text-xl font-semibold w-32 text-center">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <button onClick={() => changeMonth(1)} className="p-2 rounded-full bg-gray-700 hover:bg-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>
      </div>
      <div className="flex-grow grid grid-cols-7 grid-rows-6 bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {weekdays.map(day => (
          <div key={day} className="text-center font-bold p-2 border-b border-r border-gray-700 text-indigo-400">{day}</div>
        ))}
        {days}
      </div>
    </div>
  );
};
