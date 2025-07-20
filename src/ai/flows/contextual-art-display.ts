// This is a server-side file.
'use server';

/**
 * @fileOverview Flow for providing contextual information on displayed artwork based on user queries.
 *
 * - contextualArtDisplay - A function that handles the process of modifying the art display based on user queries.
 */

import {ai} from '@/ai/genkit';
import {
    ContextualArtDisplayInputSchema,
    ContextualArtDisplayOutputSchema,
    type ContextualArtDisplayInput,
    type ContextualArtDisplayOutput
} from '@/lib/types';


export async function contextualArtDisplay(
  input: ContextualArtDisplayInput
): Promise<ContextualArtDisplayOutput> {
  return contextualArtDisplayFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contextualArtDisplayPrompt',
  input: {schema: ContextualArtDisplayInputSchema},
  output: {schema: ContextualArtDisplayOutputSchema},
  prompt: `You are an AI assistant that modifies art displays based on user queries.

You will take the description of the artwork and the user's query, and subtly modify the art display to incorporate highlights, annotations, or other changes based on the query.
Aim to match the user's query as closely as possible while still maintaining an engaging art experience.

Artwork Description: {{{artworkDescription}}}
User Query: {{{userQuery}}}

Modified Art Display:`,
});

const contextualArtDisplayFlow = ai.defineFlow(
  {
    name: 'contextualArtDisplayFlow',
    inputSchema: ContextualArtDisplayInputSchema,
    outputSchema: ContextualArtDisplayOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
