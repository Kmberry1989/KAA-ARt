'use server';

import { revalidatePath } from 'next/cache';
import { createImageToPlane } from '@/ai/flows/image-to-plane';
import type { ImageToPlaneInput, ImageToPlaneOutput } from '@/ai/flows/image-to-plane';
import { addArtwork } from '@/lib/data';

function isArtwork(obj: any): obj is ImageToPlaneOutput {
    return obj && typeof obj.id === 'string' && typeof obj.title === 'string';
}

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

    if (isArtwork(result)) {
        addArtwork(result);
        revalidatePath('/'); // This clears the cache for the home page
        return { success: true, artwork: result };
    } else {
        throw new Error("AI did not return a valid artwork object.");
    }
    
  } catch (error) {
    console.error('Error in image to plane conversion:', error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      success: false,
      error:
        `I'm sorry, I encountered an error while processing your image: ${errorMessage}. Please try again.`,
    };
  }
}
