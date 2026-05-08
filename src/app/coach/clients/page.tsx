'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';

interface ClientLink {
  _id: string;
  startedAt?: string;
  clientId: {
    _id: string;
    name: string;
    email: string;
    goal?: string;
    experienceLevel?: string;
    bmi?: number;
  };
}

export default function CoachClientsPage() {
  const [items, setItems] = useState<ClientLink[] | null>(null);

  useEffect(() => {
    fetch('/api/coach/clients')
      .then((r) => r.json())
      .then((d) => setItems(d.items));
  }, []);

  if (!items) return <p className="text-muted-foreground">Loading…</p>;
  if (items.length === 0)
    return (
      <Card>
        <p className="text-muted-foreground">No active clients yet.</p>
      </Card>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((link) => (
        <Link key={link._id} href={`/coach/clients/${link.clientId._id}`}>
          <Card hover className="cursor-pointer">
            <h3 className="font-semibold text-lg">{link.clientId.name}</h3>
            <p className="text-sm text-muted-foreground mb-2">{link.clientId.email}</p>
            <div className="text-sm space-y-1">
              {link.clientId.goal && (
                <p>
                  <span className="text-muted-foreground">Goal:</span>{' '}
                  {link.clientId.goal.replace('_', ' ')}
                </p>
              )}
              {link.clientId.experienceLevel && (
                <p>
                  <span className="text-muted-foreground">Level:</span>{' '}
                  {link.clientId.experienceLevel}
                </p>
              )}
              {link.clientId.bmi !== undefined && (
                <p>
                  <span className="text-muted-foreground">BMI:</span>{' '}
                  {link.clientId.bmi.toFixed(1)}
                </p>
              )}
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
