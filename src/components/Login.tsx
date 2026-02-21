'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Lock, User, Loader2 } from 'lucide-react';

interface LoginProps {
    onLoginSuccess: (data: any) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
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
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (data.success) {
                onLoginSuccess(data);
            } else {
                setError(data.error || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card w-full max-w-md overflow-hidden rounded-3xl p-8 shadow-2xl"
            >
                <div className="mb-8 text-center">
                    <div className="insta-gradient mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg">
                        <Instagram className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">InstaManager</h1>
                    <p className="mt-2 text-zinc-400">Takipçilerini ve Takip Ettiklerini Düzenle</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Instagram Kullanıcı Adı</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 py-3 pl-10 pr-4 text-white outline-none transition-all focus:border-insta-pink focus:ring-1 focus:ring-insta-pink"
                                placeholder="kullanıcı_adı"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Şifre</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 py-3 pl-10 pr-4 text-white outline-none transition-all focus:border-insta-pink focus:ring-1 focus:ring-insta-pink"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center text-sm font-medium text-red-500"
                        >
                            {error}
                        </motion.p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="insta-gradient w-full cursor-pointer rounded-xl py-3 font-semibold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Giriş Yapılıyor...
                            </div>
                        ) : (
                            'Giriş Yap'
                        )}
                    </button>
                </form>

                <p className="mt-8 text-center text-xs text-zinc-500">
                    Bu araç resmi bir Instagram ürünü değildir. Bilgileriniz sunucumuzda saklanmaz, sadece Instagram ile iletişim kurmak için kullanılır.
                </p>
            </motion.div>
        </div>
    );
}
