'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Heart } from 'lucide-react';
import { PokemonCard } from '@/types/pokemon';
import { addToWishlist, removeFromWishlist, isInWishlist } from '@/lib/wishlist';

interface CardItemProps {
  card: PokemonCard;
  onWishlistChange: () => void;
}

export default function CardItem({ card, onWishlistChange }: CardItemProps) {
  const [inWishlist, setInWishlist] = useState(false);
  
  useEffect(() => {
    setInWishlist(isInWishlist(card));
  }, [card]);

  const pokemonInitial = useMemo(() => {
    return (card.label?.eng || '?').charAt(0).toUpperCase();
  }, [card.label?.eng]);

  const toggleWishlist = useCallback(() => {
    if (inWishlist) {
      removeFromWishlist(card);
    } else {
      addToWishlist(card);
    }
    setInWishlist(!inWishlist);
    onWishlistChange();
  }, [inWishlist, card, onWishlistChange]);

  const rarityColorMap = useMemo(() => ({
    'common': 'text-gray-600 bg-gray-100',
    'uncommon': 'text-green-700 bg-green-100',
    'rare': 'text-blue-700 bg-blue-100',
    'double rare': 'text-purple-700 bg-purple-100',
    'art rare': 'text-pink-700 bg-pink-100',
    'super rare': 'text-yellow-800 bg-yellow-200',
    'special art rare': 'text-pink-900 bg-pink-200',
    'immersive rare': 'text-orange-800 bg-orange-200',
    'crown rare': 'text-amber-900 bg-amber-200',
    'shiny': 'text-teal-800 bg-teal-200',
    'shiny super rare': 'text-indigo-900 bg-gradient-to-r from-purple-200 via-pink-200 to-yellow-200',
  }), []);

  const rarityColor = useMemo(() => {
    const rarity = card.rarity?.toLowerCase() || '';
    return rarityColorMap[rarity as keyof typeof rarityColorMap] || 'text-gray-600 bg-gray-100';
  }, [card.rarity, rarityColorMap]);


  const packColorMap = useMemo(() => ({
    'mewtwo': 'bg-purple-200 text-gray-700',
    'charizard': 'bg-orange-200 text-gray-700',
    'pikachu': 'bg-yellow-300 text-gray-700',
    'mew': 'bg-pink-200 text-gray-700',
    'eevee': 'bg-amber-100 text-gray-700',
    'dialga': 'bg-sky-200 text-gray-700',
    'palkia': 'bg-fuchsia-200 text-gray-700',
    'arceus': 'bg-amber-200 text-gray-700',
    'lunala': 'bg-indigo-200 text-gray-700',
    'solgaleo': 'bg-orange-300 text-gray-700',
    'ho-oh': 'bg-red-300 text-gray-700',
    'lugia': 'bg-blue-300 text-gray-700',
    'shining': 'bg-yellow-300 text-gray-700',
    'extradimensional': 'bg-cyan-200 text-gray-700',
    'genetic apex': 'bg-violet-300 text-gray-700',
    'mythical island': 'bg-teal-200 text-gray-700',
    'island': 'bg-emerald-200 text-gray-700',
    'apex': 'bg-slate-200 text-gray-700',
    'pack 1': 'bg-gray-100 text-gray-700',
    'pack 2': 'bg-gray-100 text-gray-700',
    'pack 3': 'bg-gray-100 text-gray-700',
    'pack 4': 'bg-gray-100 text-gray-700',
    'pack 5': 'bg-gray-100 text-gray-700',
    'pack 6': 'bg-gray-100 text-gray-700',
    'vol. 1': 'bg-gray-100 text-gray-700',
    'vol. 2': 'bg-gray-100 text-gray-700',
    'vol. 3': 'bg-gray-100 text-gray-700',
    'vol. 4': 'bg-gray-200 text-gray-700',
    'vol. 5': 'bg-gray-100 text-gray-700',
    'vol. 6': 'bg-gray-100 text-gray-700',
    'vol. 7': 'bg-gray-100 text-gray-700',
    'vol. 8': 'bg-gray-200 text-gray-700',
    'promo': 'bg-gray-100 text-gray-700',
    'promo-a': 'bg-gray-100 text-gray-700',
  }), []);

  return (
    <div className="bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
      <div className="relative p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">
                {pokemonInitial}
              </span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 text-sm">
                {card.label?.eng || 'Unknown Pokemon'}
              </h3>
              <p className="text-xs text-gray-500">
                {card.set} #{card.number}
              </p>
            </div>
          </div>
          <button
            onClick={toggleWishlist}
            className="p-1 hover:bg-gray-50 rounded transition-colors"
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-gray-700 text-gray-700' : 'text-gray-400'}`} />
          </button>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={`px-2 py-1 rounded text-xs ${rarityColor}`}>
              {card.rarity || 'Unknown'}
            </span>
          </div>
          
          {card.packs && card.packs.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {card.packs.map((pack, index) => {
                const packLower = pack.toLowerCase();
                const packColor = packColorMap[packLower as keyof typeof packColorMap] || 'bg-gray-100 text-gray-700';
                return (
                  <span 
                    key={index}
                    className={`px-2 py-1 text-xs rounded ${packColor}`}
                  >
                    {pack}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}