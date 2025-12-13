// backend/src/config/gemini.js
import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI = null;
let model = null;

if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  console.log('✅ Gemini AI initialized');
} else {
  console.warn('⚠️  Gemini API key not configured - AI features disabled');
}

export { genAI, model };
export default model;