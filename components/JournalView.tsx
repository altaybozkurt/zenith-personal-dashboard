
import React, { useState, useEffect } from 'react';
import { JournalEntry, Mood } from '../types';
import { getJournalPrompt } from '../services/geminiService';

interface JournalViewProps {
  entries: JournalEntry[];
  addOrUpdateEntry: (entry: Omit<JournalEntry, 'id'>) => Promise<void>;
}

export const JournalView: React.FC<JournalViewProps> = ({ entries, addOrUpdateEntry }) => {
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<Mood>(Mood.Neutral);
  const [prompt, setPrompt] = useState('');
  const [isPromptLoading, setIsPromptLoading] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const todaysEntry = entries.find(e => e.date === today);

  const handleSave = () => {
    if (!content.trim()) return;

    const entryData = {
      date: today,
      content,
      mood: selectedMood,
    };
    
    addOrUpdateEntry(entryData).then(() => {
        // Successful save
    });
  };
  
  const handleGetPrompt = async () => {
    setIsPromptLoading(true);
    setPrompt('');
    const newPrompt = await getJournalPrompt();
    setPrompt(newPrompt);
    setIsPromptLoading(false);
  };

  useEffect(() => {
    if(todaysEntry) {
        setContent(todaysEntry.content);
        setSelectedMood(todaysEntry.mood);
    } else {
        setContent('');
        setSelectedMood(Mood.Neutral);
    }
  }, [today, todaysEntry]);


  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">Journal</h1>
      
      {/* New Entry Form */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {todaysEntry ? `Editing Entry for ${new Date(today + 'T00:00:00').toLocaleDateString()}` : `New Entry for ${new Date().toLocaleDateString()}`}
        </h2>
        
        {isPromptLoading && (
            <div className="mb-4 p-4 bg-gray-700/50 border border-gray-600 rounded-lg">
                <p className="text-indigo-300 italic">Finding some inspiration for you...</p>
            </div>
        )}
        {prompt && !isPromptLoading && (
          <div className="mb-4 p-4 bg-gray-700/50 border border-gray-600 rounded-lg cursor-pointer" onClick={() => setContent(prev => prev ? `${prev}\n\n${prompt}`: prompt)}>
            <p className="text-indigo-300 italic">"{prompt}"</p>
            <p className="text-xs text-gray-400 mt-2 text-right">Click to add to your entry</p>
          </div>
        )}

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="How was your day?"
          className="w-full h-40 p-4 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
        />
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <span className="text-gray-300">Mood:</span>
            {Object.values(Mood).map((mood) => (
              <button
                key={mood}
                onClick={() => setSelectedMood(mood)}
                className={`text-2xl p-2 rounded-full transition-transform transform hover:scale-125 ${selectedMood === mood ? 'bg-indigo-500/50' : ''}`}
              >
                {mood}
              </button>
            ))}
          </div>
          <div className="flex space-x-2">
             <button
              onClick={handleGetPrompt}
              disabled={isPromptLoading}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-800 disabled:cursor-not-allowed transition-colors"
            >
              {isPromptLoading ? 'Getting...' : 'Get a Prompt'}
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {todaysEntry ? 'Update Entry' : 'Save Entry'}
            </button>
          </div>
        </div>
      </div>

      {/* Past Entries */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Past Entries</h2>
        <div className="space-y-4">
          {entries.length > 0 ? (
            entries.map(entry => (
              <div key={entry.id} className="bg-gray-800 p-5 rounded-lg shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-lg text-white">
                      {new Date(entry.date + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <p className="text-gray-300 mt-2 whitespace-pre-wrap">{entry.content}</p>
                  </div>
                  <span className="text-3xl ml-4">{entry.mood}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center py-8">No journal entries yet. Write your first one above!</p>
          )}
        </div>
      </div>
    </div>
  );
};
