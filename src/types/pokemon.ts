export interface PokemonCard {
  set: string;
  number: number;
  rarity: string;
  rarityCode: string;
  imageName: string;
  imageUrl?: string;
  label: {
    slug: string;
    eng: string;
  };
  packs: string[];
}

export interface PokemonSet {
  code: string;
  releaseDate: string;
  count?: number;
  label: {
    en: string;
  };
  packs: string[];
}

export interface RarityMap {
  [key: string]: string;
}

export interface WishlistItem {
  card: PokemonCard;
  dateAdded: string;
}

export interface FilterOptions {
  search: string;
  set: string;
  rarity: string;
  pack: string;
}