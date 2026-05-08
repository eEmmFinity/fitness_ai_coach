'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Send, MessageSquare, Search, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Thread {
  partnerId: string;
  partnerName: string;
  partnerEmail: string;
  lastMessage: {
    body: string;
    fromMe: boolean;
    createdAt: string;
  } | null;
  unread: number;
}

interface Message {
  _id: string;
  fromId: string;
  toId: string;
  body: string;
  createdAt: string;
  readAt: string | null;
}

const POLL_MS = 8000;

function relTime(iso: string) {
  const t = new Date(iso).getTime();
  const m = Math.floor((Date.now() - t) / 60_000);
  if (m < 1) return 'now';
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  return new Date(iso).toLocaleDateString();
}

function dayKey(iso: string) {
  return new Date(iso).toLocaleDateString();
}

export function MessagesView({
  emptyTitle,
  emptyCopy,
}: {
  emptyTitle: string;
  emptyCopy: string;
}) {
  const { user } = useAuth();
  const params = useSearchParams();
  const initialPartner = params.get('partner');

  const [threads, setThreads] = useState<Thread[] | null>(null);
  const [activeId, setActiveId] = useState<string | null>(initialPartner);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const scrollerRef = useRef<HTMLDivElement>(null);

  const loadThreads = useCallback(async () => {
    const r = await fetch('/api/messages/threads');
    if (!r.ok) {
      setError(`Could not load threads (${r.status})`);
      return;
    }
    const j = await r.json();
    setThreads(j.items);
    if (!activeId && j.items?.length) setActiveId(j.items[0].partnerId);
  }, [activeId]);

  const loadMessages = useCallback(async () => {
    if (!activeId) return;
    const r = await fetch(`/api/messages/${activeId}`);
    if (!r.ok) return;
    const j = await r.json();
    setMessages(j.messages ?? []);
  }, [activeId]);

  useEffect(() => {
    loadThreads();
  }, [loadThreads]);

  useEffect(() => {
    if (!activeId) return;
    loadMessages();
    const t = setInterval(loadMessages, POLL_MS);
    return () => clearInterval(t);
  }, [activeId, loadMessages]);

  // Refresh thread list periodically too (so unread counts on the side stay fresh)
  useEffect(() => {
    const t = setInterval(loadThreads, POLL_MS * 2);
    return () => clearInterval(t);
  }, [loadThreads]);

  // Scroll to bottom when message list changes
  useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, activeId]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const body = draft.trim();
    if (!body || !activeId) return;
    setBusy(true);
    setError(null);
    try {
      const r = await fetch(`/api/messages/${activeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j.error || `Failed (${r.status})`);
      }
      setDraft('');
      await Promise.all([loadMessages(), loadThreads()]);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  if (threads === null) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  if (threads.length === 0) {
    return (
      <Card className="text-center py-12">
        <span className="inline-flex w-12 h-12 rounded-md bg-grad-primary items-center justify-center shadow-glow mx-auto">
          <Inbox className="h-6 w-6 text-white" />
        </span>
        <h3 className="mt-4 font-semibold">{emptyTitle}</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
          {emptyCopy}
        </p>
      </Card>
    );
  }

  const activeThread = threads.find((t) => t.partnerId === activeId) ?? null;
  const filtered = filter.trim()
    ? threads.filter((t) =>
        (t.partnerName + ' ' + t.partnerEmail)
          .toLowerCase()
          .includes(filter.trim().toLowerCase())
      )
    : threads;

  // Group messages by day for separators
  const grouped: { day: string; msgs: Message[] }[] = [];
  for (const m of messages) {
    const day = dayKey(m.createdAt);
    const last = grouped[grouped.length - 1];
    if (last && last.day === day) last.msgs.push(m);
    else grouped.push({ day, msgs: [m] });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-4 h-[calc(100vh-12rem)] min-h-[500px]">
      {/* Threads panel */}
      <Card className="p-0 overflow-hidden flex flex-col">
        <div className="p-3 border-b border-border/60">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search…"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-9 pr-3 h-9 rounded-md bg-input border border-border text-sm focus:outline-none focus:border-primary/60 focus:bg-surface-2"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6 px-3">
              No matches.
            </p>
          ) : (
            <ul>
              {filtered.map((t) => {
                const active = t.partnerId === activeId;
                return (
                  <li key={t.partnerId}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveId(t.partnerId);
                      }}
                      className={cn(
                        'w-full text-left px-3 py-3 flex items-start gap-3 border-b border-border/40 transition-colors',
                        active
                          ? 'bg-surface-2'
                          : 'hover:bg-surface-2/60'
                      )}
                    >
                      <Avatar name={t.partnerName} size="md" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate flex-1">
                            {t.partnerName}
                          </span>
                          {t.lastMessage && (
                            <span className="text-[10px] text-muted-foreground tabular shrink-0">
                              {relTime(t.lastMessage.createdAt)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span
                            className={cn(
                              'text-xs truncate flex-1',
                              t.unread > 0
                                ? 'text-foreground font-medium'
                                : 'text-muted-foreground'
                            )}
                          >
                            {t.lastMessage
                              ? `${t.lastMessage.fromMe ? 'You: ' : ''}${t.lastMessage.body}`
                              : 'No messages yet'}
                          </span>
                          {t.unread > 0 && (
                            <span className="text-[10px] font-semibold tabular bg-grad-primary text-primary-foreground rounded-full px-1.5 py-0.5 shrink-0">
                              {t.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </Card>

      {/* Conversation panel */}
      <Card className="p-0 overflow-hidden flex flex-col">
        {!activeThread ? (
          <div className="flex-1 flex items-center justify-center text-center px-6">
            <div>
              <span className="inline-flex w-12 h-12 rounded-md bg-surface-2 items-center justify-center mx-auto">
                <MessageSquare className="h-6 w-6 text-muted-foreground" />
              </span>
              <p className="text-sm text-muted-foreground mt-3">
                Select a conversation to start.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="p-3 border-b border-border/60 flex items-center gap-3">
              <Avatar name={activeThread.partnerName} size="md" />
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate">
                  {activeThread.partnerName}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {activeThread.partnerEmail}
                </div>
              </div>
            </div>

            <div ref={scrollerRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
              {messages.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-10">
                  No messages yet — say hello.
                </p>
              ) : (
                grouped.map((g) => (
                  <div key={g.day} className="space-y-1.5">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground text-center mb-2">
                      {g.day}
                    </div>
                    {g.msgs.map((m) => {
                      const mine = String(m.fromId) === String(user?.id ?? '');
                      return (
                        <div
                          key={m._id}
                          className={cn(
                            'flex',
                            mine ? 'justify-end' : 'justify-start'
                          )}
                        >
                          <div
                            className={cn(
                              'max-w-[75%] rounded-lg px-3 py-2 text-sm leading-relaxed',
                              mine
                                ? 'bg-grad-primary text-primary-foreground rounded-br-sm'
                                : 'surface-2 border border-border/60 rounded-bl-sm'
                            )}
                          >
                            <p className="whitespace-pre-wrap break-words">{m.body}</p>
                            <div
                              className={cn(
                                'text-[10px] tabular mt-1',
                                mine
                                  ? 'text-primary-foreground/60 text-right'
                                  : 'text-muted-foreground'
                              )}
                            >
                              {new Date(m.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            <form
              onSubmit={send}
              className="p-3 border-t border-border/60 flex items-end gap-2"
            >
              <textarea
                rows={1}
                placeholder="Write a message…"
                className="flex-1 resize-none rounded-md bg-input border border-border px-3 py-2 text-sm focus:outline-none focus:border-primary/60 focus:bg-surface-2 max-h-32"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    send(e);
                  }
                }}
                disabled={busy}
              />
              <Button
                type="submit"
                size="md"
                isLoading={busy}
                disabled={!draft.trim()}
                leftIcon={<Send className="h-4 w-4" />}
              >
                Send
              </Button>
            </form>
            {error && <p className="text-xs text-danger px-3 pb-2">{error}</p>}
          </>
        )}
      </Card>
    </div>
  );
}
