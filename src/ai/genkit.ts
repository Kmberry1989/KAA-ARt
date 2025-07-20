import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// The googleAI() plugin requires the GEMINI_API_KEY environment variable to be set.
// You can get a key from Google AI Studio: https://aistudio.google.com/app/apikey
// Make sure to add it to your .env.local file and your Vercel project settings.
export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});
