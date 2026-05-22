import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wgbfatijshusdkgpdvul.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndnYmZhdGlqc2h1c2RrZ3BkdnVsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODY0Njc4MSwiZXhwIjoyMDk0MjIyNzgxfQ.AKH2eiLQxoMyM-y8ki-_DVMq5SWklevesoR30LKyufU';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const sql = `
-- 1. BERSIHKAN TOTAL SEMUA TABEL LAMA
DROP TABLE IF EXISTS transactions, budgets, goals, debts, recurring_transactions, profiles CASCADE;

-- 2. TABEL PROFIL
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  settings JSONB DEFAULT '{"language": "id", "currency": "IDR", "theme": "soft"}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. TABEL TRANSAKSI
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  amount DECIMAL NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. TABEL ANGGARAN
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  "limit" DECIMAL NOT NULL,
  UNIQUE(user_id, category)
);

-- 5. TABEL TABUNGAN
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  target_amount DECIMAL NOT NULL,
  current_amount DECIMAL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. TABEL HUTANG
CREATE TABLE debts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  type TEXT CHECK (type IN ('to_pay', 'to_receive')) NOT NULL,
  due_date TEXT,
  status TEXT CHECK (status IN ('active', 'paid')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 7. TABEL TRANSAKSI RUTIN
CREATE TABLE recurring_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  category TEXT NOT NULL,
  type TEXT NOT NULL,
  frequency TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  lastprocessed TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- AKTIFKAN KEAMANAN (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE debts ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_transactions ENABLE ROW LEVEL SECURITY;

-- ATURAN AKSES DATA
CREATE POLICY "view_own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "update_own" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "manage_transactions" ON transactions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "manage_budgets" ON budgets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "manage_goals" ON goals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "manage_debts" ON debts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "manage_recurring" ON recurring_transactions FOR ALL USING (auth.uid() = user_id);

-- OTOMATISASI PEMBUATAN PROFIL
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if trigger exists and create
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;
`;

async function runSetup() {
  console.log('Memulai eksekusi SQL langsung ke Supabase...');
  
  // Note: supabase.rpc() or other standard methods don't support running raw arbitrary SQL string easily 
  // via the client unless we have a specific function.
  // Instead, we will use the POST request to the REST API if available or use a small hack.
  // BUT the best way for Service Role is actually to use the SQL API if enabled, 
  // but usually it's not exposed via standard JS client for security.
  
  // Since I cannot run raw SQL string directly through @supabase-js without an RPC function,
  // I will inform the user to do the SQL Editor one last time with the "Anti-Gagal" script 
  // OR I can try to create the tables one by one using the client if possible.
  
  // However, I can't create tables via standard Supabase JS client. 
  // It only handles DATA, not SCHEMA.
  
  console.log('INFO: Supabase JS Client hanya bisa mengelola DATA, bukan STRUKTUR TABEL (Schema).');
  console.log('Saya akan memberikan kode SQL terakhir yang sudah saya optimasi 100% untuk Anda jalankan.');
}

runSetup();
