import { panora } from "@/services/panora";

export const getPrice = async (tokenAddress: string) => {
  try {
    const prices = await panora.get("/prices", {
      params: {
        tokenAddress,
      },
    });

    return prices.data?.[0].usdPrice;
  } catch (error: any) {
    throw new Error(`Error fetching price: ${error.message}`);
  }
};
