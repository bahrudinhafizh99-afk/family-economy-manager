import { 
  Utensils, 
  Car, 
  Home, 
  ShoppingBag, 
  Smartphone, 
  Film, 
  HeartPulse, 
  GraduationCap, 
  Briefcase, 
  Gift, 
  Coffee,
  Zap,
  CreditCard,
  TrendingUp,
  Sparkles
} from 'lucide-react';

export const getCategoryIcon = (category: string, size = 20) => {
  const c = category.toLowerCase();
  
  if (c.includes('makan') || c.includes('food') || c.includes('restoran')) return <Utensils size={size} />;
  if (c.includes('transport') || c.includes('bensin') || c.includes('parkir') || c.includes('ojek')) return <Car size={size} />;
  if (c.includes('rumah') || c.includes('kos') || c.includes('sewa')) return <Home size={size} />;
  if (c.includes('belanja') || c.includes('shopping') || c.includes('mall')) return <ShoppingBag size={size} />;
  if (c.includes('pulsa') || c.includes('internet') || c.includes('data')) return <Smartphone size={size} />;
  if (c.includes('hiburan') || c.includes('film') || c.includes('bioskop') || c.includes('game')) return <Film size={size} />;
  if (c.includes('kesehatan') || c.includes('obat') || c.includes('dokter') || c.includes('rs')) return <HeartPulse size={size} />;
  if (c.includes('pendidikan') || c.includes('sekolah') || c.includes('kursus') || c.includes('buku')) return <GraduationCap size={size} />;
  if (c.includes('tagihan') || c.includes('listrik') || c.includes('air') || c.includes('pajak')) return <Zap size={size} />;
  if (c.includes('kopi') || c.includes('kafe') || c.includes('nongkrong')) return <Coffee size={size} />;
  if (c.includes('gaji') || c.includes('salary') || c.includes('upah')) return <Briefcase size={size} />;
  if (c.includes('bonus') || c.includes('hadiah')) return <Gift size={size} />;
  if (c.includes('investasi') || c.includes('saham') || c.includes('crypto')) return <TrendingUp size={size} />;
  if (c.includes('cicilan') || c.includes('hutang') || c.includes('kartu kredit')) return <CreditCard size={size} />;
  
  return <Sparkles size={size} />;
};
