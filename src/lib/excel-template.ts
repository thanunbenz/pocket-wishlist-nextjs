import * as XLSX from 'xlsx';

export function createExcelTemplate() {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();
  
  // Sample data with headers
  const headers = ['Set', 'Number', 'Pokemon', 'Rarity', 'Rarity Code', 'Image Name', 'Packs'];
  const sampleData = [
    ['A1', 1, 'Bulbasaur', 'Common', 'C', 'bulbasaur', 'Mewtwo,Pikachu'],
    ['A1', 4, 'Charmander', 'Common', 'C', 'charmander', 'Charizard'],
    ['A1', 7, 'Squirtle', 'Common', 'C', 'squirtle', 'Mewtwo,Charizard'],
    ['A1', 25, 'Pikachu', 'Common', 'C', 'pikachu', 'Pikachu'],
  ];
  
  // Combine headers and data
  const worksheetData = [headers, ...sampleData];
  
  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  
  // Set column widths
  const columnWidths = [
    { wch: 10 }, // Set
    { wch: 10 }, // Number
    { wch: 20 }, // Pokemon
    { wch: 15 }, // Rarity
    { wch: 15 }, // Rarity Code
    { wch: 20 }, // Image Name
    { wch: 30 }, // Packs
  ];
  worksheet['!cols'] = columnWidths;
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Wishlist');
  
  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
  // Create blob and download
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'pokemon-wishlist-template.xlsx';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}