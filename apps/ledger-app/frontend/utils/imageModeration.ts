import { autobackend } from "@/services/autobackend";

/**
 * Moderates an image using the OpenAI Moderation API.
 * @param imageDataUrl Base64 encoded image data URL (e.g., "data:image/png;base64,...").
 * @returns True if the image is flagged as potentially harmful, false otherwise.
 * @throws Error if the API call fails or the API key is missing.
 */
export async function moderateImage(imageDataUrl: string, jwt: string): Promise<boolean> {
  if (!imageDataUrl || !imageDataUrl.startsWith("data:image/")) {
    throw new Error("Invalid image data URL provided.");
  }

  try {
    const response = await autobackend.post(
      "/moderation",
      { image: imageDataUrl },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );

    const { isFlagged } = response.data;

    return isFlagged;
  } catch (error) {
    console.error("Error calling OpenAI Moderation API:", error);
    // Depending on policy, you might want to block submission on API error
    // or allow it with a warning. Here, we throw to indicate failure.
    throw new Error(`Failed to moderate image: ${error instanceof Error ? error.message : String(error)}`);
  }
}
