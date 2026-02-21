'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    UserMinus,
    UserPlus,
    RefreshCw,
    LogOut,
    Search,
    CheckCircle2,
    Trash2,
    CheckSquare,
    Square
} from 'lucide-react';
import UserList from '@/components/UserList';

interface DashboardProps {
    user: any;
    sessionState: string;
    onLogout: () => void;
}

export default function Dashboard({ user, sessionState, onLogout }: DashboardProps) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'unfollowers' | 'fans' | 'mutuals'>('unfollowers');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isProcessingBulk, setIsProcessingBulk] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionState, userId: user.pk }),
            });
            const result = await res.json();
            if (result.success) {
                setData(result.data);
                setSelectedIds(new Set());
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAction = async (targetUserId: string, action: 'follow' | 'unfollow') => {
        try {
            const res = await fetch('/api/action', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionState, action, targetUserId }),
            });
            const result = await res.json();
            if (result.success) {
                // Optimistic UI update or refresh
                fetchData();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleBulkAction = async () => {
        if (selectedIds.size === 0) return;

        setIsProcessingBulk(true);
        const action = activeTab === 'fans' ? 'follow' : 'unfollow';

        const idsToProcess = Array.from(selectedIds);

        // Process one by one with a small delay to avoid rate limits
        for (const id of idsToProcess) {
            await handleAction(id, action);
            // Wait 1 second between actions
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        setIsProcessingBulk(false);
        fetchData();
    };

    const toggleSelectUser = (userId: string) => {
        const next = new Set(selectedIds);
        if (next.has(userId)) {
            next.delete(userId);
        } else {
            next.add(userId);
        }
        setSelectedIds(next);
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === filteredUsers.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredUsers.map((u: any) => u.pk.toString())));
        }
    };

    const filteredUsers = data ? data[activeTab].filter((u: any) =>
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
    ) : [];

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            {/* Header */}
            <header className="sticky top-0 z-50 glass-card px-6 py-4">
                <div className="mx-auto flex max-w-6xl items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="insta-gradient flex h-10 w-10 items-center justify-center rounded-xl font-bold shadow-lg">
                            IM
                        </div>
                        <span className="text-xl font-bold tracking-tight">InstaManager</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden items-center gap-3 rounded-full bg-zinc-900/50 p-1 pl-3 pr-4 border border-zinc-800 md:flex">
                            <span className="text-sm font-medium text-zinc-300">@{user.username}</span>
                            <img src={user.profile_pic_url} alt="" className="h-8 w-8 rounded-full border border-zinc-700" />
                        </div>
                        <button
                            onClick={onLogout}
                            className="group flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900/50 text-zinc-400 transition-all hover:bg-zinc-800 hover:text-white border border-zinc-800"
                        >
                            <LogOut className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-6xl p-6 lg:p-10">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
                    <StatCard
                        title="Takipçiler"
                        value={data?.followersCount || '0'}
                        icon={<Users className="text-blue-500" />}
                    />
                    <StatCard
                        title="Takip Edilen"
                        value={data?.followingCount || '0'}
                        icon={<UserPlus className="text-green-500" />}
                    />
                    <StatCard
                        title="Geri Takip Etmeyen"
                        value={data?.unfollowers?.length || '0'}
                        icon={<UserMinus className="text-red-500" />}
                    />
                    <StatCard
                        title="Hayranlar"
                        value={data?.fans?.length || '0'}
                        icon={<CheckCircle2 className="text-purple-500" />}
                    />
                </div>

                {/* Filters & Actions */}
                <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-wrap gap-2 rounded-2xl bg-zinc-900/50 p-1.5 border border-zinc-800">
                        <TabButton
                            active={activeTab === 'unfollowers'}
                            onClick={() => setActiveTab('unfollowers')}
                            label="Takip Etmeyenler"
                            count={data?.unfollowers?.length}
                        />
                        <TabButton
                            active={activeTab === 'fans'}
                            onClick={() => setActiveTab('fans')}
                            label="Hayranlar"
                            count={data?.fans?.length}
                        />
                        <TabButton
                            active={activeTab === 'mutuals'}
                            onClick={() => setActiveTab('mutuals')}
                            label="Karşılıklı"
                            count={data?.mutuals?.length}
                        />
                    </div>

                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Ara..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 py-3 pl-12 pr-4 text-white outline-none focus:border-insta-pink transition-all"
                            />
                        </div>

                        <button
                            onClick={fetchData}
                            disabled={loading}
                            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900/50 border border-zinc-800 text-zinc-400 hover:text-white transition-all disabled:opacity-50"
                        >
                            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* Bulk Action Bar */}
                <AnimatePresence>
                    {selectedIds.size > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="mt-6 flex items-center justify-between rounded-2xl bg-insta-pink/10 border border-insta-pink/20 p-4"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-insta-pink">{selectedIds.size} kullanıcı seçildi</span>
                                <button
                                    onClick={toggleSelectAll}
                                    className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors underline"
                                >
                                    {selectedIds.size === filteredUsers.length ? 'Seçimi Kaldır' : 'Tümünü Seç'}
                                </button>
                            </div>

                            <button
                                onClick={handleBulkAction}
                                disabled={isProcessingBulk}
                                className="flex items-center gap-2 rounded-xl bg-insta-pink px-6 py-2 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
                            >
                                {isProcessingBulk ? (
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Trash2 className="h-4 w-4" />
                                )}
                                {activeTab === 'fans' ? 'Seçilenleri Takip Et' : 'Seçilenleri Bırak'}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* User List Controls */}
                <div className="mt-8 mb-4 px-4 flex items-center justify-between">
                    <button
                        onClick={toggleSelectAll}
                        className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                    >
                        {selectedIds.size === filteredUsers.length && filteredUsers.length > 0 ? (
                            <CheckSquare className="h-5 w-5 text-insta-pink" />
                        ) : (
                            <Square className="h-5 w-5" />
                        )}
                        Tümünü Seç
                    </button>
                    <p className="text-xs text-zinc-500 italic">* Toplu işlemlerde hesap güvenliği için araya gecikme eklenir.</p>
                </div>

                {/* User List */}
                <div className="rounded-3xl glass-card overflow-hidden">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 text-zinc-400">
                            <RefreshCw className="h-10 w-10 animate-spin text-insta-pink" />
                            <p className="mt-4 font-medium">Veriler yükleniyor...</p>
                            <p className="mt-1 text-sm opacity-60">Instagram'dan liste alınıyor, lütfen bekleyin.</p>
                        </div>
                    ) : (
                        <UserList
                            users={filteredUsers}
                            activeTab={activeTab}
                            selectedIds={selectedIds}
                            onSelectUser={toggleSelectUser}
                            onAction={handleAction}
                        />
                    )}
                </div>
            </main>
        </div>
    );
}

function StatCard({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="glass-card rounded-3xl p-6 transition-all hover:bg-white/[0.05]"
        >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900/50 border border-zinc-800 mb-4">
                {icon}
            </div>
            <p className="text-sm font-medium text-zinc-400">{title}</p>
            <p className="mt-1 text-3xl font-bold">{value}</p>
        </motion.div>
    );
}

function TabButton({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count?: number }) {
    return (
        <button
            onClick={onClick}
            className={`relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${active ? 'bg-zinc-800 text-white shadow-xl' : 'text-zinc-500 hover:text-zinc-300'
                }`}
        >
            {label}
            {count !== undefined && (
                <span className={`rounded-full px-2 py-0.5 text-[10px] ${active ? 'bg-insta-pink text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                    {count}
                </span>
            )}
        </button>
    );
}
