'use server';

/**
 * @fileOverview An AI agent that answers questions about a displayed artwork.
 *
 * - artInfoQuery - A function that handles the art information query process.
 */

import {ai} from '@/ai/genkit';
import {
    ArtInfoQueryInputSchema,
    ArtInfoQueryOutputSchema,
    type ArtInfoQueryInput,
    type ArtInfoQueryOutput
} from '@/lib/types';


export async function artInfoQuery(input: ArtInfoQueryInput): Promise<ArtInfoQueryOutput> {
  return artInfoQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'artInfoQueryPrompt',
  input: {schema: ArtInfoQueryInputSchema},
  output: {schema: ArtInfoQueryOutputSchema},
  prompt: `You are an expert art historian. A user is viewing an artwork and has a question about it.

  Here is the artwork description:
  {{artworkDescription}}

  Here is the user's question:
  {{userQuery}}

  Answer the user's question based on your knowledge and the provided artwork description.`,
});

const artInfoQueryFlow = ai.defineFlow(
  {
    name: 'artInfoQueryFlow',
    inputSchema: ArtInfoQueryInputSchema,
    outputSchema: ArtInfoQueryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
