'use server';

/**
 * @fileOverview An AI agent that answers questions about a displayed artwork.
 *
 * - artInfoQuery - A function that handles the art information query process.
 * - ArtInfoQueryInput - The input type for the artInfoQuery function.
 * - ArtInfoQueryOutput - The return type for the artInfoQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ArtInfoQueryInputSchema = z.object({
  artworkDescription: z
    .string()
    .describe('Description of the artwork being displayed.'),
  userQuery: z.string().describe('The user query about the artwork.'),
});
export type ArtInfoQueryInput = z.infer<typeof ArtInfoQueryInputSchema>;

const ArtInfoQueryOutputSchema = z.object({
  answer: z.string().describe('The answer to the user query about the artwork.'),
});
export type ArtInfoQueryOutput = z.infer<typeof ArtInfoQueryOutputSchema>;

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
