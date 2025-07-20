export type Artwork = {
  id: string;
  title: string;
  artist: string;
  description: string;
  imageUrl: string;
  type: 'model' | 'plane';
  dimensions: {
    width: number;
    height: number;
    depth?: number;
  };
};

export type Message = {
    id: string;
    sender: 'user' | 'ai';
    text: string | React.ReactNode;
};
