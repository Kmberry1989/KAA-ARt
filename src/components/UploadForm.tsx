"use client";

import { useState, useTransition } from "react";
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { handleImageToPlane } from "@/app/upload/actions";
import { Move3d, ImageIcon, Loader2, CheckCircle, ArrowRight } from "lucide-react";
import type { ImageToPlaneOutput } from "@/ai/flows/image-to-plane";
import Link from "next/link";
import Image from "next/image";

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  artist: z.string().min(2, "Artist name must be at least 2 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  widthFt: z.coerce.number().min(0),
  widthIn: z.coerce.number().min(0).max(11),
  heightFt: z.coerce.number().min(0),
  heightIn: z.coerce.number().min(0).max(11),
  file: z.instanceof(FileList).refine((files) => files?.length === 1, "Image is required."),
}).refine(data => (data.widthFt * 12 + data.widthIn) > 0, {
    message: "Total width must be greater than 0 inches.",
    path: ["widthFt"],
}).refine(data => (data.heightFt * 12 + data.heightIn) > 0, {
    message: "Total height must be greater than 0 inches.",
    path: ["heightFt"],
});

type FormValues = z.infer<typeof formSchema>;

const FEET_TO_METERS = 0.3048;
const INCHES_TO_METERS = 0.0254;

export default function UploadForm() {
    const router = useRouter();
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const [result, setResult] = useState<ImageToPlaneOutput | null>(null);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            artist: "",
            description: "",
            widthFt: 0,
            widthIn: 0,
            heightFt: 0,
            heightIn: 0,
        },
    });

    const fileRef = form.register("file");

    const readFileAsDataURL = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        if (!data.file || data.file.length === 0) {
            toast({
                variant: "destructive",
                title: "No file selected",
                description: "Please select an image file to upload.",
            });
            return;
        }

        const file = data.file[0];
        const imageDataUri = await readFileAsDataURL(file);

        const widthInMeters = data.widthFt * FEET_TO_METERS + data.widthIn * INCHES_TO_METERS;
        const heightInMeters = data.heightFt * FEET_TO_METERS + data.heightIn * INCHES_TO_METERS;
        
        const submissionData = {
            title: data.title,
            artist: data.artist,
            description: data.description,
            dimensions: {
                width: parseFloat(widthInMeters.toFixed(3)),
                height: parseFloat(heightInMeters.toFixed(3)),
            },
        };

        startTransition(async () => {
            const response = await handleImageToPlane(submissionData, imageDataUri);
            if (response.success && response.artwork) {
                setResult(response.artwork);
                setShowSuccessDialog(true);
            } else {
                toast({
                    variant: "destructive",
                    title: "Upload Failed",
                    description: response.error,
                });
            }
        });
    };


    return (
        <>
            <Tabs defaultValue="image-plane" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="3d-model" className="gap-2" disabled>
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
                            <CardTitle>Coming Soon!</CardTitle>
                            <CardDescription>3D model uploads will be available in a future update.</CardDescription>
                        </CardHeader>
                    </Card>
                </TabsContent>
                <TabsContent value="image-plane">
                    <Card>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <CardHeader>
                                    <CardTitle>Image Details</CardTitle>
                                    <CardDescription>Convert your JPG or PNG into a simple 3D plane for AR.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <FormField control={form.control} name="title" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl><Input placeholder="e.g., Chromatic Dreams" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="artist" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Artist Name</FormLabel>
                                            <FormControl><Input placeholder="e.g., Alex Chroma" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="description" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl><Textarea placeholder="A short, engaging description..." {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <div className="space-y-4">
                                        <Label>Canvas Dimensions</Label>
                                        <div className="space-y-2">
                                            <FormField control={form.control} name="widthFt" render={() => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-normal">Width</FormLabel>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <FormField control={form.control} name="widthFt" render={({ field }) => (
                                                          <FormControl><Input type="number" placeholder="Feet" {...field} /></FormControl>
                                                        )} />
                                                        <FormField control={form.control} name="widthIn" render={({ field }) => (
                                                          <FormControl><Input type="number" placeholder="Inches" {...field} /></FormControl>
                                                        )} />
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                        </div>
                                        <div className="space-y-2">
                                            <FormField control={form.control} name="heightFt" render={() => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-normal">Height</FormLabel>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <FormField control={form.control} name="heightFt" render={({ field }) => (
                                                          <FormControl><Input type="number" placeholder="Feet" {...field} /></FormControl>
                                                        )} />
                                                        <FormField control={form.control} name="heightIn" render={({ field }) => (
                                                          <FormControl><Input type="number" placeholder="Inches" {...field} /></FormControl>
                                                        )} />
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                        </div>
                                    </div>
                                    <FormField control={form.control} name="file" render={() => (
                                        <FormItem>
                                            <FormLabel>Image File</FormLabel>
                                            <FormControl><Input type="file" accept=".jpg,.jpeg,.png" {...fileRef} /></FormControl>
                                            <FormDescription>Supported formats: JPG, PNG. Transparency is supported.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <Button type="submit" size="lg" className="w-full" disabled={isPending}>
                                        {isPending ? <Loader2 className="animate-spin" /> : "Convert and Upload Image"}
                                    </Button>
                                </CardContent>
                            </form>
                        </Form>
                    </Card>
                </TabsContent>
            </Tabs>
            
            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 font-headline text-primary">
                            <CheckCircle />
                            Upload Successful!
                        </DialogTitle>
                        <DialogDescription>
                            Your artwork has been created and is ready to be viewed.
                        </DialogDescription>
                    </DialogHeader>
                    {result && (
                        <div className="space-y-4">
                            <div className="relative aspect-video rounded-md overflow-hidden border">
                                <Image src={result.imageUrl} alt={result.title} fill className="object-contain" data-ai-hint="artwork" />
                            </div>
                            <h3 className="text-lg font-semibold">{result.title}</h3>
                            <p className="text-sm text-muted-foreground">by {result.artist}</p>
                            <Button asChild className="w-full" onClick={() => router.push(`/`)}>
                                <Link href="/">
                                    Back to Gallery <ArrowRight className="ml-2" />
                                </Link>
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
