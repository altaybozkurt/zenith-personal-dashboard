
export enum Mood {
  Happy = '😊',
  Sad = '😢',
  Neutral = '😐',
  Excited = '🤩',
  Stressed = '😫',
  Productive = '🚀',
}

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  content: string;
  mood: Mood;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string; // YYYY-MM-DD
}

export type View = 'dashboard' | 'journal' | 'calendar' | 'todo';
