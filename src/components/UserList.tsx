'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { UserMinus, UserPlus, ExternalLink } from 'lucide-react';

interface UserListProps {
    users: any[];
    activeTab: 'unfollowers' | 'fans' | 'mutuals';
    onAction: (userId: string, action: 'follow' | 'unfollow') => void;
}

export default function UserList({ users, activeTab, onAction }: UserListProps) {
    if (users.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                <p className="text-lg font-medium">Bu kategoride kimse bulunamadı.</p>
                <p className="mt-1 text-sm">Her şey yolunda görünüyor!</p>
            </div>
        );
    }

    return (
        <div className="divide-y divide-zinc-800/50">
            <AnimatePresence mode="popLayout">
                {users.map((user, index) => (
                    <motion.div
                        key={user.pk}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: index * 0.03 }}
                        className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-white/[0.02]"
                    >
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <img
                                    src={user.profile_pic_url}
                                    alt={user.username}
                                    className="h-12 w-12 rounded-full border border-zinc-700 object-cover"
                                />
                                <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#050505] ${activeTab === 'unfollowers' ? 'bg-red-500' : 'bg-green-500'
                                    }`} />
                            </div>
                            <div>
                                <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-white tracking-tight">{user.username}</span>
                                    {user.is_verified && (
                                        <div className="flex h-3 w-3 items-center justify-center rounded-full bg-blue-500 p-0.5">
                                            <div className="h-1 w-1 bg-white" />
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm text-zinc-500">{user.full_name || 'Instagram Kullanıcısı'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <a
                                href={`https://instagram.com/${user.username}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-zinc-400 transition-all hover:bg-zinc-800 hover:text-white border border-zinc-800"
                            >
                                <ExternalLink className="h-4 w-4" />
                            </a>

                            {activeTab === 'unfollowers' && (
                                <button
                                    onClick={() => onAction(user.pk, 'unfollow')}
                                    className="flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-500 transition-all hover:bg-red-500 hover:text-white"
                                >
                                    <UserMinus className="h-4 w-4" />
                                    Takibi Bırak
                                </button>
                            )}

                            {activeTab === 'fans' && (
                                <button
                                    onClick={() => onAction(user.pk, 'follow')}
                                    className="flex items-center gap-2 rounded-xl bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-500 transition-all hover:bg-green-500 hover:text-white"
                                >
                                    <UserPlus className="h-4 w-4" />
                                    Geri Takip Et
                                </button>
                            )}

                            {activeTab === 'mutuals' && (
                                <button
                                    onClick={() => onAction(user.pk, 'unfollow')}
                                    className="flex items-center gap-2 rounded-xl bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-400 transition-all hover:bg-red-500 hover:text-white"
                                >
                                    <UserMinus className="h-4 w-4" />
                                    Takibi Bırak
                                </button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
