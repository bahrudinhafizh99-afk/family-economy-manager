/**
 * AI Utility for Family Economy Manager
 * Simple keyword-based classification engine
 */

export const suggestCategory = (description: string, categories: string[]): string | null => {
  const desc = description.toLowerCase();
  
  // 1. Core Rule Mapping
  const mappings: Record<string, string[]> = {
    'Makan': ['makan', 'minum', 'resto', 'cafe', 'warung', 'food', 'kopi', 'coffee', 'mcd', 'kfc', 'bakso', 'nasi', 'gojek', 'grabfood', 'shopeefood'],
    'Transportasi': ['bensin', 'pertamina', 'shell', 'parkir', 'ojek', 'taxi', 'grab', 'gojek', 'kereta', 'bus', 'tol', 'servis', 'oli'],
    'Tagihan': ['listrik', 'pln', 'air', 'pdam', 'wifi', 'internet', 'indihome', 'pulsa', 'kuota', 'netflix', 'spotify', 'youtube', 'asuransi', 'bpjs'],
    'Belanja': ['indomaret', 'alfamart', 'supermarket', 'mall', 'shopee', 'tokopedia', 'baju', 'kaos', 'sabun', 'shampoo', 'skin care'],
    'Kesehatan': ['apotek', 'obat', 'dokter', 'rs', 'rumah sakit', 'vitamin', 'suplemen'],
    'Hiburan': ['nonton', 'bioskop', 'cinema', 'game', 'topup', 'liburan', 'hotel', 'tiket'],
    'Pendidikan': ['sekolah', 'spp', 'buku', 'kursus', 'kuliah'],
    'Gaji': ['gaji', 'bonus', 'insentif', 'transfer', 'payroll']
  };

  // 2. Direct Match Search
  for (const [category, keywords] of Object.entries(mappings)) {
    if (keywords.some(k => desc.includes(k))) {
      // Find the closest matching category in the user's actual list
      const actualCategory = categories.find(c => c.toLowerCase() === category.toLowerCase());
      if (actualCategory) return actualCategory;
    }
  }

  // 3. Fallback: Word by word check for dynamic categories
  const words = desc.split(' ');
  for (const word of words) {
    if (word.length < 3) continue;
    const match = categories.find(c => c.toLowerCase().includes(word) || word.includes(c.toLowerCase()));
    if (match) return match;
  }

  return null;
};
