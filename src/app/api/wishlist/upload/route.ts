import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { PokemonCard } from '@/types/pokemon';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Check file type
    if (!file.name.match(/\.(xlsx|xls)$/)) {
      return NextResponse.json(
        { error: 'Please upload an Excel file (.xlsx or .xls)' },
        { status: 400 }
      );
    }

    // Read file
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    
    // Get first worksheet
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // Parse and validate data
    const wishlistItems: PokemonCard[] = [];
    const errors: string[] = [];

    jsonData.forEach((row: unknown, index: number) => {
      const rowNum = index + 2; // Excel row number (1-indexed + header row)
      const data = row as Record<string, unknown>;
      
      // Required fields
      if (!data['Set'] || !data['Number']) {
        errors.push(`Row ${rowNum}: Missing required fields (Set and Number)`);
        return;
      }

      try {
        const card: PokemonCard = {
          set: String(data['Set']).trim(),
          number: parseInt(String(data['Number']), 10),
          rarity: String(data['Rarity'] || ''),
          rarityCode: String(data['Rarity Code'] || data['RarityCode'] || ''),
          imageName: String(data['Image Name'] || data['ImageName'] || ''),
          imageUrl: String(data['Image URL'] || data['ImageURL'] || ''),
          label: {
            slug: String(data['Pokemon'] || data['Name'] || ''),
            eng: String(data['Pokemon'] || data['Name'] || '')
          },
          packs: data['Packs'] ? String(data['Packs']).split(',').map(p => p.trim()) : []
        };

        // Validate number
        if (isNaN(card.number)) {
          errors.push(`Row ${rowNum}: Invalid card number`);
          return;
        }

        wishlistItems.push(card);
      } catch {
        errors.push(`Row ${rowNum}: Failed to parse data`);
      }
    });

    if (errors.length > 0) {
      return NextResponse.json(
        { 
          error: 'Some rows contain errors',
          details: errors,
          validItems: wishlistItems.length
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      items: wishlistItems,
      count: wishlistItems.length
    });
  } catch (error) {
    console.error('Error processing Excel file:', error);
    return NextResponse.json(
      { error: 'Failed to process Excel file' },
      { status: 500 }
    );
  }
}