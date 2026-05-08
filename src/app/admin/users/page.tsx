'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

type Role = 'user' | 'coach' | 'admin';

interface AdminUser {
  _id: string;
  email: string;
  name: string;
  role: Role;
  suspendedAt: string | null;
  createdAt: string;
}

interface ListResponse {
  items: AdminUser[];
  total: number;
  page: number;
  pages: number;
}

const ROLE_OPTIONS = [
  { value: '', label: 'All roles' },
  { value: 'user', label: 'User' },
  { value: 'coach', label: 'Coach' },
  { value: 'admin', label: 'Admin' },
];

export default function AdminUsersPage() {
  const { user: me } = useAuth();
  const [data, setData] = useState<ListResponse | null>(null);
  const [q, setQ] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    const params = new URLSearchParams({ page: String(page), limit: '25' });
    if (q.trim()) params.set('q', q.trim());
    if (roleFilter) params.set('role', roleFilter);
    const res = await fetch(`/api/admin/users?${params}`);
    if (!res.ok) {
      setError(`Failed to load (${res.status})`);
      return;
    }
    setData(await res.json());
  }, [q, roleFilter, page]);

  useEffect(() => {
    load();
  }, [load]);

  async function patchUser(id: string, body: { role?: Role; suspended?: boolean }) {
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `Failed (${res.status})`);
      }
      await load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search email or name…"
          value={q}
          onChange={(e) => {
            setPage(1);
            setQ(e.target.value);
          }}
        />
        <div className="sm:w-48">
          <Select
            options={ROLE_OPTIONS}
            value={roleFilter}
            onChange={(e) => {
              setPage(1);
              setRoleFilter(e.target.value);
            }}
          />
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="border border-border rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-3 py-2 font-medium">Name</th>
              <th className="px-3 py-2 font-medium">Email</th>
              <th className="px-3 py-2 font-medium">Role</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Joined</th>
              <th className="px-3 py-2 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.items.map((u) => {
              const isSelf = me?.id === u._id;
              const suspended = !!u.suspendedAt;
              return (
                <tr key={u._id} className="border-t border-border">
                  <td className="px-3 py-2">{u.name}</td>
                  <td className="px-3 py-2 text-muted-foreground">{u.email}</td>
                  <td className="px-3 py-2">
                    <Select
                      options={[
                        { value: 'user', label: 'user' },
                        { value: 'coach', label: 'coach' },
                        { value: 'admin', label: 'admin' },
                      ]}
                      value={u.role}
                      disabled={isSelf || busyId === u._id}
                      onChange={(e) =>
                        patchUser(u._id, { role: e.target.value as Role })
                      }
                    />
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={
                        suspended
                          ? 'text-red-500 font-medium'
                          : 'text-green-600 dark:text-green-400'
                      }
                    >
                      {suspended ? 'Suspended' : 'Active'}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <Button
                      size="sm"
                      variant={suspended ? 'outline' : 'destructive'}
                      disabled={isSelf || busyId === u._id}
                      onClick={() =>
                        patchUser(u._id, { suspended: !suspended })
                      }
                    >
                      {suspended ? 'Unsuspend' : 'Suspend'}
                    </Button>
                  </td>
                </tr>
              );
            })}
            {data && data.items.length === 0 && (
              <tr>
                <td className="px-3 py-6 text-center text-muted-foreground" colSpan={6}>
                  No users match.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {data && data.pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {data.page} of {data.pages} · {data.total} total
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={page >= data.pages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
