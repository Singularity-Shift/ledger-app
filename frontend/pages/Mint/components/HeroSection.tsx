import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { FC, useEffect, useState } from "react";
// Internal assets
import Copy from "@/assets/icons/copy.svg";
import ExternalLink from "@/assets/icons/external-link.svg";
import Paper from "@/assets/placeholders/paper.png";
// Internal utils
import { truncateAddress } from "@/utils/truncateAddress";
// Internal hooks
import { useGetCollectionData } from "@/hooks/useGetCollectionData";
// Internal components
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { toast } from "@/components/ui/use-toast";
import { Socials } from "@/pages/Mint/components/Socials";
import { PencilSketchPortal } from "@/components/PencilSketchPortal";
// Internal constants
import { COIN_TYPE, COLLECTION_ADDRESS, NETWORK } from "@/constants";
// Internal config
import { config } from "@/config";
import { updateMintData } from "@/utils/assetsUploader";
import { aptosClient } from "@/utils/aptosClient";
import { useWalletClient } from "@thalalabs/surf/hooks";
import { useAbiClient } from "@/contexts/AbiProvider";
import { convertAmountFromOnChainToHumanReadable } from "@aptos-labs/ts-sdk";
import { Spinner } from "@/components/ui/spinner";

// Time formatting utility
const formatTimeToHMS = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  return `${hours} hr ${minutes} min ${remainingSeconds} sec`;
};

interface HeroSectionProps {}

