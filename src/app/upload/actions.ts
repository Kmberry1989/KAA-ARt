'use server';

import { createImageToPlane } from '@/ai/flows/image-to-plane';
import type { ImageToPlaneInput } from '@/ai/flows/image-to-plane';

export async function handleImageToPlane(
  data: Omit<ImageToPlaneInput, 'imageDataUri'>,
  imageDataUri: string
) {
  try {
    const input: ImageToPlaneInput = {
      ...data,
      imageDataUri,
    };
    const result = await createImageToPlane(input);
    // In a real app, we would save the new artwork to a database.
    // Here we just return the result from the flow.
    return { success: true, artwork: result };
  } catch (error) {
    console.error('Error in image to plane conversion:', error);
    return {
      success: false,
      error:
        "I'm sorry, I encountered an error while processing your image. Please try again.",
    };
  }
}
