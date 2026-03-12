import { GoogleGenerativeAI } from '@google/generative-ai';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ENV_KEY = process.env.EXPO_PUBLIC_GEMINI_KEY;

const SYSTEM_PROMPT = `You are Barbie's super smart bestie! You explain news to a 20-year-old Indian girl who is smart and a CS+Economics student at BITS Pilani but wants news explained in a fun, bubbly, friendly way — like talking to your bestie over bubble tea. Use simple language, less jargons (or explain jargon in brackets with a cute emoji), and use India-relevant context, and make it feel exciting and relevant to her life. Use emojis naturally. Keep summaries to 150 words max. End with a 'Why this matters to YOU 💅' section in 2 sentences.`;

let cachedModel = null;
let cachedKeyUsed = null;

async function getModel() {
  let apiKey = ENV_KEY;

  try {
    const saved = await AsyncStorage.getItem('app_settings');
    if (saved) {
      const settings = JSON.parse(saved);
      if (settings.geminiKey) apiKey = settings.geminiKey;
    }
  } catch (e) {}

  if (!apiKey) throw new Error('No Gemini API key configured. Go to Settings to add one.');

  if (cachedModel && cachedKeyUsed === apiKey) return cachedModel;

  const genAI = new GoogleGenerativeAI(apiKey);
  cachedModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  cachedKeyUsed = apiKey;
  return cachedModel;
}

function getCacheKey(title, lang) {
  const today = new Date().toISOString().split('T')[0];
  const slug = title.slice(0, 60).replace(/\s+/g, '_');
  return `gemini_cache_${today}_${lang}_${slug}`;
}

export async function getAISummary(article, category) {
  const langNote = article.langNote || '';
  const lang = langNote ? langNote.slice(0, 20) : 'en';
  const cacheKey = getCacheKey(article.title, lang);

  try {
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) return cached;
  } catch (e) {}

  const prompt = `${SYSTEM_PROMPT}${langNote}

Category: ${category}
Article Title: ${article.title}
Article Description: ${article.description || 'No description available'}

Rewrite this news in your style:`;

  try {
    const model = await getModel();
    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    try {
      await AsyncStorage.setItem(cacheKey, summary);
    } catch (e) {}

    return summary;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Could not get AI summary. Check your API key or try again later.');
  }
}

export async function clearOldCache() {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const today = new Date().toISOString().split('T')[0];
    const oldKeys = keys.filter(
      (k) => k.startsWith('gemini_cache_') && !k.includes(today)
    );
    if (oldKeys.length > 0) {
      await AsyncStorage.multiRemove(oldKeys);
    }
  } catch (e) {}
}
