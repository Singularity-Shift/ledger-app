import { Aptos } from "@aptos-labs/ts-sdk";
import { checkIfFund, uploadFolder } from "./irys";
import { WalletContextState } from "@aptos-labs/wallet-adapter-react";

const VALID_MEDIA_EXTENSIONS = ["png", "jpg", "jpeg", "gltf"];
type CollectionMetadata = {
  name: string;
  description: string;
  image: string;
  external_url: string;
};
type ImageAttribute = {
  trait_type: string;
  value: string;
};
type ImageMetadata = {
  name: string;
  description: string;
  image: string;
  external_url: string;
  attributes: ImageAttribute[];
};

export const uploadCollectionData = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  aptosWallet: WalletContextState,
  files: File[],
  aptos: Aptos,
): Promise<{
  collectionName: string;
  collectionDescription: string;
  projectUri: string;
}> => {
  // Convert FileList type into a File[] type
  const collectionFiles = files.filter((file) => file.name.includes("collection"));
  if (collectionFiles.length !== 2) {
    throw new Error("Please make sure you include both collection.json and collection image file");
  }

  // Check collection.json file exists
  const collectionMetadata = collectionFiles.find((file) => file.name === "collection.json");
  if (!collectionMetadata) {
    throw new Error("Collection metadata not found, please make sure you include collection.json file");
  }

  const collectionCover = collectionFiles.find((file) =>
    VALID_MEDIA_EXTENSIONS.some((ext) => file.name.endsWith(`.${ext}`)),
  );
  if (!collectionCover) {
    throw new Error("Collection cover not found, please make sure you include the collection image file");
  }

  // Calculate total files cost to upload to Irys
  const totalFileSize = collectionCover.size + collectionMetadata.size;

  // Check total file size doesn't exceed 2GB due to a Browse constraints
  const GIGABYTE = Math.pow(1024, 3);
  const MAX_SIZE = 2 * GIGABYTE;
  if (totalFileSize > MAX_SIZE) {
    throw new Error("Files size should not exceed 2GB");
  }

  // Check if need to first fund an Irys node
  const funded = await checkIfFund(aptosWallet, files, aptos);

  if (funded) {
    let imageFolderReceipt: string;
    try {
      // Upload collection thumbnail image and all NFT images as a folder
      imageFolderReceipt = await uploadFolder(aptosWallet, [collectionCover]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error(`Error uploading collection image and NFT images ${error}`);
    }

    // Update collection metadata with the cover image
    const parsedCollectionMetadata: CollectionMetadata = JSON.parse(await collectionMetadata.text());
    parsedCollectionMetadata.image = `${imageFolderReceipt}/collection.png`;
    const updatedCollectionMetadata = new File([JSON.stringify(parsedCollectionMetadata)], "collection.json", {
      type: collectionMetadata.type,
    });

    // Update each image metadata with the related image URL

    // Upload collection metadata and all NFTs' metadata as a folder
    try {
      const metadataFolderReceipt = await uploadFolder(aptosWallet, [updatedCollectionMetadata]);

      return {
        projectUri: `${metadataFolderReceipt}/collection.json`,
        collectionName: parsedCollectionMetadata.name,
        collectionDescription: parsedCollectionMetadata.description,
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error(`Error uploading collection metadata and NFTs' metadata ${error}`);
    }
  } else {
    throw new Error("Current account balance is not enough to fund a decentralized asset node");
  }
};

export const updateMintData = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  id: string,
  aptosWallet: WalletContextState,
  files: File[],
  aptos: Aptos,
): Promise<{
  imageUrl: string;
}> => {
  // Convert FileList type into a File[] type

  const nftImageMetadatas = files.filter((file) => file.name.endsWith("json"));

  if (nftImageMetadatas.length === 0) {
    throw new Error("Image metadata not found, please make sure you include the NFT json files");
  }

  // Check NFT image files exist
  const imageFiles = files.filter((file) => file.name.endsWith(`.png`));

  if (imageFiles.length === 0) {
    throw new Error("Image files not found, please make sure you include the NFT image files");
  }

  // Check nft metadata json files amount is the same as the nft image files
  if (nftImageMetadatas.length !== imageFiles.length) {
    throw new Error("Mismatch between NFT metadata json files and images files");
  }

  // Calculate total files cost to upload to Irys
  const totalFileSize =
    imageFiles.reduce((acc, file) => acc + file.size, 0) + nftImageMetadatas.reduce((acc, file) => acc + file.size, 0);

  // Check total file size doesn't exceed 2GB due to a Browse constraints
  const GIGABYTE = Math.pow(1024, 3);
  const MAX_SIZE = 2 * GIGABYTE;
  if (totalFileSize > MAX_SIZE) {
    throw new Error("Files size should not exceed 2GB");
  }

  let imageFolderReceipt: string;
  try {
    // Upload collection thumbnail image and all NFT images as a folder
    imageFolderReceipt = await uploadFolder(aptosWallet, [...imageFiles]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(`Error uploading collection image and NFT images ${error}`);
  }

  // Update collection metadata with the cover imag

  // Update each image metadata with the related image URL
  const updatedImageMetadatas = await Promise.all(
    nftImageMetadatas.map(async (file) => {
      const metadata: ImageMetadata = JSON.parse(await file.text());
      const imageUrl = `${imageFolderReceipt}/${file.name.replace("json", "png")}`;

      metadata.image = imageUrl;
      const fileMetadata = new File([JSON.stringify(metadata)], file.name, {
        type: file.type,
      });

      return fileMetadata;
    }),
  );

  try {
    const metadataFolderReceipt = await uploadFolder(aptosWallet, [...updatedImageMetadatas]);

    return {
      imageUrl: `${metadataFolderReceipt}/${id}.json`,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(`Error uploading collection metadata and NFTs' metadata ${error}`);
  }
};
