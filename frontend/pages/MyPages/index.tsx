import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { Info } from "@/components/ui/info";
import { truncateAddress, useWallet } from "@aptos-labs/wallet-adapter-react";
import { useToast } from "@/components/ui/use-toast";
import { useWalletClient } from "@thalalabs/surf/hooks";
import { aptosClient } from "@/utils/aptosClient";
import { COLLECTION_ADDRESS } from "@/constants";
import { Header } from "@/components/Header";
import axios from "axios";
import {
  convertAmountFromHumanReadableToOnChain,
  GetAccountOwnedTokensFromCollectionResponse,
} from "@aptos-labs/ts-sdk";
import { APT_DECIMALS } from "@/utils/helpers";

export default function MyPages() {
  const [ownedNFTs, setOwnedNFTs] = useState<(GetAccountOwnedTokensFromCollectionResponse[0] & { img_url: string })[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [isListingDialogOpen, setIsListingDialogOpen] = useState(false);
  const [listingPrice, setListingPrice] = useState("");
  const [processingAction, setProcessingAction] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<string | null>(null);
  const { client } = useWalletClient();
  const aptos = aptosClient();

  const { account, connected } = useWallet();
  const { toast } = useToast();

  const listNFT = async (nftId: string, price: string) => {
    try {
      setProcessingAction(true);
      const tx = await client?.submitTransaction({
        function: "0x584b50b999c78ade62f8359c91b5165ff390338d45f8e55969a04e65d76258c9::coin_listing::init_fixed_price",
        typeArguments: ["0x1::aptos_coin::AptosCoin"],
        functionArguments: [
          nftId,
          "0x71f7c94805c33d32a7f9560c95f02e9d3b5bc49884a883916f03abe6da11ac08",
          convertAmountFromHumanReadableToOnChain(parseFloat(price), APT_DECIMALS),
        ],
      });

      // Update the NFT in the state
      setOwnedNFTs((prev) =>
        prev.map((nft) => {
          if (nft.current_token_data?.token_data_id === nftId) {
            return { ...nft, isListed: true, price };
          }
          return nft;
        }),
      );

      toast({
        title: "NFT Listed",
        description: (
          <div>
            <a href={`https://explorer.aptoslabs.com/txn/${tx?.hash}`} target="_blank">
              {truncateAddress(tx?.hash)}
            </a>
          </div>
        ),
        variant: "default",
      });

      return true;
    } catch (error) {
      console.error("Failed to list NFT:", error);
      toast({
        title: "Error Listing NFT",
        description: "Failed to list your NFT. Please try again later.",
        variant: "destructive",
      });
      return false;
    } finally {
      fetchMyNFTs();
      setProcessingAction(false);
      setIsListingDialogOpen(false);
      setSelectedNFT(null);
    }
  };

  const fetchMyNFTs = async () => {
    const result = await aptos.getAccountOwnedTokensFromCollectionAddress({
      collectionAddress: COLLECTION_ADDRESS,
      accountAddress: account?.address.toString() as `0x${string}`,
    });

    const resultMapped = await Promise.all(
      await result.map(async (nft) => {
        const values = { ...nft, img_url: "" };

        const jsonFile = await axios.get(values.current_token_data?.token_uri as string, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        values.img_url = jsonFile.data.image;

        return values;
      }),
    );

    return resultMapped;
  };

  useEffect(() => {
    if (!connected || !account) {
      setOwnedNFTs([]);
      setLoading(false);
      return;
    }

    const loadMyNFTs = async () => {
      try {
        setLoading(true);
        const nfts = await fetchMyNFTs();
        setOwnedNFTs(nfts);
      } catch (error) {
        console.error("Failed to fetch owned NFTs:", error);
        toast({
          title: "Error",
          description: "Failed to load your NFTs. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadMyNFTs();
  }, [account, connected, toast]);

  const handleOpenListingDialog = (nftId: string) => {
    setSelectedNFT(nftId);
    setListingPrice("");
    setIsListingDialogOpen(true);
  };

  const handleListNFT = async () => {
    if (!selectedNFT) return;

    if (!listingPrice || isNaN(Number(listingPrice)) || Number(listingPrice) <= 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price greater than 0",
        variant: "destructive",
      });
      return;
    }

    await listNFT(selectedNFT, listingPrice);
  };

  if (!connected) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">My Pages</h1>
          <div className="text-center p-8 border rounded-lg">
            <p className="text-lg text-gray-500">Please connect your wallet to view your NFTs.</p>
          </div>
        </div>
      </div>
    );
  }

  // Render skeleton UI while loading
  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">My Pages</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="p-0">
                  <Skeleton className="aspect-square w-full" />
                </CardHeader>
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (ownedNFTs.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">My Pages</h1>
          <div className="text-center p-8 border rounded-lg">
            <p className="text-lg text-gray-500">You don't own any NFTs from this collection yet.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-screen-xl mx-auto">
        <div className="mb-6 flex items-center gap-2">
          <h1 className="text-3xl font-bold">My Pages</h1>
          <Info description="List your pages for sale on Wapal. Each page can be listed individually." />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ownedNFTs.map((nft) => (
            <Card key={nft.token_data_id} className="overflow-hidden">
              <CardHeader className="p-0">
                <div className="aspect-square w-full">
                  <img
                    src={nft.img_url}
                    alt={nft.current_token_data?.token_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback if image fails to load
                      e.currentTarget.src = "https://via.placeholder.com/400?text=Image+Not+Available";
                    }}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-xl mb-2">Page Nº {nft.current_token_data?.token_name}</CardTitle>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button
                  variant={"default"}
                  className="w-full"
                  onClick={() => {
                    handleOpenListingDialog(nft.token_data_id);
                  }}
                  disabled={processingAction}
                >
                  {processingAction && selectedNFT === nft.token_data_id ? (
                    <>
                      <Spinner className="mr-2" size="sm" />
                      Listing
                    </>
                  ) : (
                    "List for Sale"
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <Dialog open={isListingDialogOpen} onOpenChange={setIsListingDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>List NFT for Sale</DialogTitle>
            </DialogHeader>

            <div className="py-4">
              <p className="mb-4">You are about to list your NFT for sale on the marketplace.</p>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label htmlFor="price" className="text-sm font-medium">
                    Price (APT)
                  </label>
                  <Info description="Set the price in APT (Aptos) tokens. This is the amount a buyer will pay to purchase your NFT." />
                </div>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Enter price in APT"
                  value={listingPrice}
                  onChange={(e) => setListingPrice(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsListingDialogOpen(false);
                  setSelectedNFT(null);
                }}
                disabled={processingAction}
              >
                Cancel
              </Button>
              <Button onClick={handleListNFT} disabled={processingAction}>
                {processingAction ? (
                  <>
                    <Spinner className="mr-2" size="sm" />
                    Listing...
                  </>
                ) : (
                  "Confirm Listing"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
