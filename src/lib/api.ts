import axios from "axios";
import { ApiCardResponse, Card, Set } from "@/types/card";

const API_BASE_URL = "https://api.swu-db.com";

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
      const response = await axios.get<any>(`/api/cards/${setCode}`);

      // The API returns an object with a 'data' property containing the array of cards
      const cardsData: ApiCardResponse[] = response.data.data || response.data;

      if (!Array.isArray(cardsData)) {
        console.error("Unexpected API response structure:", response.data);
        throw new Error("Unexpected API response structure");
      }

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
