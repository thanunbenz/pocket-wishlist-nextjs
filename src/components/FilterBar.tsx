'use client';

import { useCallback } from 'react';
import { Search, Filter, Heart, Trash2, Eye, ArrowLeft } from 'lucide-react';
import { FilterOptions, PokemonSet, RarityMap, PokemonCard } from '@/types/pokemon';
import { exportWishlistToExcel } from '@/lib/excel';
import { getWishlist } from '@/lib/wishlist';

interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  sets: PokemonSet[];
  rarities: RarityMap;
  filteredCards: PokemonCard[];
  allPacks: string[];
  showWishlistOnly: boolean;
  onToggleWishlistView: () => void;
  onClearWishlist: () => void;
}

export default function FilterBar({ 
  filters, 
  onFilterChange, 
  sets, 
  rarities, 
  filteredCards,
  allPacks,
  showWishlistOnly,
  onToggleWishlistView,
  onClearWishlist
}: FilterBarProps) {
  const handleExportWishlist = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const wishlist = getWishlist();
    exportWishlistToExcel(wishlist);
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex flex-col lg:flex-row gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search Pokemon cards..."
            className="text-gray-700 w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={onToggleWishlistView}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
              showWishlistOnly
                ? 'bg-gray-800 text-white hover:bg-gray-900'
                : 'bg-gray-800 text-white hover:bg-gray-900'
            }`}
          >
            {showWishlistOnly ? (
              <>
                <ArrowLeft className="w-4 h-4" />
                Back
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                See Wishlist
              </>
            )}
          </button>
          
          {showWishlistOnly && (
            <button
              onClick={onClearWishlist}
              className="flex items-center gap-2 px-3 py-2 bg-gray-800 text-white rounded-md text-sm hover:bg-gray-900 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear Wishlist
            </button>
          )}
          
          <button
            onClick={handleExportWishlist}
            className="flex items-center gap-2 px-3 py-2 bg-gray-800 text-white rounded-md text-sm hover:bg-gray-900 transition-colors"
          >
            <Heart className="w-4 h-4" />
            Export Wishlist
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs text-gray-800 mb-1">Set</label>
          <select
            className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-gray-400"
            value={filters.set}
            onChange={(e) => onFilterChange({ ...filters, set: e.target.value })}
          >
            <option value="">All Sets</option>
            {sets.map((set) => (
              <option key={set.code} value={set.code}>
                {set.label.en} ({set.code})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-800 mb-1">Rarity</label>
          <select
            className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-gray-400"
            value={filters.rarity}
            onChange={(e) => onFilterChange({ ...filters, rarity: e.target.value })}
          >
            <option value="">All Rarities</option>
            {Object.entries(rarities).map(([code, name]) => (
              <option key={code} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-800 mb-1">Pack</label>
          <select
            className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-gray-400"
            value={filters.pack}
            onChange={(e) => onFilterChange({ ...filters, pack: e.target.value })}
          >
            <option value="">All Packs</option>
            {allPacks.map((pack) => (
              <option key={pack} value={pack}>
                {pack}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={() => onFilterChange({ search: '', set: '', rarity: '', pack: '' })}
            className="text-gray-700 w-full flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Clear Filters
          </button>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        Showing {filteredCards.length} {showWishlistOnly ? 'wishlist' : ''} cards
      </div>
    </div>
  );
}