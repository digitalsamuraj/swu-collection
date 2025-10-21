import axios from "axios";
import { ApiCardResponse, Card, Set } from "@/types/card";

type CardsApiResponse = ApiCardResponse[] | { data: ApiCardResponse[] };

const isWrappedResponse = (
  payload: CardsApiResponse
): payload is { data: ApiCardResponse[] } => {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "data" in payload &&
    Array.isArray((payload as { data?: unknown }).data)
  );
};

export class SWUApiService {
  private static instance: SWUApiService;

  private constructor() {}

  static getInstance(): SWUApiService {
    if (!SWUApiService.instance) {
      SWUApiService.instance = new SWUApiService();
    }
    return SWUApiService.instance;
  }

  async getCardsBySet(setCode: string): Promise<Card[]> {
    try {
      const response = await axios.get<CardsApiResponse>(
        `/api/cards/${setCode}`
      );

      const rawData = response.data;
      const cardsData: ApiCardResponse[] = Array.isArray(rawData)
        ? rawData
        : isWrappedResponse(rawData)
          ? rawData.data
          : (() => {
              console.error("Unexpected API response structure:", response.data);
              throw new Error("Unexpected API response structure");
            })();

      return this.transformApiResponse(cardsData);
    } catch (error) {
      console.error("Error fetching cards:", error);
      throw new Error(`Failed to fetch cards for set ${setCode}`);
    }
  }

  async getCard(setCode: string, cardNumber: string): Promise<Card> {
    try {
      const response = await axios.get<ApiCardResponse>(
        `/api/cards/${setCode}/${cardNumber}`
      );
      return this.transformApiResponse([response.data])[0];
    } catch (error) {
      console.error("Error fetching card:", error);
      throw new Error(`Failed to fetch card ${setCode}/${cardNumber}`);
    }
  }

  async getSets(): Promise<Set[]> {
    // For now, we'll return a hardcoded list of known sets
    // In the future, this could be fetched from an API endpoint
    return [
      { code: "sor", name: "Spark of Rebellion" },
      { code: "sor2", name: "Spark of Rebellion 2" },
      // Add more sets as they become available
    ];
  }

  private transformApiResponse(apiCards: ApiCardResponse[]): Card[] {
    return apiCards.map((apiCard) => ({
      id: `${apiCard.Set}-${apiCard.Number}-${apiCard.VariantType || "Normal"}`,
      name: apiCard.Name,
      set: apiCard.Set,
      number: apiCard.Number,
      rarity: apiCard.Rarity,
      type: apiCard.Type,
      cost: apiCard.Cost ? parseInt(apiCard.Cost) : undefined,
      power: apiCard.Power ? parseInt(apiCard.Power) : undefined,
      health: apiCard.HP ? parseInt(apiCard.HP) : undefined,
      imageUrl: apiCard.FrontArt,
      artVariants: [], // Will be populated when we group cards
    }));
  }
}

export const swuApi = SWUApiService.getInstance();
