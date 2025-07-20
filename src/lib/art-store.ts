import type { Artwork } from './types';

// This is a simple in-memory store for the artworks.
// In a real application, this would be replaced with a database.
export class ArtStore {
  private artworks: Artwork[];

  constructor(initialArtworks: Artwork[]) {
    this.artworks = [...initialArtworks];
  }

  getAll(): Artwork[] {
    return this.artworks;
  }

  getById(id: string): Artwork | undefined {
    return this.artworks.find((art) => art.id === id);
  }

  add(artwork: Artwork) {
    // Prevent adding duplicates
    if (!this.getById(artwork.id)) {
      this.artworks.unshift(artwork); // Add to the beginning of the list
    }
  }
}