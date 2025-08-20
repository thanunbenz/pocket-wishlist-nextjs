import { PokemonCard, WishlistItem } from '@/types/pokemon';

const WISHLIST_KEY = 'pokemon-wishlist';

export function getWishlist(): WishlistItem[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(WISHLIST_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    
    // Validate data structure
    if (!Array.isArray(parsed)) {
      console.warn('Invalid wishlist data format, clearing localStorage');
      localStorage.removeItem(WISHLIST_KEY);
      return [];
    }
    
    // Validate each wishlist item
    const validItems = parsed.filter(item => {
      return item && 
             item.card && 
             typeof item.card.set === 'string' && 
             typeof item.card.number === 'number' && 
             typeof item.dateAdded === 'string';
    });
    
    // If we filtered out invalid items, save the cleaned data
    if (validItems.length !== parsed.length) {
      console.warn('Cleaned invalid wishlist items');
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(validItems));
    }
    
    return validItems;
  } catch (error) {
    console.error('Error reading wishlist from localStorage:', error);
    // Clear corrupted data
    try {
      localStorage.removeItem(WISHLIST_KEY);
    } catch (clearError) {
      console.error('Failed to clear corrupted wishlist data:', clearError);
    }
    return [];
  }
}

export function addToWishlist(card: PokemonCard): void {
  if (typeof window === 'undefined') return;
  
  try {
    const wishlist = getWishlist();
    const cardKey = `${card.set}-${card.number}`;
    const exists = wishlist.some(item => 
      `${item.card.set}-${item.card.number}` === cardKey
    );
    
    if (!exists) {
      const newItem: WishlistItem = {
        card,
        dateAdded: new Date().toISOString(),
      };
      wishlist.push(newItem);
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    }
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    // Try to show user-friendly error
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      alert('Storage quota exceeded. Please clear some data or use a different browser.');
    } else {
      alert('Failed to add item to wishlist. Please try again.');
    }
  }
}

export function removeFromWishlist(card: PokemonCard): void {
  if (typeof window === 'undefined') return;
  
  try {
    const wishlist = getWishlist();
    const cardKey = `${card.set}-${card.number}`;
    const filtered = wishlist.filter(item => 
      `${item.card.set}-${item.card.number}` !== cardKey
    );
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    alert('Failed to remove item from wishlist. Please try again.');
  }
}

export function isInWishlist(card: PokemonCard): boolean {
  try {
    const wishlist = getWishlist();
    const cardKey = `${card.set}-${card.number}`;
    return wishlist.some(item => 
      `${item.card.set}-${item.card.number}` === cardKey
    );
  } catch (error) {
    console.error('Error checking wishlist status:', error);
    return false;
  }
}

export function clearWishlist(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(WISHLIST_KEY);
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    alert('Failed to clear wishlist. Please try again.');
  }
}