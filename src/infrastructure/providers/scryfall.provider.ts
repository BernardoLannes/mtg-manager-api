import { ExternalApiError, ScryfallCardNotFoundError } from '@domain/errors/domain.error';
import { IScryfallGateway, ScryfallCardData } from '@domain/gateways/scryfall.gateway.interface';

interface ScryfallApiResponse {
  id: string;
  name: string;
  mana_cost?: string;
  cmc?: number;
  type_line?: string;
  oracle_text?: string;
  colors?: string[];
  rarity: string;
  set: string;
  power?: string;
  toughness?: string;
  image_uris?: {
    normal?: string;
    large?: string;
    png?: string;
  };
  card_faces?: Array<{
    image_uris?: {
      normal?: string;
    };
  }>;
  scryfall_uri: string;
}

export class ScryfallProvider implements IScryfallGateway {
  private readonly baseUrl: string;

  constructor(baseUrl = process.env.SCRYFALL_API_URL || 'https://api.scryfall.com') {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  public async searchCardByName(name: string): Promise<ScryfallCardData> {
    const encodedName = encodeURIComponent(name.trim());
    const endpoint = `${this.baseUrl}/cards/named?fuzzy=${encodedName}`;

    let response: Response;
    try {
      response = await fetch(endpoint, {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'MTGManagerAPI/1.0.0',
        },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new ExternalApiError('Scryfall', `Network request failed: ${msg}`);
    }

    if (response.status === 404) {
      throw new ScryfallCardNotFoundError(name);
    }

    if (!response.ok) {
      throw new ExternalApiError(
        'Scryfall',
        `Scryfall API returned status ${response.status} (${response.statusText})`,
      );
    }

    const data = (await response.json()) as ScryfallApiResponse;

    const imageUrl =
      data.image_uris?.normal ||
      data.image_uris?.large ||
      data.card_faces?.[0]?.image_uris?.normal ||
      undefined;

    return {
      id: data.id,
      name: data.name,
      manaCost: data.mana_cost ?? '',
      cmc: data.cmc ?? 0,
      typeLine: data.type_line ?? '',
      oracleText: data.oracle_text,
      colors: data.colors ?? [],
      rarity: data.rarity,
      set: data.set.toUpperCase(),
      power: data.power,
      toughness: data.toughness,
      imageUrl,
      scryfallUri: data.scryfall_uri,
    };
  }
}
