import OpenAI from "openai";
// Removed dotenv import as it's not needed for Vite env vars

// --- Custom Moderation Thresholds --- START
// Adjust these values (0.0 to 1.0) to control sensitivity.
// Higher values = less sensitive (more permissive).
// Lower values = more sensitive (stricter).
const CUSTOM_THRESHOLDS = {
  // Hate speech (Text Only according to docs, but set low as a safeguard)
  "hate": 0.2,
  "hate/threatening": 0.1, // Very strict

  // Self-harm (Image Applicable)
  "self-harm": 0.2,
  "self-harm/intent": 0.1, // Very strict
  "self-harm/instructions": 0.1, // Very strict

  // Violence (Image Applicable)
  "violence": 0.4,
  "violence/graphic": 0.2, // Stricter for graphic

  // Sexual Content (Image Applicable)
  "sexual": 0.5, // Moderate - adjust based on specific context if needed

  // Sexual Content - Minors (Text Only according to docs, but set extremely low)
  "sexual/minors": 0.1,

  // Harassment (Text Only according to docs, but set low)
  "harassment": 0.3,
  "harassment/threatening": 0.2, // Stricter

  // Illicit Activities (Text Only according to docs, but set low/moderate)
  "illicit": 0.4,
  "illicit/violent": 0.3, // Stricter
};
// --- Custom Moderation Thresholds --- END

// Load environment variables - Ensure your VITE_OPENAI_API_KEY is in the .env file
// Removed dotenv.config()

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
 * Moderates an image using the OpenAI Moderation API based on custom thresholds.
 * @param imageDataUrl Base64 encoded image data URL (e.g., "data:image/png;base64,...").
 * @returns True if the image is flagged based on custom thresholds, false otherwise.
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

    // --- Custom Threshold Check --- START
    let isFlagged = false;
    const flaggedCategories: { category: string; score: number; threshold: number }[] = [];

    for (const result of response.results) {
      for (const category in CUSTOM_THRESHOLDS) {
        // Ensure the category exists in the response scores and our thresholds
        if (category in result.category_scores && category in CUSTOM_THRESHOLDS) {
          const score = result.category_scores[category as keyof typeof result.category_scores];
          const threshold = CUSTOM_THRESHOLDS[category as keyof typeof CUSTOM_THRESHOLDS];

          if (score > threshold) {
            isFlagged = true;
            flaggedCategories.push({ category, score, threshold });
            // Optional: break early if one flag is enough
            // break;
          }
        }
      }
      // Optional: break outer loop if already flagged
      // if (isFlagged) break;
    }
    // --- Custom Threshold Check --- END

    if (isFlagged) {
      console.warn("Image flagged by custom moderation thresholds:", flaggedCategories);
    } else {
      console.log("Image passed custom moderation thresholds.");
    }

    return isFlagged;
  } catch (error) {
    console.error("Error calling OpenAI Moderation API:", error);
    // Depending on policy, you might want to block submission on API error
    // or allow it with a warning. Here, we throw to indicate failure.
    throw new Error(`Failed to moderate image: ${error instanceof Error ? error.message : String(error)}`);
  }
} 