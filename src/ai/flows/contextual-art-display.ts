// This is a server-side file.
'use server';

/**
 * @fileOverview Flow for providing contextual information on displayed artwork based on user queries.
 *
 * - contextualArtDisplay - A function that handles the process of modifying the art display based on user queries.
 * - ContextualArtDisplayInput - The input type for the contextualArtDisplay function.
 * - ContextualArtDisplayOutput - The return type for the contextualArtDisplay function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContextualArtDisplayInputSchema = z.object({
  artworkDescription: z
    .string()
    .describe('The description of the artwork to be displayed.'),
  userQuery: z
    .string()
    .describe(
      'The user query related to the artwork, requesting specific details or modifications to the display.'
    ),
});
export type ContextualArtDisplayInput = z.infer<typeof ContextualArtDisplayInputSchema>;

const ContextualArtDisplayOutputSchema = z.object({
  modifiedDisplay:
    z.string().describe('The modified art display, incorporating highlights, annotations, or other changes based on the user query.'),
});
export type ContextualArtDisplayOutput = z.infer<typeof ContextualArtDisplayOutputSchema>;

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
