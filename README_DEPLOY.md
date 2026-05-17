# Panduan Deployment: Family Economy Manager

Aplikasi ini siap di-deploy ke **Vercel** agar bisa diakses langsung melalui browser HP Anda tanpa kendala teknis Termux.

## Opsi 1: Menggunakan GitHub (Sangat Direkomendasikan)
Ini adalah cara termudah dan gratis.
1. Buat repositori baru di GitHub Anda (misal: `family-economy-manager`).
2. Upload/Push folder `family-economy-manager` ke repositori tersebut.
3. Buka [vercel.com](https://vercel.com), login dengan GitHub.
4. Klik **"Add New"** > **"Project"**.
5. Impor repositori yang baru Anda buat.
6. Klik **"Deploy"**. Selesai!

## Opsi 2: Menggunakan Vercel CLI di Termux
Jika Anda ingin mencoba langsung dari Termux (membutuhkan akun Vercel):
1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```
2. Login ke Vercel:
   ```bash
   vercel login
   ```
3. Lakukan Deployment:
   ```bash
   cd family-economy-manager
   vercel --prod
   ```

## Informasi Penting
- **URL**: Setelah deploy, Anda akan mendapatkan URL seperti `family-economy-manager.vercel.app`.
- **Data**: Data yang Anda masukkan akan tersimpan di browser perangkat yang Anda gunakan (LocalStorage). Jika ingin sinkron antar HP, kita perlu menghubungkan Supabase di tahap berikutnya.
- **Update**: Setiap kali Anda melakukan perubahan kode dan push ke GitHub, Vercel akan memperbarui aplikasinya secara otomatis.

---
*Dibuat oleh Gemini CLI pada 2026-05-17*
