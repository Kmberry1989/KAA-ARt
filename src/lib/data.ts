import type { Artwork } from './types';
import { db } from './firebase-admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

const ARTWORKS_COLLECTION = 'artworks';

// This function is useful for seeding the database if it's empty.
// You might call this from a script or a one-time admin function.
export async function seedInitialData() {
    const artworksCollection = db.collection(ARTWORKS_COLLECTION);
    const snapshot = await artworksCollection.limit(1).get();

    if (!snapshot.empty) {
        console.log('Artworks collection already has data. Skipping seed.');
        return;
    }

    console.log('Seeding initial artworks...');
    const initialArtworks: Omit<Artwork, 'id' | 'createdAt'>[] = [
      {
        title: 'Bronze Voyager',
        artist: 'Studio Glimmer',
        description: 'A sculpture capturing the essence of exploration. The bronze figure, weathered by time, gazes towards an unseen horizon, symbolizing humanity\'s perpetual quest for discovery. Its intricate details tell a story of journeys both physical and spiritual.',
        imageUrl: 'https://placehold.co/600x800',
        type: 'model',
        dimensions: {
          width: 0.8,
          height: 1.5,
          depth: 0.6,
        },
      },
      {
        title: 'Chromatic Dreams',
        artist: 'Alex Chroma',
        description: 'An abstract painting that plays with color and light. Swirls of vibrant hues create a dynamic and emotional landscape, inviting the viewer to lose themselves in a world of pure imagination. The artist uses a unique layering technique to achieve a sense of depth and movement.',
        imageUrl: 'https://placehold.co/800x600',
        type: 'plane',
        dimensions: {
          width: 1.2,
          height: 0.9,
        },
      },
      {
        title: 'Marble Serenity',
        artist: 'Helena Stone',
        description: 'A classical bust carved from a single block of Carrara marble. The subject\'s serene expression and the delicate rendering of hair and fabric showcase a mastery of traditional sculpting techniques. It represents peace and timeless beauty.',
        imageUrl: 'https://placehold.co/600x800',
        type: 'model',
        dimensions: {
          width: 0.5,
          height: 0.7,
          depth: 0.3,
        },
      },
      {
        title: 'Metropolis Grid',
        artist: 'Urban Construct',
        description: 'A digital artwork converted to a physical plane, depicting a sprawling cityscape through a minimalist grid. The piece explores themes of order and chaos in urban environments. The use of negative space is as important as the lines themselves.',
        imageUrl: 'https://placehold.co/600x600',
        type: 'plane',
        dimensions: {
          width: 1,
          height: 1,
        },
      },
    ];

    const batch = db.batch();
    initialArtworks.forEach(art => {
        const docRef = artworksCollection.doc();
        batch.set(docRef, { ...art, createdAt: FieldValue.serverTimestamp() });
    });
    await batch.commit();
    console.log('Initial artworks seeded successfully.');
}


export const getArtworks = async (): Promise<Artwork[]> => {
    await seedInitialData();
  const snapshot = await db.collection(ARTWORKS_COLLECTION).orderBy('createdAt', 'desc').get();
  if (snapshot.empty) {
    return [];
  }
  return snapshot.docs.map(doc => {
    const data = doc.data();
    const createdAt = (data.createdAt as Timestamp).toDate().toISOString();
    return {
        id: doc.id,
        ...data,
        createdAt,
    } as Artwork;
  });
};

export const getArtworkById = async (id: string): Promise<Artwork | undefined> => {
  const doc = await db.collection(ARTWORKS_COLLECTION).doc(id).get();
  if (!doc.exists) {
    return undefined;
  }
    const data = doc.data();
    if (!data) return undefined;

  const createdAt = (data.createdAt as Timestamp).toDate().toISOString();
  return { id: doc.id, ...data, createdAt } as Artwork;
};

export const addArtwork = async (artwork: Omit<Artwork, 'id' | 'createdAt'>) => {
  const artworksCollection = db.collection(ARTWORKS_COLLECTION);
  const newDocRef = await artworksCollection.add({
      ...artwork,
      createdAt: FieldValue.serverTimestamp(),
  });
  return newDocRef.id;
};
