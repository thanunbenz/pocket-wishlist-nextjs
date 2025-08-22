'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { PokemonCard, PokemonSet, RarityMap, FilterOptions } from '@/types/pokemon';
import { getAllData } from '@/lib/api';
import { getWishlist, clearWishlist } from '@/lib/wishlist';
import CardItem from '@/components/CardItem';
import FilterBar from '@/components/FilterBar';
import ExcelUpload from '@/components/ExcelUpload';
// import ErrorTestPanel from '@/components/ErrorTestPanel';

export default function Home() {
  const [cards, setCards] = useState<PokemonCard[]>([]);
  const [sets, setSets] = useState<PokemonSet[]>([]);
  const [rarities, setRarities] = useState<RarityMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);
  const [showExcelUpload, setShowExcelUpload] = useState(false);
  
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    set: '',
    rarity: '',
    pack: '',
  });

  const allPacks = useMemo(() => {
    const packs = new Set<string>();
    cards.forEach(card => {
      if (card.packs && Array.isArray(card.packs)) {
        card.packs.forEach(pack => packs.add(pack));
      }
    });
    return Array.from(packs).sort();
  }, [cards]);

  const filteredCards = useMemo(() => {
    try {
      if (showWishlistOnly) {
        const wishlist = getWishlist();
        return wishlist.map(item => item.card).filter(card => {
          if (!card) return false;
          
          try {
            const matchesSearch = !filters.search || 
              (card.label?.eng && card.label.eng.toLowerCase().includes(filters.search.toLowerCase()));
            
            const matchesSet = !filters.set || card.set === filters.set;
            
            const matchesRarity = !filters.rarity || card.rarity === filters.rarity;
            
            const matchesPack = !filters.pack || (card.packs && Array.isArray(card.packs) && card.packs.includes(filters.pack));
            
            return matchesSearch && matchesSet && matchesRarity && matchesPack;
          } catch (filterError) {
            console.warn('Error filtering wishlist card:', card, filterError);
            return false;
          }
        });
      }
      
      return cards.filter(card => {
        if (!card) return false;
        
        try {
          const matchesSearch = !filters.search || 
            (card.label?.eng && card.label.eng.toLowerCase().includes(filters.search.toLowerCase()));
          
          const matchesSet = !filters.set || card.set === filters.set;
          
          const matchesRarity = !filters.rarity || card.rarity === filters.rarity;
          
          const matchesPack = !filters.pack || (card.packs && Array.isArray(card.packs) && card.packs.includes(filters.pack));
          
          return matchesSearch && matchesSet && matchesRarity && matchesPack;
        } catch (filterError) {
          console.warn('Error filtering card:', card, filterError);
          return false;
        }
      });
    } catch (error) {
      console.error('Error in filteredCards calculation:', error);
      return [];
    }
  }, [cards, filters, showWishlistOnly]);

  const updateWishlistCount = useCallback(() => {
    if (typeof window !== 'undefined') {
      setWishlistCount(getWishlist().length);
    }
  }, []);

  const handleClearWishlist = useCallback(() => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      clearWishlist();
      updateWishlistCount();
      // Force re-render of all cards to update wishlist status
      setCards(prevCards => [...prevCards]);
    }
  }, [updateWishlistCount]);

  const toggleWishlistView = useCallback(() => {
    setShowWishlistOnly(!showWishlistOnly);
  }, [showWishlistOnly]);

  const handleTestError = useCallback((errorType: string) => {
    console.log(`Testing ${errorType} error scenario`);
    // Force a re-render to see the effects
    updateWishlistCount();
  }, [updateWishlistCount]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await getAllData();
        setCards(data.cards);
        setSets(data.sets);
        setRarities(data.rarities);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
    updateWishlistCount();
  }, [updateWishlistCount]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading cards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-2">Error loading data</p>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <header className="mb-6">
          <h1 className="text-2xl font-medium text-gray-900 mb-2">
            {showWishlistOnly ? 'Wishlist' : 'Pokemon TCG Pocket'}
          </h1>
          {wishlistCount > 0 && (
            <p className="text-sm text-gray-500">
              {wishlistCount} cards in wishlist
            </p>
          )}
        </header>

        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
          sets={sets}
          rarities={rarities}
          filteredCards={filteredCards}
          allPacks={allPacks}
          showWishlistOnly={showWishlistOnly}
          onToggleWishlistView={toggleWishlistView}
          onClearWishlist={handleClearWishlist}
          onImportClick={() => setShowExcelUpload(true)}
        />

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredCards.map((card, index) => (
            <CardItem
              key={`${card.set}-${card.number}-${card.label?.eng || 'unknown'}-${index}`}
              card={card}
              onWishlistChange={updateWishlistCount}
            />
          ))}
        </div>

        {filteredCards.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-2">No cards found</p>
            <p className="text-gray-400 text-sm">Try adjusting your filters</p>
          </div>
        )}
      </div>
      
      {/* Error Testing Panel - Only show in development */}
      {/* <ErrorTestPanel onTestError={handleTestError} /> */}
      
      {showExcelUpload && (
        <ExcelUpload
          onClose={() => setShowExcelUpload(false)}
          onUploadComplete={() => {
            updateWishlistCount();
            // Force re-render to show updated wishlist
            setCards(prevCards => [...prevCards]);
          }}
        />
      )}
    </div>
  );
}
