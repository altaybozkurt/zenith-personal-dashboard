
import { GoogleGenAI } from "@google/genai";
import { JournalEntry, TodoItem } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getJournalPrompt = async (): Promise<string> => {
  if (!API_KEY) return "API Key not configured. Please set the API_KEY environment variable.";
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: 'Generate a single, short, and insightful journal prompt about self-reflection, personal growth, or daily mindfulness. Make it a question.',
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error fetching journal prompt:", error);
    return "Error fetching prompt. Please try again later.";
  }
};

export const getWeeklySummary = async (entries: JournalEntry[], todos: TodoItem[]): Promise<string> => {
  if (!API_KEY) return "API Key not configured. Please set the API_KEY environment variable.";
  if (entries.length === 0 && todos.length === 0) {
    return "Not enough data for a summary. Write some journal entries or add to-do items.";
  }

  const prompt = `
    Based on the following journal entries and to-do items from the past week, generate a brief, insightful, and encouraging summary.
    Focus on emotional trends, accomplishments (completed todos), and potential areas for reflection.
    Format the output as clean markdown.

    Journal Entries:
    ${entries.map(e => `- Date: ${e.date}, Mood: ${e.mood}, Entry: "${e.content}"`).join('\n')}

    To-Do Items:
    ${todos.map(t => `- Task: "${t.text}", Completed: ${t.completed}`).join('\n')}

    Summary:
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching weekly summary:", error);
    return "Error generating summary. Please try again later.";
  }
};
