import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Card, Button } from '../ui/Base';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const AuthView: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { settings } = useAppStore();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              settings: settings // Initial settings
            }
          }
        });
        if (error) throw error;
        alert(settings.language === 'id' ? 'Cek email Anda untuk konfirmasi pendaftaran!' : 'Check your email for confirmation!');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '80vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px'
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: '400px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: '20px', 
            backgroundColor: 'var(--primary-color)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 20px rgba(255, 180, 153, 0.3)'
          }}>
            <ShieldCheck size={32} color="white" />
          </div>
          <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800 }}>
            {isLogin 
              ? (settings.language === 'id' ? 'Selamat Datang' : 'Welcome Back') 
              : (settings.language === 'id' ? 'Buat Akun Baru' : 'Create Account')}
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '0.9rem' }}>
            {isLogin 
              ? (settings.language === 'id' ? 'Masuk untuk sinkronisasi data keluarga Anda' : 'Sign in to sync your family data') 
              : (settings.language === 'id' ? 'Mulai kelola keuangan keluarga dengan aman' : 'Start managing family finance securely')}
          </p>
        </div>

        <Card>
          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
              <input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '14px 14px 14px 44px', borderRadius: '14px', border: '2px solid #F0F0F0', outline: 'none', fontSize: '1rem' }}
                required
              />
            </div>
            
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '14px 14px 14px 44px', borderRadius: '14px', border: '2px solid #F0F0F0', outline: 'none', fontSize: '1rem' }}
                required
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  style={{ color: '#D32F2F', fontSize: '0.85rem', fontWeight: 600, textAlign: 'center' }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <Button 
              type="submit" 
              disabled={loading}
              fullWidth 
              style={{ padding: '14px', borderRadius: '14px', fontWeight: 800, marginTop: '8px' }}
            >
              {loading ? '...' : (isLogin ? (settings.language === 'id' ? 'Masuk' : 'Login') : (settings.language === 'id' ? 'Daftar' : 'Sign Up'))}
              {!loading && <ArrowRight size={18} style={{ marginLeft: '8px' }} />}
            </Button>
          </form>

          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>
              {isLogin 
                ? (settings.language === 'id' ? 'Belum punya akun?' : "Don't have an account?") 
                : (settings.language === 'id' ? 'Sudah punya akun?' : 'Already have an account?')}
            </span>
            <button 
              onClick={() => setIsLogin(!isLogin)}
              style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: 800, marginLeft: '6px', cursor: 'pointer', padding: 0 }}
            >
              {isLogin 
                ? (settings.language === 'id' ? 'Daftar Sekarang' : 'Register Now') 
                : (settings.language === 'id' ? 'Masuk di sini' : 'Login here')}
            </button>
          </div>
        </Card>

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button 
            onClick={() => window.location.reload()} // Just a way to "skip" for now or use guest mode
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
          >
            {settings.language === 'id' ? 'Lanjutkan sebagai Tamu (Hanya Lokal)' : 'Continue as Guest (Local Only)'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
