import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetAllCollections } from "@/hooks/useGetAllCollections";
import { Collection } from "@/hooks/useGetCollectionData";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, Search, Copy } from "lucide-react";
import { truncateAddress } from "@aptos-labs/wallet-adapter-react";

export function CollectionList() {
  const { data: collections = [], isLoading } = useGetAllCollections();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<keyof Collection | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field: keyof Collection) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: keyof Collection) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
  };

  const filteredAndSortedCollections = useMemo(() => {
    let result = [...collections];

    // Filter collections based on search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (collection) =>
          collection.collection_name.toLowerCase().includes(query) ||
          collection.description.toLowerCase().includes(query) ||
          collection.collection_id.toLowerCase().includes(query),
      );
    }

    // Sort collections
    if (sortField) {
      result.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }

        // Handle numeric values
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        }

        return 0;
      });
    }

    return result;
  }, [collections, searchQuery, sortField, sortDirection]);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="heading-md">Collection List</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search collections..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading collections...</div>
          ) : filteredAndSortedCollections.length === 0 ? (
            <div className="text-center py-4">
              {searchQuery ? "No collections found matching your search." : "No collections available."}
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button
                        variant="ghost"
                        className="flex items-center gap-1 font-medium hover:bg-transparent hover:underline"
                        onClick={() => handleSort("collection_name")}
                      >
                        Collection Name {getSortIcon("collection_name")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        className="flex items-center gap-1 font-medium hover:bg-transparent hover:underline"
                        onClick={() => handleSort("description")}
                      >
                        Description {getSortIcon("description")}
                      </Button>
                    </TableHead>
                    <TableHead>Image URL</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        className="flex items-center gap-1 font-medium hover:bg-transparent hover:underline"
                        onClick={() => handleSort("collection_id")}
                      >
                        Collection Address {getSortIcon("collection_id")}
                      </Button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedCollections.map((collection) => (
                    <TableRow key={collection.collection_id}>
                      <TableCell className="font-medium">{collection.collection_name}</TableCell>
                      <TableCell className="max-w-xs truncate">{collection.description}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        <a href={collection.cdn_asset_uris?.cdn_image_uri || collection.uri}>
                          {collection.cdn_asset_uris?.cdn_image_uri || collection.uri}
                        </a>
                      </TableCell>
                      <TableCell className="max-w-xs truncate font-mono text-xs">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-1 hover:bg-transparent"
                          onClick={() => {
                            navigator.clipboard.writeText(collection.collection_id);
                            const button = document.getElementById(`copy-${collection.collection_id}`);
                            if (button) {
                              button.innerHTML =
                                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                              setTimeout(() => {
                                button.innerHTML =
                                  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>';
                              }, 2000);
                            }
                          }}
                        >
                          {truncateAddress(collection.collection_id)}
                          <span id={`copy-${collection.collection_id}`}>
                            <Copy className="w-4 h-4" />
                          </span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
