import { useQuery } from "@tanstack/react-query";
import { aptosClient } from "@/utils/aptosClient";
import { Collection } from "./useGetCollectionData";
import { MODULE_ADDRESS } from "@/constants";

interface AllCollectionsQueryResult {
  current_collections_v2: Array<Collection>;
}

export function useGetAllCollections() {
  return useQuery({
    queryKey: ["all-collections"],
    refetchInterval: 1000 * 30,
    queryFn: async () => {
      try {
        // First get all collection objects from the registry
        const registryResult = await aptosClient().view<{ inner: string }[][]>({
          payload: {
            function: `${MODULE_ADDRESS}::message_minter::get_registry`,
            typeArguments: [],
            functionArguments: [],
          },
        });

        const collectionIds = registryResult[0].map((c) => c.inner);

        if (collectionIds.length === 0) return [];

        // Then query the details for each collection
        const res = await aptosClient().queryIndexer<AllCollectionsQueryResult>({
          query: {
            query: `
            query AllCollectionsQuery {
              current_collections_v2(where: {
                collection_id: {
                  _in: "${collectionIds}"
                }
              }) {
                creator_address
                collection_id
                collection_name
                current_supply
                max_supply
                uri
                description
                cdn_asset_uris {
                  cdn_animation_uri
                  cdn_image_uri
                }
              }
            }`,
          },
        });

        return res.current_collections_v2;
      } catch (error) {
        console.error("Error fetching collections:", error);
        return [];
      }
    },
  });
}
