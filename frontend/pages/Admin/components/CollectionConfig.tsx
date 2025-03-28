import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CollectionConfigForm {
  mintPrice: string;
  royaltyPercentage: string;
  metadata: {
    name: string;
    description: string;
    image: string;
    external_url: string;
  };
}

export function CollectionConfig() {
  const [formData, setFormData] = useState<CollectionConfigForm>({
    mintPrice: "",
    royaltyPercentage: "",
    metadata: {
      name: "",
      description: "",
      image: "",
      external_url: "",
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof CollectionConfigForm],
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement collection creation logic
    console.log("Form submitted:", formData);
  };

  const generateJson = () => {
    const jsonData = {
      ...formData.metadata,
      attributes: [],
    };
    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "collection-metadata.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="heading-md">Collection Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="mintPrice">Mint Price (📒)</Label>
                <Input
                  id="mintPrice"
                  name="mintPrice"
                  type="number"
                  step="0.01"
                  value={formData.mintPrice}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="royaltyPercentage">Royalty Percentage (%)</Label>
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
                <Label htmlFor="metadata.name">Collection Name</Label>
                <Input
                  id="metadata.name"
                  name="metadata.name"
                  value={formData.metadata.name}
                  onChange={handleInputChange}
                  placeholder="Enter collection name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metadata.description">Description</Label>
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
                <Label htmlFor="metadata.image">Image URL</Label>
                <Input
                  id="metadata.image"
                  name="metadata.image"
                  value={formData.metadata.image}
                  onChange={handleInputChange}
                  placeholder="Enter image URL"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metadata.external_url">External URL</Label>
                <Input
                  id="metadata.external_url"
                  name="metadata.external_url"
                  value={formData.metadata.external_url}
                  onChange={handleInputChange}
                  placeholder="Enter external URL"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={generateJson}>
                Generate JSON
              </Button>
              <Button type="submit">Create Collection</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 