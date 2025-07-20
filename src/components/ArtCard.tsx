import Link from 'next/link';
import Image from 'next/image';
import type { Artwork } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

interface ArtCardProps {
  artwork: Artwork;
}

export default function ArtCard({ artwork }: ArtCardProps) {
  return (
    <Link href={`/art/${artwork.id}`} className="group block">
      <Card className="h-full flex flex-col transition-all duration-300 ease-in-out group-hover:shadow-primary/20 group-hover:shadow-lg group-hover:border-primary/50 group-hover:-translate-y-1">
        <CardHeader>
          <div className="aspect-[4/3] relative overflow-hidden rounded-md">
            <Image
              src={artwork.imageUrl}
              alt={artwork.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint="artwork"
            />
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <CardTitle className="font-headline text-primary group-hover:text-primary/90 transition-colors">
            {artwork.title}
          </CardTitle>
          <CardDescription className="mt-1">
            by {artwork.artist}
          </CardDescription>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Badge variant={artwork.type === 'model' ? 'default' : 'secondary'}>
            {artwork.type === 'model' ? '3D Model' : 'Image Plane'}
          </Badge>
          <div className="flex items-center gap-1 text-sm text-primary transition-transform duration-300 group-hover:translate-x-1">
            View
            <ArrowRight size={16} />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
