'use client';
import Link from 'next/link';
import { Palette, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const isUploadPage = pathname === '/upload';
  
  return (
    <header className="bg-card/50 backdrop-blur-lg sticky top-0 z-50 border-b">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
          <Palette className="w-8 h-8" />
          <h1 className="text-2xl font-headline font-bold">
            ARt Gallery
          </h1>
        </Link>
        <nav>
          <Link href="/upload" passHref>
            <Button variant={isUploadPage ? "default" : "outline"} className="gap-2">
              <UploadCloud size={18} />
              <span>Upload Art</span>
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
