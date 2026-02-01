
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
    You are a friendly and insightful personal assistant. Your task is to analyze the user's journal entries and to-do list from the past 7 days and provide an encouraging, reflective weekly summary.

    **Analysis Instructions:**
    1.  **Emotional Tone:** Look at the moods provided in the journal entries. Identify the dominant emotions or any significant shifts in mood throughout the week.
    2.  **Key Themes:** Read the journal content. What are the recurring topics? Are they about work, relationships, personal growth, or challenges?
    3.  **Productivity & Accomplishments:** Review the to-do list. Acknowledge the tasks that were completed.
    4.  **Areas for Reflection:** Gently point out any patterns or provide a thoughtful question to encourage reflection for the week ahead.

    **Input Data:**

    **Journal Entries:**
    ${entries.length > 0 ? entries.map(e => `- Date: ${e.date}, Mood: ${e.mood}, Content: "${e.content.substring(0, 150)}..."`).join('\n') : "No journal entries this week."}

    **To-Do Items:**
    ${todos.length > 0 ? todos.map(t => `- Task: "${t.text}", Status: ${t.completed ? "Completed" : "Pending"}`).join('\n') : "No to-do items tracked this week."}

    **Output Format:**
    - Use Markdown for formatting.
    - Start with a friendly greeting.
    - Use headings like "### Your Week's Vibe" for mood analysis, "### Key Accomplishments" for completed tasks, and "### A Thought for the Week Ahead".
    - Keep the summary concise, positive, and insightful (around 3-4 short paragraphs).
    - Do not just list the data back; synthesize it into a narrative.
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