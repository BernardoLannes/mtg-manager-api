export interface ScryfallCardData {
  id: string;
  name: string;
  manaCost: string;
  cmc: number;
  typeLine: string;
  oracleText?: string;
  colors: string[];
  rarity: string;
  set: string;
  power?: string;
  toughness?: string;
  imageUrl?: string;
  scryfallUri: string;
}

export interface IScryfallGateway {
  searchCardByName(name: string): Promise<ScryfallCardData>;
}
