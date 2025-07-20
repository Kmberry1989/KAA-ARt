'use server';

import { revalidatePath } from 'next/cache';
import { createImageToPlane } from '@/ai/flows/image-to-plane';
import type { ImageToPlaneInput, ImageToPlaneOutput } from '@/ai/flows/image-to-plane';
import { addArtwork } from '@/lib/data';

function isArtwork(obj: any): obj is ImageToPlaneOutput & { id: string } {
    return obj && typeof obj.title === 'string' && typeof obj.artist === 'string';
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
        const { id, ...artworkData } = result; // Exclude AI-generated ID if present
        const newId = await addArtwork(artworkData);
        revalidatePath('/'); // This clears the cache for the home page
        // The result here is from the AI, which doesn't have the final ID.
        // We add the new ID from Firestore to it for the success dialog.
        return { success: true, artwork: { ...artworkData, id: newId } };
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