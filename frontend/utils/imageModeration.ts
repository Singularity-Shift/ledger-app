import OpenAI from "openai";
import * as dotenv from "dotenv";

// Load environment variables - Ensure your VITE_OPENAI_API_KEY is in the .env file
dotenv.config();

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  console.error("OpenAI API key is missing. Please set VITE_OPENAI_API_KEY in your .env file.");
  // Optionally throw an error or handle this case as needed
}

const openai = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true, // Necessary for client-side usage
});

/**
 * Moderates an image using the OpenAI Moderation API.
 * @param imageDataUrl Base64 encoded image data URL (e.g., "data:image/png;base64,...").
 * @returns True if the image is flagged as potentially harmful, false otherwise.
 * @throws Error if the API call fails or the API key is missing.
 */
export async function moderateImage(imageDataUrl: string): Promise<boolean> {
  if (!apiKey) {
    // Throw error immediately if key is missing on function call
    throw new Error("OpenAI API key (VITE_OPENAI_API_KEY) is not configured in .env.");
  }

  if (!imageDataUrl || !imageDataUrl.startsWith("data:image/")) {
    throw new Error("Invalid image data URL provided.");
  }

  console.log("Moderating image...");

  try {
    const response = await openai.moderations.create({
      model: "omni-moderation-latest",
      input: [
        {
          type: "image_url",
          image_url: {
            url: imageDataUrl,
          },
        },
      ],
    });

    console.log("Moderation response:", response);

    // Check if any result is flagged
    const isFlagged = response.results.some((result) => result.flagged);

    if (isFlagged) {
      console.warn("Image flagged by moderation:", response.results.filter(r => r.flagged));
    } else {
      console.log("Image passed moderation.");
    }

    return isFlagged;
  } catch (error) {
    console.error("Error calling OpenAI Moderation API:", error);
    // Depending on policy, you might want to block submission on API error
    // or allow it with a warning. Here, we throw to indicate failure.
    throw new Error(`Failed to moderate image: ${error instanceof Error ? error.message : String(error)}`);
  }
} 