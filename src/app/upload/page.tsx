import UploadForm from "@/components/UploadForm";
import { Move3d, ImageIcon } from "lucide-react";

export default function UploadPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <header className="text-center space-y-2 mb-8">
        <h1 className="text-4xl md:text-5xl font-headline text-primary">Upload Your Masterpiece</h1>
        <p className="text-lg text-muted-foreground">
          Share your 3D models or convert images into AR-ready planes.
        </p>
      </header>
      
      <UploadForm />
    </div>
  );
}
