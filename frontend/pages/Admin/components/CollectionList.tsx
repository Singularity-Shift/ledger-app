import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetAllCollections } from "@/hooks/useGetAllCollections";
import { Collection } from "@/hooks/useGetCollectionData";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, Search } from "lucide-react";

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
          collection.collection_id.toLowerCase().includes(query)
      );
    }

    // Sort collections
    if (sortField) {
      result.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
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
                      <TableCell className="max-w-xs truncate">
                        {collection.description}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {collection.cdn_asset_uris?.cdn_image_uri || collection.uri}
                      </TableCell>
                      <TableCell className="max-w-xs truncate font-mono text-xs">
                        {collection.collection_id}
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