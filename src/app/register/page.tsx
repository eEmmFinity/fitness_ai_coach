'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { homeFor } from '@/lib/roleHome';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthShell } from '@/components/auth/AuthShell';
import { User as UserIcon, Award, Mail, Lock, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

type IntendedRole = 'user' | 'coach';

const MIN_BIO = 30;

export default function RegisterPage() {
  const [intendedRole, setIntendedRole] = useState<IntendedRole>('user');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user) router.replace(homeFor(user.role));
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) return setError('Passwords do not match');
    if (password.length < 6) return setError('Password must be at least 6 characters');
    if (intendedRole === 'coach' && bio.trim().length < MIN_BIO) {
      return setError(`Coach bio must be at least ${MIN_BIO} characters.`);
    }

    setLoading(true);
    try {
      await register({
        email,
        password,
        name,
        intendedRole,
        bio: intendedRole === 'coach' ? bio.trim() : undefined,
      });
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell side="register">
      <div className="space-y-7">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Create account</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Already a member?{' '}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <RoleCard
              active={intendedRole === 'user'}
              onClick={() => setIntendedRole('user')}
              icon={<UserIcon className="h-4 w-4" />}
              title="I want to train"
              copy="Track workouts, get coaching."
              badge="Instant"
            />
            <RoleCard
              active={intendedRole === 'coach'}
              onClick={() => setIntendedRole('coach')}
              icon={<Award className="h-4 w-4" />}
              title="I want to coach"
              copy="Train clients, review sessions."
              badge="Review"
            />
          </div>

          {error && (
            <div className="px-3 py-2.5 rounded-md bg-danger/10 border border-danger/30 text-danger text-sm">
              {error}
            </div>
          )}

          <Input
            type="text"
            label="Full name"
            placeholder="Jane Smith"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
            autoComplete="name"
          />

          <Input
            type="email"
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            leftAdornment={<Mail className="h-4 w-4" />}
            autoComplete="email"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              leftAdornment={<Lock className="h-4 w-4" />}
              autoComplete="new-password"
            />
            <Input
              type="password"
              label="Confirm"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          {intendedRole === 'coach' && (
            <div className="animate-slide-down">
              <label className="block text-sm font-medium mb-1.5">
                Coaching background
              </label>
              <textarea
                className="w-full rounded-md bg-input border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary/60 focus:bg-surface-2 transition leading-relaxed"
                rows={4}
                minLength={MIN_BIO}
                maxLength={1000}
                required
                disabled={loading}
                placeholder="Certifications, years coaching, specialties (mobility, strength, endurance)…"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
              <div className="flex items-center justify-between mt-1.5 text-xs">
                <span className="text-muted-foreground flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  Visible only to admin reviewers.
                </span>
                <span
                  className={cn(
                    'tabular',
                    bio.trim().length >= MIN_BIO
                      ? 'text-success'
                      : 'text-muted-foreground'
                  )}
                >
                  {bio.trim().length}/{MIN_BIO} min
                </span>
              </div>
            </div>
          )}

          <Button type="submit" size="lg" className="w-full" isLoading={loading}>
            {loading
              ? 'Creating account…'
              : intendedRole === 'coach'
              ? 'Submit application'
              : 'Create account'}
          </Button>

          {intendedRole === 'coach' && (
            <p className="text-xs text-muted-foreground text-center">
              You'll log in immediately. Coach features unlock once admins approve your application.
            </p>
          )}
        </form>
      </div>
    </AuthShell>
  );
}

function RoleCard({
  active,
  onClick,
  icon,
  title,
  copy,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  copy: string;
  badge: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'text-left p-3 rounded-md border transition-all relative overflow-hidden',
        active
          ? 'border-transparent shadow-glow'
          : 'border-border hover:border-border/60 hover:bg-surface-2'
      )}
    >
      {active && (
        <span className="absolute inset-0 bg-grad-primary opacity-[0.08] pointer-events-none" />
      )}
      <div className="relative flex items-center gap-2 mb-1">
        <span
          className={cn(
            'w-7 h-7 rounded-md flex items-center justify-center',
            active
              ? 'bg-grad-primary text-primary-foreground shadow-glow'
              : 'bg-secondary text-foreground'
          )}
        >
          {icon}
        </span>
        <span className="font-semibold text-sm">{title}</span>
      </div>
      <p className="relative text-xs text-muted-foreground">{copy}</p>
      <span
        className={cn(
          'relative inline-block text-[10px] mt-2 px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wider',
          active
            ? 'bg-white/15 text-foreground border border-foreground/20'
            : 'bg-secondary text-muted-foreground'
        )}
      >
        {badge}
      </span>
    </button>
  );
}
