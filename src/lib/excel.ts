import * as XLSX from 'xlsx';
import { PokemonCard, WishlistItem } from '@/types/pokemon';

export function exportCardsToExcel(cards: PokemonCard[], filename: string = 'pokemon-cards.xlsx') {
  try {
    if (!cards || cards.length === 0) {
      alert('No cards to export!');
      return;
    }

    // Validate input data
    const validCards = cards.filter(card => card && card.label?.eng);
    if (validCards.length === 0) {
      alert('No valid card data found to export!');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      validCards.map(card => ({
        'Set': card.set || '',
        'Number': card.number || 0,
        'Name': card.label?.eng || 'Unknown',
        'Rarity': card.rarity || '',
        'Rarity Code': card.rarityCode || '',
        'Packs': card.packs?.join(', ') || '',
        'Image': card.imageName || '',
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Cards');
    
    XLSX.writeFile(workbook, filename);
    
    // Show success message
    console.log(`Successfully exported ${validCards.length} cards to ${filename}`);
  } catch (error) {
    console.error('Error exporting cards to Excel:', error);
    alert('Failed to export cards to Excel. Please try again or check your browser settings.');
  }
}

export function exportWishlistToExcel(wishlist: WishlistItem[], filename: string = 'wishlist.xlsx') {
  try {
    if (!wishlist || wishlist.length === 0) {
      alert('Your wishlist is empty!');
      return;
    }

    // Validate wishlist items
    const validItems = wishlist.filter(item => item?.card?.label?.eng);
    if (validItems.length === 0) {
      alert('No valid wishlist items found to export!');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      validItems.map(item => ({
        'Set': item.card?.set || '',
        'Number': item.card?.number || 0,
        'Name': item.card?.label?.eng || 'Unknown',
        'Rarity': item.card?.rarity || '',
        'Rarity Code': item.card?.rarityCode || '',
        'Packs': item.card?.packs?.join(', ') || '',
        'Date Added': item.dateAdded ? new Date(item.dateAdded).toLocaleDateString() : '',
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Wishlist');
    
    XLSX.writeFile(workbook, filename);
    
    // Show success message
    console.log(`Successfully exported ${validItems.length} wishlist items to ${filename}`);
  } catch (error) {
    console.error('Error exporting wishlist to Excel:', error);
    alert('Failed to export wishlist to Excel. Please try again or check your browser settings.');
  }
}