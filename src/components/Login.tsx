'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Lock, User, Loader2, AlertCircle, Info, Key } from 'lucide-react';

interface LoginProps {
    onLoginSuccess: (data: any) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [isCheckpoint, setIsCheckpoint] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    isCheckpoint
                        ? { username, code }
                        : { username, password }
                ),
            });

            const data = await res.json();

            if (data.success) {
                onLoginSuccess(data);
            } else if (data.checkpointRequired) {
                setIsCheckpoint(true);
                setError('E-posta veya SMS ile gönderilen 6 haneli kodu giriniz.');
            } else {
                setError(data.error || 'Giriş başarısız.');
            }
        } catch (err) {
            setError('Bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-[#050505]">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card w-full max-w-md overflow-hidden rounded-3xl p-8 shadow-2xl border border-white/10"
            >
                <div className="mb-8 text-center">
                    <div className="insta-gradient mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg ring-4 ring-white/5">
                        <Instagram className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white italic">InstaManager</h1>
                    <p className="mt-2 text-zinc-400 text-sm">
                        {isCheckpoint ? 'Güvenlik Doğrulaması' : 'Takipçilerini ve Takip Ettiklerini Düzenle'}
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {!isCheckpoint ? (
                        <>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 ml-1">Kullanıcı Adı</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500 group-focus-within:text-insta-pink transition-colors" />
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        className="w-full rounded-2xl border border-white/5 bg-white/5 py-4 pl-12 pr-4 text-white outline-none ring-1 ring-white/10 transition-all focus:ring-insta-pink focus:bg-white/[0.08]"
                                        placeholder="kullanıcı_adı"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 ml-1">Şifre</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500 group-focus-within:text-insta-pink transition-colors" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full rounded-2xl border border-white/5 bg-white/5 py-4 pl-12 pr-4 text-white outline-none ring-1 ring-white/10 transition-all focus:ring-insta-pink focus:bg-white/[0.08]"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 ml-1">Onay Kodu</label>
                            <div className="relative group">
                                <Key className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-insta-pink" />
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    required
                                    maxLength={6}
                                    className="w-full rounded-2xl border border-insta-pink/30 bg-white/5 py-4 pl-12 pr-4 text-white text-center text-2xl tracking-[0.5em] font-bold outline-none ring-1 ring-insta-pink/50 transition-all focus:bg-white/[0.08]"
                                    placeholder="000000"
                                />
                            </div>
                            <p className="text-[11px] text-center text-zinc-500 mt-2">
                                Instagram üzerinden gelen 6 haneli kodu yukarıya giriniz.
                            </p>
                        </div>
                    )}

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-3 rounded-2xl p-4 border ${isCheckpoint ? 'bg-insta-pink/10 border-insta-pink/20' : 'bg-red-500/10 border-red-500/20'}`}
                        >
                            <AlertCircle className={`h-5 w-5 shrink-0 ${isCheckpoint ? 'text-insta-pink' : 'text-red-500'}`} />
                            <p className={`text-sm font-medium ${isCheckpoint ? 'text-insta-pink/90' : 'text-red-400'}`}>
                                {error}
                            </p>
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="insta-gradient w-full cursor-pointer rounded-2xl py-4 font-bold text-white shadow-[0_10px_20px_rgba(225,48,108,0.3)] transition-all hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                {isCheckpoint ? 'Onaylanıyor...' : 'Giriş Yapılıyor...'}
                            </div>
                        ) : (
                            isCheckpoint ? 'Kodu Doğrula' : 'Giriş Yap'
                        )}
                    </button>

                    {isCheckpoint && (
                        <button
                            type="button"
                            onClick={() => setIsCheckpoint(false)}
                            className="w-full text-xs font-semibold text-zinc-500 hover:text-white transition-colors py-2"
                        >
                            Geri Dön
                        </button>
                    )}
                </form>

                <div className="mt-8 flex flex-col items-center gap-4 border-t border-white/5 pt-8">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 outline-none">
                        <Info className="h-3.5 w-3.5 text-zinc-400" />
                        <span className="text-[10px] text-zinc-400 font-medium">Bilgileriniz cihazınızda güvenle işlenir.</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