export const HeroSection: React.FC<HeroSectionProps> = () => {
  const { data } = useGetCollectionData();
  const { account } = useWallet();
  const [showSketchPortal, setShowSketchPortal] = useState(false);
  const [drawnImage, setDrawnImage] = useState<File | null>(null);
  const [drawingTime, setDrawingTime] = useState<number | null>(null);
  const [drawPath, setDrawPath] = useState<string>("");
  const [usedTracing, setUsedTracing] = useState<boolean>(false);
  const [mintId, setMintId] = useState<string>("");
  const [securityToken, setSecurityToken] = useState<string | null>(null);
  const [mintFee, setMintFee] = useState<number>(0);
  const [coinMintFees, setCoinMintFees] = useState<string>("");
  const [isMinting, setIsMinting] = useState<boolean>(false);
  const wallet = useWallet();
  const aptos = aptosClient();
  const { client } = useWalletClient();
  const { abi, ledgeABI } = useAbiClient();

  const { collection } = data ?? {};

  const mintNFT = async () => {
    if (!collection?.collection_id) return;
    if (!account) {
      toast({ variant: "destructive", title: "Error", description: "You must connect a wallet before minting" });
      return;
    }

    if (!securityToken) {
      toast({
        variant: "destructive",
        title: "Security Error",
        description: "Drawing validation failed. Please create your drawing again.",
      });
      return;
    }

    setIsMinting(true);

    try {
      const tokenData = JSON.parse(atob(securityToken));
      const currentTime = Date.now();

      if (currentTime - tokenData.currentTimestamp > 3600000) {
        toast({
          variant: "destructive",
          title: "Session Expired",
          description: "Your drawing session has expired. Please create your drawing again.",
        });
        setDrawnImage(null);
        setSecurityToken(null);
        return;
      }

      const jsonData = {
        description: `${collection?.collection_name}: ${mintId}`,
        image: "to_fill_after_upload",
        external_url: `https://ledgerapp.fun/minted/${collection?.collection_id}`,
        attributes: [
          {
            trait_type: "Created by",
            value: account.address,
          },
          {
            trait_type: "Time taken drawing",
            value: drawingTime ? formatTimeToHMS(drawingTime) : "0 hr 0 min 0 sec",
          },
          {
            trait_type: "Traced from image",
            value: usedTracing ? "Yes" : "No",
          },
        ],
      };
      const jsonString = JSON.stringify(jsonData, null, 2);
      const imageJsonFile = new File([jsonString], `${mintId}.json`, { type: "application/json" });

      const responseUrl = await updateMintData(mintId, wallet, [drawnImage as File, imageJsonFile], aptos);

      const tx = await client?.useABI(ledgeABI).mint_nft({
        type_arguments: [coinMintFees],
        arguments: [COLLECTION_ADDRESS, responseUrl.imageUrl],
      });

      toast({
        title: "Minted!",
        description: (
          <div>
            <a href={`https://explorer.aptoslabs.com/txn/${tx?.hash}`} target="_blank">
              {tx?.hash}
            </a>
          </div>
        ),
      });

      setSecurityToken(null);
    } catch (error) {
      console.error("Error processing mint transaction:", error);
      toast({
        variant: "destructive",
        title: "Mint Error",
        description: "Failed to mint your drawing. Please try again.",
      });
    } finally {
      setIsMinting(false);
    }
  };

  const handleSketchSubmit = (
    image: File,
    time: number,
    path: string,
    id: string,
    tracingUsed: boolean = false,
    token: string,
  ) => {
    setDrawnImage(image);
    setDrawingTime(time);
    setDrawPath(path);
    setMintId(id);
    setUsedTracing(tracingUsed);
    setSecurityToken(token);
  };

  useEffect(() => {
    if (!abi) {
      return;
    }

    void (async () => {
      const mintConfig = await abi.useABI(ledgeABI).view.get_mint_settings({
        typeArguments: [],
        functionArguments: [],
      });

      const coinTypes = await aptos.queryIndexer<{ coin_infos: { coin_type: string; decimals: number }[] }>({
        query: {
          query: `query LedgeQuery {
            coin_infos(where: {
              creator_address: {
                _eq: "${mintConfig[0]}"
              }
            }){
              coin_type,
              decimals
            }
          }`,
        },
      });

      const coinType = coinTypes.coin_infos.find((c) => c.coin_type === `${mintConfig[0]}${COIN_TYPE}`);

      setCoinMintFees(coinType?.coin_type as string);

      setMintFee(convertAmountFromOnChainToHumanReadable(parseFloat(mintConfig[1]), coinType?.decimals as number));
    })();
  }, [abi]);

  return (
    <section className="hero-container flex flex-col md:flex-row gap-4 md:gap-6 px-3 md:px-4 max-w-screen-xl mx-auto w-full bg-white bg-opacity-90 backdrop-blur-sm p-3 md:p-4 rounded-lg border-2 border-black shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300">
      <div className="w-full md:basis-2/5 relative">
        <div className="relative w-full aspect-square">
          {/* Paper background (always consistent) */}
          <Image
            src={Paper}
            rounded
            className={`w-full h-full object-cover absolute inset-0 ${!drawnImage ? "filter brightness-50" : ""}`}
          />
          {/* Drawing overlay (if exists) */}
          {drawnImage && (
            <Image src={drawPath} rounded className="w-full h-full object-contain absolute inset-0 z-10" />
          )}
          {/* Fallback to collection image if no drawing */}
          {!drawnImage && collection?.cdn_asset_uris && (
            <Image
              src={collection?.cdn_asset_uris.cdn_image_uri ?? collection?.cdn_asset_uris.cdn_animation_uri ?? Paper}
              rounded
              className="w-full h-full object-cover absolute inset-0 filter brightness-50"
            />
          )}
        </div>
        <div className="absolute inset-0 flex items-center justify-center z-20">
          {!drawnImage && (
            <Button
              className="h-12 md:h-16 text-base md:text-lg px-6 md:px-8 py-4 md:py-6 border-2 border-black"
              variant="secondary"
              onClick={() => setShowSketchPortal(true)}
            >
              Tear a page from the 📒
            </Button>
          )}
        </div>
      </div>
      <div className="basis-full md:basis-3/5 flex flex-col gap-3 md:gap-4">
        <h1 className="title-md">{collection?.collection_name ?? config.defaultCollection?.name}</h1>
        <Socials />
        <p className="body-sm">{collection?.description ?? config.defaultCollection?.description}</p>

        <Card className="shadow-[0_4px_15px_rgb(0,0,0,0.1)] hover:shadow-[0_12px_24px_rgb(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300">
          <CardContent
            fullPadding
            className="flex flex-col md:flex-row gap-3 md:gap-4 md:justify-between items-start md:items-center flex-wrap p-3 md:p-4"
          >
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full">
              <div className="flex gap-2 w-full">
                <Button
                  className="h-12 md:h-16 flex-1 text-base md:text-lg"
                  onClick={mintNFT}
                  disabled={!drawnImage || !coinMintFees || isMinting}
                >
                  {isMinting ? (
                    <div className="flex items-center justify-center gap-2">
                      <Spinner size="sm" />
                      <span>Minting...</span>
                    </div>
                  ) : (
                    "Mint my Page"
                  )}
                </Button>
                {drawnImage && (
                  <Button
                    className="h-12 md:h-16 text-base md:text-lg"
                    type="button"
                    variant="destructive"
                    onClick={() => setDrawnImage(null)}
                    disabled={isMinting}
                  >
                    Remove
                  </Button>
                )}
              </div>
              {!!mintFee && (
                <span className="whitespace-nowrap text-secondary-text body-sm self-center">10,000 📒</span>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3 md:gap-4 mt-1 md:mt-2">
          <p className="body-sm text-secondary-text">{config.defaultCollection?.subDescription}</p>
        </div>

        <div className="flex flex-col md:flex-row gap-2 md:gap-x-2 items-start md:items-center flex-wrap justify-between">
          <p className="whitespace-nowrap body-sm-semibold">Collection Address</p>

          <div className="flex flex-wrap gap-2">
            <AddressButton address={collection?.collection_id ?? ""} />
            <a
              className={buttonVariants({ variant: "link", className: "text-sm md:text-base" })}
              target="_blank"
              href={`https://explorer.aptoslabs.com/account/${collection?.collection_id}?network=${NETWORK}`}
            >
              View on Explorer <Image src={ExternalLink} className="w-4 h-4 md:w-5 md:h-5" />
            </a>
          </div>
        </div>
      </div>

      <PencilSketchPortal
        isOpen={showSketchPortal}
        onClose={() => setShowSketchPortal(false)}
        onSubmit={handleSketchSubmit}
      />
    </section>
  );
};

const AddressButton: FC<{ address: string }> = ({ address }) => {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    if (copied) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }

  return (
    <Button onClick={onCopy} className="whitespace-nowrap flex gap-1 px-0 py-0" variant="link">
      {copied ? (
        "Copied!"
      ) : (
        <>
          {truncateAddress(address)}
          <Image src={Copy} className="dark:invert" />
        </>
      )}
    </Button>
  );
};
