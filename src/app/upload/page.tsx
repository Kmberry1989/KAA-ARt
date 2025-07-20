import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
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
      
      <Tabs defaultValue="3d-model" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="3d-model" className="gap-2">
            <Move3d size={16} />
            Upload 3D Model
          </TabsTrigger>
          <TabsTrigger value="image-plane" className="gap-2">
            <ImageIcon size={16} />
            Convert Image to Plane
          </TabsTrigger>
        </TabsList>
        <TabsContent value="3d-model">
          <Card>
            <CardHeader>
              <CardTitle>3D Model Details</CardTitle>
              <CardDescription>Provide information about your 3D sculpture or model.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="model-title">Title</Label>
                <Input id="model-title" placeholder="e.g., Bronze Voyager" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model-artist">Artist Name</Label>
                <Input id="model-artist" placeholder="e.g., Studio Glimmer" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model-description">Description</Label>
                <Textarea id="model-description" placeholder="A short, engaging description of your artwork..." />
              </div>
              <div className="space-y-4">
                <Label>Real-World Dimensions</Label>
                <div className="space-y-2">
                  <Label htmlFor="model-width-ft" className="text-sm font-normal">Width</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input id="model-width-ft" type="number" placeholder="Feet" />
                    <Input id="model-width-in" type="number" placeholder="Inches" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model-height-ft" className="text-sm font-normal">Height</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input id="model-height-ft" type="number" placeholder="Feet" />
                    <Input id="model-height-in" type="number" placeholder="Inches" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model-depth-ft" className="text-sm font-normal">Depth</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input id="model-depth-ft" type="number" placeholder="Feet" />
                    <Input id="model-depth-in" type="number" placeholder="Inches" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="model-file">3D Model File</Label>
                <Input id="model-file" type="file" accept=".glb,.gltf" />
                <p className="text-xs text-muted-foreground">Supported formats: GLB, GLTF.</p>
              </div>
              <Button size="lg" className="w-full">Upload Model</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="image-plane">
          <Card>
            <CardHeader>
              <CardTitle>Image Details</CardTitle>
              <CardDescription>Convert your JPG or PNG into a simple 3D plane for AR.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                <Label htmlFor="image-title">Title</Label>
                <Input id="image-title" placeholder="e.g., Chromatic Dreams" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image-artist">Artist Name</Label>
                <Input id="image-artist" placeholder="e.g., Alex Chroma" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image-description">Description</Label>
                <Textarea id="image-description" placeholder="A short, engaging description of your artwork..." />
              </div>
              <div className="space-y-4">
                <Label>Canvas Dimensions</Label>
                <div className="space-y-2">
                  <Label htmlFor="image-width-ft" className="text-sm font-normal">Width</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input id="image-width-ft" type="number" placeholder="Feet" />
                    <Input id="image-width-in" type="number" placeholder="Inches" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image-height-ft" className="text-sm font-normal">Height</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input id="image-height-ft" type="number" placeholder="Feet" />
                    <Input id="image-height-in" type="number" placeholder="Inches" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image-file">Image File</Label>
                <Input id="image-file" type="file" accept=".jpg,.jpeg,.png" />
                <p className="text-xs text-muted-foreground">Supported formats: JPG, PNG. Transparency is supported.</p>
              </div>
              <Button size="lg" className="w-full">Convert and Upload Image</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
