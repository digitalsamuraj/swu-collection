export interface Card {
  id: string;
  name: string;
  set: string;
  number: string;
  rarity: string;
  type: string;
  cost?: number;
  power?: number;
  health?: number;
  imageUrl?: string;
  artVariants?: ArtVariant[];
}

export interface ArtVariant {
  id: string;
  number: string;
  imageUrl?: string;
  variant?: string;
}

export interface CollectionCard {
  card: Card;
  owned: number;
}

export interface Set {
  code: string;
  name: string;
  releaseDate?: string;
}

export interface ApiCardResponse {
  Set: string;
  Number: string;
  Name: string;
  Type: string;
  Aspects?: string[];
  Traits?: string[];
  Arenas?: string[];
  Cost?: string;
  Power?: string;
  HP?: string;
  FrontText?: string;
  DoubleSided: boolean;
  Rarity: string;
  Unique: boolean;
  Artist?: string;
  VariantType?: string;
  MarketPrice?: string;
  FoilPrice?: string;
  FrontArt?: string;
  LowFoilPrice?: string;
  LowPrice?: string;
}
