import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wgbfatijshusdkgpdvul.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndnYmZhdGlqc2h1c2RrZ3BkdnVsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODY0Njc4MSwiZXhwIjoyMDk0MjIyNzgxfQ.AKH2eiLQxoMyM-y8ki-_DVMq5SWklevesoR30LKyufU';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function confirmUsers() {
  console.log('Mencari pengguna yang belum dikonfirmasi...');
  
  try {
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) throw listError;

    if (!users || users.length === 0) {
      console.log('Tidak ada pengguna ditemukan.');
      return;
    }

    for (const user of users) {
      if (!user.email_confirmed_at) {
        console.log(`Mengonfirmasi akun: ${user.email}...`);
        const { error: updateError } = await supabase.auth.admin.updateUserById(
          user.id,
          { email_confirm: true }
        );
        
        if (updateError) {
          console.error(`Gagal mengonfirmasi ${user.email}:`, updateError.message);
        } else {
          console.log(`BERHASIL: Akun ${user.email} sekarang sudah aktif!`);
        }
      } else {
        console.log(`Akun ${user.email} sudah aktif sebelumnya.`);
      }
    }
  } catch (err) {
    console.error('Error saat konfirmasi manual:', err.message);
  }
}

confirmUsers();
