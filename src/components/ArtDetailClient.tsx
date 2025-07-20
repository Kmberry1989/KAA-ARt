"use client";

import { useState, useRef, useTransition } from "react";
import type { Artwork, Message } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { handleArtQuery, handleContextualDisplay } from "@/app/art/[id]/actions";
import { Copy, Sparkles, User, Send, Bot } from "lucide-react";
import Image from "next/image";

interface ArtDetailClientProps {
  artwork: Artwork;
}

export default function ArtDetailClient({ artwork: initialArtwork }: ArtDetailClientProps) {
  const [artwork, setArtwork] = useState(initialArtwork);
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      sender: "ai",
      text: `Hello! I am your AI art assistant. Ask me anything about "${artwork.title}".`,
    },
  ]);
  const [isPending, startTransition] = useTransition();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied!",
      description: "The artwork's URL has been copied to your clipboard.",
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isPending) return;

    const userMessage: Message = { id: Date.now().toString(), sender: "user", text: query };
    setMessages((prev) => [...prev, userMessage]);
    setQuery("");

    startTransition(async () => {
      const aiResponse = await handleArtQuery(artwork.description, query);
      const aiMessage: Message = { id: (Date.now() + 1).toString(), sender: "ai", text: aiResponse };
      setMessages((prev) => [...prev, aiMessage]);
      setTimeout(() => {
        if (scrollAreaRef.current) {
          scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
        }
      }, 100);
    });
  };
  
  const handleGetContext = () => {
    const lastUserQuery = messages.filter(m => m.sender === 'user').pop()?.text as string;
    
    startTransition(async () => {
        const result = await handleContextualDisplay(artwork.description, lastUserQuery);
        setArtwork(prev => ({...prev, description: result }));
        toast({
            title: "Context Updated",
            description: "The artwork's description has been updated with contextual highlights.",
        });
    });
  }

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Description</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{artwork.description}</p>
                 <Button onClick={handleGetContext} variant="ghost" size="sm" className="mt-4 gap-2 text-primary" disabled={isPending}>
                    <Sparkles size={16} />
                    {isPending ? 'Highlighting...' : 'Get Contextual Highlight'}
                </Button>
            </CardContent>
        </Card>

      <div className="grid grid-cols-2 gap-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button size="lg" className="w-full">View in AR</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="font-headline text-primary">{artwork.title}</DialogTitle>
              <DialogDescription>
                This is a simulation of the Augmented Reality view.
              </DialogDescription>
            </DialogHeader>
            <div className="aspect-[4/5] relative my-4">
              <Image src={artwork.imageUrl} alt={artwork.title} fill className="object-contain" data-ai-hint="artwork" />
            </div>
          </DialogContent>
        </Dialog>
        <Button size="lg" variant="outline" onClick={handleShare} className="gap-2">
          <Copy size={16} /> Share
        </Button>
      </div>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Bot /> AI Art Assistant
                </CardTitle>
                <CardDescription>Ask me questions about this artwork.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-64 w-full pr-4" ref={scrollAreaRef}>
                    <div className="space-y-4">
                        {messages.map((message) => (
                            <div key={message.id} className={`flex items-start gap-3 ${message.sender === 'user' ? 'justify-end' : ''}`}>
                                {message.sender === 'ai' && <div className="bg-primary text-primary-foreground rounded-full p-2"><Bot size={16} /></div>}
                                <div className={`max-w-[80%] rounded-lg px-4 py-2 ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                    <p className="text-sm">{message.text}</p>
                                </div>
                                 {message.sender === 'user' && <div className="bg-muted rounded-full p-2"><User size={16} /></div>}
                            </div>
                        ))}
                        {isPending && messages[messages.length-1].sender === 'user' && (
                             <div className="flex items-start gap-3">
                                <div className="bg-primary text-primary-foreground rounded-full p-2 animate-pulse"><Bot size={16} /></div>
                                <div className="max-w-[80%] rounded-lg px-4 py-2 bg-muted">
                                    <p className="text-sm text-muted-foreground">Thinking...</p>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
                <form onSubmit={handleFormSubmit} className="flex items-center gap-2 mt-4 pt-4 border-t">
                    <Textarea
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="e.g., What does this piece symbolize?"
                        className="flex-grow resize-none"
                        rows={1}
                        disabled={isPending}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleFormSubmit(e);
                            }
                        }}
                    />
                    <Button type="submit" size="icon" disabled={!query.trim() || isPending}>
                        <Send size={18} />
                    </Button>
                </form>
            </CardContent>
        </Card>
    </div>
  );
}
