import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAbiClient } from "@/contexts/AbiProvider";
import { useWalletClient } from "@thalalabs/surf/hooks";
import { toast } from "@/components/ui/use-toast";
import { convertAmountFromHumanReadableToOnChain } from "@/utils/helpers";
import { convertAmountFromOnChainToHumanReadable } from "@aptos-labs/ts-sdk";
import { uploadCollectionData } from "@/utils/assetsUploader";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { aptosClient } from "@/utils/aptosClient";
import { COIN_TYPE } from "@/constants";

interface CollectionConfigForm {
  royaltyPercentage: string;
  metadata: {
    name: string;
    description: string;
    image: string;
    external_url: string;
  };
}

interface MintPriceForm {
  mintPrice: string;
  coinType: string;
}
export function CollectionConfig() {
  const [formData, setFormData] = useState<CollectionConfigForm>({
    royaltyPercentage: "",
    metadata: {
      name: "",
      description: "",
      image: "",
      external_url: "",
    },
  });

  const [collectionImage, setCollectionImage] = useState<File>();

  const [mintPriceData, setMintPriceData] = useState<MintPriceForm>({
    mintPrice: "",
    coinType: "",
  });
  const { ledgeABI, abi } = useAbiClient();
  const { client } = useWalletClient();
  const wallet = useWallet();
  const aptos = aptosClient();

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCollectionImage(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof CollectionConfigForm] as Record<string, string>),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleMintPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMintPriceData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getDecimals = async (coinAddress: string): Promise<number> => {
    const queryResponse = await aptos.queryIndexer<{ coin_infos: { decimals: number }[] }>({
      query: {
        query: `query LedgeQuery {
          coin_infos(where: {
            coin_type: {
              _eq: "${coinAddress}${COIN_TYPE}"
            }
          }){
            decimals
          }
        }`,
      },
    });

    return queryResponse.coin_infos[0].decimals;
  };

  const handleMintPriceSubmit = async () => {
    try {
      const decimals = await getDecimals(mintPriceData.coinType);

      const tx = await client?.useABI(ledgeABI).set_config({
        type_arguments: [`${mintPriceData.coinType}${COIN_TYPE}`],
        arguments: [convertAmountFromHumanReadableToOnChain(parseFloat(mintPriceData.mintPrice), decimals)],
      });

      toast({
        title: "Mint price set",
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
      toast({
        title: "Error set mint price",
        description: `Failed to set mint price: ${error}`,
        variant: "destructive",
      });
    }
  };

  const createCollection = async () => {
    const jsonData = {
      ...formData.metadata,
      image: "to_fill_after_upload",
      attributes: [],
    };
    const jsonString = JSON.stringify(jsonData, null, 2);
    const collectionJsonFile = new File([jsonString], "collection.json", { type: "application/json" });

    try {
      const responseUrl = await uploadCollectionData(wallet, [collectionImage as File, collectionJsonFile], aptos);

      const tx = await client?.useABI(ledgeABI).create_collection({
        type_arguments: [],
        arguments: [
          responseUrl.collectionDescription,
          responseUrl.collectionName,
          responseUrl.projectUri,
          formData.royaltyPercentage,
        ],
      });

      toast({
        title: "Collection created",
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
      toast({
        title: "Error creating collection",
        description: `Failed to create collection: ${error}`,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!abi) return;

    void (async () => {
      const mintConfig = await abi.useABI(ledgeABI).view.get_mint_settings({
        typeArguments: [],
        functionArguments: [],
      });

      const decimals = await getDecimals(mintConfig[0]);

      setMintPriceData({
        mintPrice: convertAmountFromOnChainToHumanReadable(parseFloat(mintConfig[1]), decimals).toFixed(2),
        coinType: mintConfig[0],
      });
    })();
  }, [abi, ledgeABI]);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="heading-md">Collection Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 mb-8">
            <h3 className="heading-sm">Mint Price Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="mintPrice">Mint Price (📒)</Label>
                <Input
                  id="mintPrice"
                  name="mintPrice"
                  type="number"
                  step="0.01"
                  value={mintPriceData.mintPrice}
                  onChange={handleMintPriceChange}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coinType">Coin Address</Label>
                <Input
                  id="coinType"
                  name="coinType"
                  type="text"
                  value={mintPriceData.coinType}
                  onChange={handleMintPriceChange}
                  placeholder="Enter coin address"
                />
              </div>
            </div>
            <Button type="submit" onClick={handleMintPriceSubmit}>
              Update Mint Price
            </Button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Royalty Percentage (%)</Label>
                <Input
                  id="royaltyPercentage"
                  name="royaltyPercentage"
                  type="number"
                  step="0.1"
                  value={formData.royaltyPercentage}
                  onChange={handleInputChange}
                  placeholder="0.0"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="heading-sm">Metadata Configuration</h3>
              <div className="space-y-2">
                <Label>Collection Name</Label>
                <Input
                  id="metadata.name"
                  name="metadata.name"
                  value={formData.metadata.name}
                  onChange={handleInputChange}
                  placeholder="Enter collection name"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  id="metadata.description"
                  name="metadata.description"
                  value={formData.metadata.description}
                  onChange={handleInputChange}
                  placeholder="Enter collection description"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>External URL</Label>
                <Input
                  id="metadata.external_url"
                  name="metadata.external_url"
                  value={formData.metadata.external_url}
                  onChange={handleInputChange}
                  placeholder="Enter external URL"
                />
              </div>
              <div className="space-y-2">
                <Label>Upload image</Label>
                <Input
                  id="collectionImage"
                  name="collectionImage"
                  onChange={handleUploadImage}
                  type="file"
                  placeholder="Upload collection cover image"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" onClick={createCollection}>
                Create Collection
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
