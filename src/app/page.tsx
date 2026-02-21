'use client';

import { useState } from 'react';
import Login from '@/components/Login';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  const [session, setSession] = useState<{ user: any; sessionState: string } | null>(null);

  const handleLoginSuccess = (data: any) => {
    setSession({
      user: data.user,
      sessionState: data.sessionState
    });
  };

  const handleLogout = () => {
    setSession(null);
  };

  if (!session) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Dashboard
      user={session.user}
      sessionState={session.sessionState}
      onLogout={handleLogout}
    />
  );
}
