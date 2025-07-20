"use server";

import { artInfoQuery } from "@/ai/flows/art-info-query";
import { contextualArtDisplay } from "@/ai/flows/contextual-art-display";

export async function handleArtQuery(artworkDescription: string, userQuery: string) {
  try {
    const result = await artInfoQuery({ artworkDescription, userQuery });
    return result.answer;
  } catch (error) {
    console.error("Error in AI query:", error);
    return "I'm sorry, I encountered an error while processing your question. Please try again.";
  }
}

export async function handleContextualDisplay(artworkDescription: string, userQuery: string) {
    if (!userQuery) {
        return "Please ask a question first to get a contextual highlight.";
    }
  try {
    const result = await contextualArtDisplay({ artworkDescription, userQuery });
    return result.modifiedDisplay;
  } catch (error) {
    console.error("Error in AI contextual display:", error);
    return "I'm sorry, I couldn't generate a contextual highlight at this time.";
  }
}
