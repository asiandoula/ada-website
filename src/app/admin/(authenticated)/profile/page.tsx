'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MIN_PASSWORD_LENGTH = 8;

export default function ProfilePage() {
  const supabase = createClient();

  const [identity, setIdentity] = useState<{
    email: string;
    name?: string;
    avatar?: string;
  } | null>(null);

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [avatarBroken, setAvatarBroken] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const meta = user.user_metadata ?? {};
        setIdentity({
          email: user.email ?? '',
          name: (meta.full_name as string) ?? (meta.name as string) ?? undefined,
          avatar: (meta.avatar_url as string) ?? (meta.picture as string) ?? undefined,
        });
      }
    });
  }, [supabase]);

  async function handleSetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setDone(false);

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (password !== confirm) {
      setError('The two passwords do not match.');
      return;
    }

    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);

    if (error) {
      setError(error.message);
      return;
    }
    setPassword('');
    setConfirm('');
    setDone(true);
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-semibold text-ada-navy">Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          {identity?.avatar && !avatarBroken ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={identity.avatar}
              alt=""
              referrerPolicy="no-referrer"
              onError={() => setAvatarBroken(true)}
              className="h-14 w-14 rounded-full"
            />
          ) : (
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-200 text-lg text-zinc-600">
              {identity?.email?.[0]?.toUpperCase() ?? '?'}
            </span>
          )}
          <div className="min-w-0">
            {identity?.name && (
              <p className="font-medium text-ada-navy">{identity.name}</p>
            )}
            <p className="truncate text-sm text-zinc-500">{identity?.email ?? '…'}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Backup password</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-zinc-500">
            You normally sign in with Google. Set a password here only as a backup
            for when Google is unavailable — you can leave this alone otherwise.
          </p>
          <form onSubmit={handleSetPassword} className="space-y-4">
            <div>
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setDone(false); }}
                autoComplete="new-password"
                required
              />
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirm password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirm}
                onChange={(e) => { setConfirm(e.target.value); setDone(false); }}
                autoComplete="new-password"
                required
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {done && <p className="text-sm text-emerald-600">Password updated.</p>}
            <Button
              type="submit"
              className="bg-ada-purple hover:bg-ada-purple/90"
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Set password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
