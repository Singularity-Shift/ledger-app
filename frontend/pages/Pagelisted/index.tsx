import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { wapal } from "@/services/wapal";
import { useToast } from "@/components/ui/use-toast";
import { convertAmountFromHumanReadableToOnChain, convertAmountFromOnChainToHumanReadable } from "@aptos-labs/ts-sdk";
import { APT_DECIMALS } from "@/utils/helpers";
import { Header } from "@/components/Header";
import { Skeleton } from "@/components/ui/skeleton";
import { Tag, ArrowUpDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWalletClient } from "@thalalabs/surf/hooks";
import { CREATOR_ADDRESS } from "@/constants";

interface ListedNFT {
  tokenDataId: string;
  tokenName: string;
  description: string;
  tokenImageUri: string;
  price: string;
  seller: string;
  marketplace: string;
  listingId: string;
}

export default function PagesListed() {
  const [listedNFTs, setListedNFTs] = useState<ListedNFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [buyingNFT, setBuyingNFT] = useState<string>();
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("price-asc");
  const { client } = useWalletClient();
  const { toast } = useToast();

  // Create a ref for the observer target (last item)
  const observer = useRef<IntersectionObserver | null>(null);

  // Use useMemo for filtering and sorting to improve performance
  const filteredAndSortedNFTs = useMemo(() => {
    // First filter the NFTs based on search term
    const filtered = searchTerm ? listedNFTs.filter((nft) => nft.tokenName === searchTerm) : listedNFTs;

    // Then sort the filtered NFTs
    return [...filtered].sort((a, b) => {
      switch (sortOption) {
        case "price-asc":
          return parseInt(a.price) - parseInt(b.price);
        case "price-desc":
          return parseInt(b.price) - parseInt(a.price);
        case "name-asc":
          return a.tokenName.localeCompare(b.tokenName);
        case "name-desc":
          return b.tokenName.localeCompare(a.tokenName);
        default:
          return 0;
      }
    });
  }, [listedNFTs, searchTerm, sortOption]);

  const lastNFTElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || loadingMore) return;

      // Disconnect previous observer if it exists
      if (observer.current) observer.current.disconnect();

      // Create new observer
      observer.current = new IntersectionObserver(
        (entries) => {
          // If the last element is visible and we have more items to load
          if (entries[0].isIntersecting && hasMore) {
            loadMoreNFTs();
          }
        },
        { threshold: 0.5 },
      );

      // Observe the last element
      if (node) observer.current.observe(node);
    },
    [loading, loadingMore, hasMore],
  );

  const loadNFTs = async (page: number, isInitialLoad: boolean = false) => {
    try {
      if (isInitialLoad) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const nftsResult = await wapal.get("/collection/tokens/pages", {
        params: {
          type: "listed",
          take: "12", // Reduced page size for smoother loading
          page: page.toString(),
        },
      });

      const newNFTs = nftsResult.data.data;

      // Check if we've reached the end of the data
      if (newNFTs.length === 0) {
        setHasMore(false);
      } else {
        setCurrentPage(page);

        if (isInitialLoad) {
          setListedNFTs(newNFTs);
        } else {
          setListedNFTs((prev) => [...prev, ...newNFTs]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch listed NFTs:", error);
      toast({
        title: "Error",
        description: "Failed to load listed NFTs. Please try again later.",
        variant: "destructive",
      });
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  };

  const loadMoreNFTs = () => {
    loadNFTs(currentPage + 1);
  };

  useEffect(() => {
    loadNFTs(1, true);

    // Cleanup observer on component unmount
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  const handleBuyNFT = async (id: string, tokenName: string, price: string, marketplace: string) => {
    try {
      setBuyingNFT(id);
      const tx = await client?.submitTransaction({
        function: "0x7ccf0e6e871977c354c331aa0fccdffb562d9fceb27e3d7f61f8e12e470358e9::aggregator::purchase_many",
        typeArguments: ["0x1::aptos_coin::AptosCoin"],
        functionArguments: [
          [id],
          [marketplace],
          CREATOR_ADDRESS,
          "📒 - Pages",
          [tokenName],
          [0],
          [convertAmountFromHumanReadableToOnChain(parseFloat(price), APT_DECIMALS)],
          1,
        ],
      });

      toast({
        title: "Purchase Successful",
        description: (
          <div>
            <a href={`https://explorer.aptoslabs.com/txn/${tx?.hash}`} target="_blank">
              {tx?.hash}
            </a>
          </div>
        ),
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to buy NFT:", error);
      toast({
        title: "Error Purchasing NFT",
        description: "Failed to buy the NFT. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setBuyingNFT(undefined);
    }
  };

  if (loading) {
    return (
      <div className="max-w-screen-xl mx-auto p-4">
        <Header />
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Pages Listed for Sale</h1>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="h-64 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <Skeleton className="h-6 w-1/3" />
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

  if (listedNFTs.length === 0) {
    return (
      <div className="max-w-screen-xl mx-auto p-4">
        <Header />
        <div className="flex flex-col items-center justify-center py-16 space-y-6">
          <div className="bg-muted rounded-full p-6">
            <Tag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold">No Pages Listed for Sale</h1>
          <p className="text-muted-foreground text-center max-w-md">
            There are currently no NFTs listed for sale in this collection. Check back later or mint your own!
          </p>
          <Button asChild>
            <a href="/">Go to Mint Page</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <Header />

      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold mb-2 text-gray-700">Pages Listed for Sale</h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by page"
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-full sm:w-40">
                <div className="flex items-center">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Sort by" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="name-asc">Page: Low to High</SelectItem>
                <SelectItem value="name-desc">Page: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredAndSortedNFTs.length === 0 && searchTerm ? (
          <div className="text-center py-12 border rounded-lg">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No results found for &quot;{searchTerm}&quot;</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {filteredAndSortedNFTs.map((nft, index) => {
              // Check if this is the last element
              const isLastElement = index === filteredAndSortedNFTs.length - 1;

              return (
                <div key={nft.tokenDataId} ref={isLastElement ? lastNFTElementRef : null}>
                  <Card className="overflow-hidden h-full flex flex-col">
                    <CardHeader className="p-0">
                      <div className="aspect-square w-full">
                        <img
                          src={nft.tokenImageUri}
                          alt={nft.tokenName}
                          className="w-full h-full object-cover"
                          loading="lazy" // Add lazy loading for better performance
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 flex-grow">
                      <CardTitle className="text-xl mb-2">Page Nº {nft.tokenName}</CardTitle>
                      <p className="text-sm text-gray-500 mb-2">{nft.description}</p>
                      <p className="font-bold text-lg">
                        {convertAmountFromOnChainToHumanReadable(parseInt(nft.price), APT_DECIMALS)} APT
                      </p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button
                        className="w-full"
                        onClick={() =>
                          handleBuyNFT(
                            nft.marketplace === "wapal" ? nft.listingId : nft.seller,
                            nft.tokenName,
                            nft.price,
                            nft.marketplace,
                          )
                        }
                        disabled={buyingNFT === nft.tokenDataId}
                      >
                        {buyingNFT === nft.tokenDataId ? (
                          <>
                            <Spinner className="mr-2" size="sm" />
                            Buying...
                          </>
                        ) : (
                          "Buy Now"
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              );
            })}
          </div>
        )}

        {/* Loading indicator for infinite scroll */}
        {loadingMore && (
          <div className="flex justify-center items-center py-6">
            <Spinner size="md" />
            <span className="ml-2">Loading more...</span>
          </div>
        )}

        {/* End of results message */}
        {!hasMore && filteredAndSortedNFTs.length > 0 && (
          <div className="text-center py-6 text-gray-500">You've reached the end of the listings</div>
        )}
      </div>
    </div>
  );
}
