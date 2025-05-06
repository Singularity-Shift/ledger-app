import Paper from "@/assets/placeholders/paper.png";
import Placeholder2 from "@/assets/placeholders/bear-2.png";
import Placeholder3 from "@/assets/placeholders/bear-3.png";
import SShiftLogo from "@/assets/placeholders/sshift-logo.png";
import SpielLogo from "@/assets/placeholders/spiel-logo.png";
import { COLLECTION_ADDRESS, SOCIAL_X, SOCIAL_DISCORD, SOCIAL_TELEGRAM, SOCIAL_HOMEPAGE } from "./constants";

export const config: Config = {
  collection_id: COLLECTION_ADDRESS,

  // Removing one or all of these socials will remove them from the page
  socials: {
    twitter: SOCIAL_X,
    discord: SOCIAL_DISCORD,
    homepage: SOCIAL_HOMEPAGE,
    telegram: SOCIAL_TELEGRAM,
  },

  defaultCollection: {
    name: "Pages from the 📒",
    description: "Draw, Write, Mint. Grow the Collection. Join our ever-growing community of digital artists, dreamers, and storytellers. Each NFT begins with a blank page—then becomes a permanent entry in the ledger of human expression.",
    image: Paper,
    subDescription: "Your creativity knows no bounds! Every blank page is a canvas waiting for your unique story, your vision, your moment to shine in our digital gallery. Let's create something amazing together! ✨"
  },

  ourStory: {
    title: "An Ever-Growing Community Ledger",
    subTitle: "Create Together",
    description:
      "Every page you mint is an indelible contribution to a living, breathing digital tapestry. Express yourself, share your vision, and permanently record your creative legacy. Every minted page is a unique part of our collective story, preserved forever on-chain, minted proudly with 📒 tokens. Join our vibrant community and make your mark today!",
    discordLink: SOCIAL_DISCORD,
    images: [Paper, Placeholder2, Placeholder3],
  },

  howToMint: {
    title: "How to Create & Mint",
    steps: [
      "Connect Your Wallet",
      "Tear a page from ledger",
      "Draw, Write, or Doodle",
      "Confirm 📒 payment",
      "Receive your NFT"
    ]
  },

  ourTeam: {
    title: "Created By",
    members: [
      {
        name: "Singularity Shift Ltd",
        role: "Creator",
        img: SShiftLogo
      },
      {
        name: "SpielCrypto",
        role: "Creator",
        img: SpielLogo
      },
    ],
  },

  faqs: {
    title: "How to Create & Mint",
    questions: [
      {
        title: "What is Ledger Fun App 📒?",
        description:
          "Ledger Fun App 📒 is a user-generated NFT platform where members can draw, doodle or write content to a page of the ledger and mint it as an NFT for a fee in 📒 token. Each piece becomes part of our ever-growing community NFT collection.",
      },
      {
        title: "How do I create my own artwork?",
        description:
          "Once the drawing feature is launched, you'll be able to use our built-in drawing tool to create your artwork. Connect your wallet, create your masterpiece, and mint it to join the collection.",
      },
      {
        title: "How much does it cost to mint?",
        description:
          "Minting your artwork costs a small fee paid in 📒 token. This fee helps maintain the platform and ensures the quality of human service.",
      },
    ],
  },
};

export interface Config {
  collection_id: string;

  socials?: {
    twitter?: string;
    discord?: string;
    homepage?: string;
    telegram?: string;
  };

  defaultCollection?: {
    name: string;
    description: string;
    image: string;
    subDescription?: string;
  };

  ourTeam?: {
    title: string;
    members: Array<ConfigTeamMember>;
  };

  ourStory?: {
    title: string;
    subTitle: string;
    description: string;
    discordLink: string;
    images?: Array<string>;
  };

  howToMint?: {
    title: string;
    steps: string[];
  };

  faqs?: {
    title: string;
    questions: Array<{
      title: string;
      description: string;
    }>;
  };
}

export interface ConfigTeamMember {
  name: string;
  role: string;
  img: string;
  socials?: {
    twitter?: string;
    discord?: string;
  };
}
