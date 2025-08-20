import { PokemonCard, PokemonSet, RarityMap } from '@/types/pokemon';

const API_BASE = 'https://raw.githubusercontent.com/flibustier/pokemon-tcg-pocket-database/main/dist';

// Test mode flag - set to true to simulate various errors
const TEST_ERRORS = false;

export async function fetchCards(): Promise<PokemonCard[]> {
  if (TEST_ERRORS) {
    throw new Error('Simulated API error - Network connection failed');
  }
  try {
    const response = await fetch(`${API_BASE}/cards.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch cards: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    
    // Validate data structure
    if (!Array.isArray(data)) {
      throw new Error('Invalid cards data: Expected array');
    }
    
    // Validate each card has required fields
    const validatedCards = data.filter(card => {
      return card && 
             typeof card.set === 'string' && 
             typeof card.number === 'number' && 
             card.label && 
             typeof card.label.eng === 'string';
    });
    
    if (validatedCards.length === 0) {
      throw new Error('No valid cards found in data');
    }
    
    return validatedCards;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Invalid JSON data received from cards API');
    }
    throw error;
  }
}

export async function fetchSets(): Promise<PokemonSet[]> {
  if (TEST_ERRORS) {
    throw new Error('Simulated API error - Sets endpoint unavailable');
  }
  const response = await fetch(`${API_BASE}/sets.json`);
  if (!response.ok) {
    throw new Error(`Failed to fetch sets: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function fetchRarities(): Promise<RarityMap> {
  if (TEST_ERRORS) {
    throw new Error('Simulated API error - Rarities endpoint timeout');
  }
  const response = await fetch(`${API_BASE}/rarity.json`);
  if (!response.ok) {
    throw new Error(`Failed to fetch rarities: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function getAllData() {
  try {
    const [cards, sets, rarities] = await Promise.all([
      fetchCards(),
      fetchSets(),
      fetchRarities(),
    ]);
    
    return {
      cards,
      sets,
      rarities,
    };
  } catch (error) {
    console.error('Error fetching Pokemon data:', error);
    throw error;
  }
}