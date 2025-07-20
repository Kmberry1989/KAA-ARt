import { getArtworkById } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import ArtDetailClient from "@/components/ArtDetailClient";

export default function ArtPage({ params }: { params: { id: string } }) {
  const artwork = getArtworkById(params.id);

  if (!artwork) {
    notFound();
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
      <div className="space-y-4">
        <div className="relative aspect-[4/5] rounded-lg overflow-hidden shadow-lg shadow-black/30 border-2 border-primary/20">
          <Image
            src={artwork.imageUrl}
            alt={artwork.title}
            fill
            className="object-cover"
            priority
            data-ai-hint="artwork"
          />
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <Badge variant={artwork.type === 'model' ? 'default' : 'secondary'} className="mb-2">
            {artwork.type === 'model' ? '3D Model' : 'Image Plane'}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-headline text-primary">
            {artwork.title}
          </h1>
          <p className="text-xl text-muted-foreground mt-1">by {artwork.artist}</p>
        </div>

        <ArtDetailClient artwork={artwork} />
      </div>
    </div>
  );
}
