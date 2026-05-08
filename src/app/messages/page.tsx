'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { MessagesView } from '@/components/messages/MessagesView';

export default function MessagesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/login?from=/messages');
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
        <p className="text-sm text-muted-foreground">
          Talk with your coach.
        </p>
      </div>
      <MessagesView
        emptyTitle="No coach yet"
        emptyCopy="Once a coach accepts your request, you can chat here."
      />
    </div>
  );
}
