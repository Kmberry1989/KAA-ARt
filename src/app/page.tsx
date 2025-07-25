import { getArtworks } from "@/lib/data";
import ArtCard from "@/components/ArtCard";

export default async function Home() {
  const artworks = await getArtworks();
  return (
    <div className="space-y-8">
      <header className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-headline text-primary">Community Gallery</h1>
        <p className="text-lg text-muted-foreground">
          Explore art from our talented community.
        </p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {artworks.map((art) => (
          <ArtCard key={art.id} artwork={art} />
        ))}
        {artworks.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground">The gallery is currently empty. Be the first to upload some art!</p>
        )}
      </div>
    </div>
  );
}
