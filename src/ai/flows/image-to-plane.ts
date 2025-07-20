'use server';
/**
 * @fileOverview Flow for converting an image to a 3D plane for AR display.
 *
 * - createImageToPlane - A function that handles the image to plane conversion process.
 */

import { ai } from '@/ai/genkit';
import {
    ImageToPlaneInputSchema,
    ImageToPlaneOutputSchema,
    type ImageToPlaneInput,
    type ImageToPlaneOutput
} from '@/lib/types';


export async function createImageToPlane(input: ImageToPlaneInput): Promise<ImageToPlaneOutput> {
  return imageToPlaneFlow(input);
}

const prompt = ai.definePrompt({
    name: 'createImageToPlanePrompt',
    input: { schema: ImageToPlaneInputSchema },
    output: { schema: ImageToPlaneOutputSchema },
    prompt: `You are an AI assistant creating a new piece of digital art for an AR gallery.
The user has provided an image and details. Your task is to process this information and format it as a new artwork object.

- The 'title' should be the 'Title' from the User Input.
- The 'artist' should be the 'Artist' from the User Input.
- The 'type' must be the string 'plane'.
- The 'imageUrl' should be the 'imageDataUri' provided by the user.
- The 'description' should be a refined, slightly more descriptive version of the user's input, making it sound more like an art gallery description.

User Input:
Title: {{title}}
Artist: {{artist}}
Description: {{description}}
Dimensions: {{dimensions.width}}m x {{dimensions.height}}m
Image: {{media url=imageDataUri}}

Return the full artwork object in the specified JSON format. Do not include an 'id' field.
`,
});


const imageToPlaneFlow = ai.defineFlow(
  {
    name: 'imageToPlaneFlow',
    inputSchema: ImageToPlaneInputSchema,
    outputSchema: ImageToPlaneOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);

    if (!output) {
      throw new Error("AI failed to generate artwork data.");
    }
    
    // The image URL will be the data URI, which is fine for displaying on the client for now.
    // In a production app, you would upload this to a storage service like Cloud Storage.
    return output;
  }
);
