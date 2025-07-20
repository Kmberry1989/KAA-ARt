import type { Artwork } from './types';

export const artworks: Artwork[] = [
  {
    id: '1',
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
    id: '2',
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
    id: '3',
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
    id: '4',
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

export const getArtworkById = (id: string): Artwork | undefined => {
  return artworks.find((art) => art.id === id);
};
