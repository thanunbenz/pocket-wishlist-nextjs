# Pokemon TCG Pocket - Card Collection & Wishlist

A modern web application built with Next.js and Tailwind CSS for exploring and collecting Pokemon TCG Pocket cards.

## Features

- **Card Browsing**: View all Pokemon TCG Pocket cards with detailed information
- **Advanced Filtering**: Filter cards by name, set, rarity, and pack
- **Wishlist**: Add cards to your personal wishlist with local storage
- **Excel Export**: Export filtered cards or wishlist to Excel files
- **Responsive Design**: Beautiful, mobile-friendly interface
- **Real-time Data**: Fetches latest card data from the Pokemon TCG Pocket database

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Browsing Cards
- Browse all available Pokemon TCG Pocket cards in a responsive grid layout
- Each card shows name, set, number, rarity, and available packs
- Cards are displayed with color-coded rarity indicators

### Filtering
- **Search**: Type Pokemon names in the search bar
- **Set**: Filter by specific card sets (A1, A2, etc.)
- **Rarity**: Filter by card rarity (Common, Rare, Super Rare, etc.)
- **Pack**: Filter by pack type (Charizard, Mewtwo, Pikachu, etc.)
- **Clear Filters**: Reset all filters with one click

### Wishlist
- Click the heart icon on any card to add/remove from wishlist
- Wishlist counter shows total saved cards
- Wishlist persists in browser local storage

### Excel Export
- **Export Filtered**: Download currently filtered cards as Excel file
- **Export Wishlist**: Download your wishlist as Excel file
- Files include all card details and metadata

## Technical Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Excel Export**: SheetJS (xlsx library)
- **Data Source**: Pokemon TCG Pocket Database API

## API Endpoints

The app fetches data from:
- Cards: `https://raw.githubusercontent.com/flibustier/pokemon-tcg-pocket-database/main/dist/cards.json`
- Sets: `https://raw.githubusercontent.com/flibustier/pokemon-tcg-pocket-database/main/dist/sets.json`
- Rarities: `https://raw.githubusercontent.com/flibustier/pokemon-tcg-pocket-database/main/dist/rarity.json`

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx           # Main page component
│   └── globals.css        # Global styles
├── components/
│   ├── CardItem.tsx       # Individual card component
│   └── FilterBar.tsx      # Filter controls component
├── lib/
│   ├── api.ts            # API fetching utilities
│   ├── excel.ts          # Excel export functions
│   └── wishlist.ts       # Wishlist management
└── types/
    └── pokemon.ts        # TypeScript interfaces
```

## License

This project is for educational purposes. Pokemon and related properties are trademarks of Nintendo, Game Freak, and Creatures Inc.
