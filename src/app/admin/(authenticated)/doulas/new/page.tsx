'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { DOULA_STATUSES, STATUS_LABELS } from '@/lib/constants';
import { generateDoulaIdCode } from '@/lib/utils';

export default function NewDoulaPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = new FormData(e.currentTarget);

    const certDate = form.get('certification_date') as string;
    const expDate = certDate
      ? new Date(
          new Date(certDate).setFullYear(new Date(certDate).getFullYear() + 1)
        )
          .toISOString()
          .split('T')[0]
      : null;

    const { error } = await supabase.from('doulas').insert({
      doula_id_code: generateDoulaIdCode(),
      full_name: form.get('full_name'),
      full_name_zh: form.get('full_name_zh') || null,
      email: form.get('email') || null,
      phone: form.get('phone') || null,
      date_of_birth: form.get('date_of_birth') || null,
      certification_date: certDate || null,
      expiration_date: expDate,
      status: form.get('status'),
      training_provider: form.get('training_provider') || null,
      region: form.get('region') || null,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push('/admin/doulas');
    router.refresh();
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">New Doula</h1>
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="full_name">Full Name (English) *</Label>
                <Input id="full_name" name="full_name" required />
              </div>
              <div>
                <Label htmlFor="full_name_zh">Chinese Name</Label>
                <Input id="full_name_zh" name="full_name_zh" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input id="date_of_birth" name="date_of_birth" type="date" />
              </div>
              <div>
                <Label htmlFor="certification_date">Certification Date</Label>
                <Input
                  id="certification_date"
                  name="certification_date"
                  type="date"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  defaultValue="exam_scheduled"
                >
                  {DOULA_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="training_provider">Training Provider</Label>
                <Input
                  id="training_provider"
                  name="training_provider"
                  defaultValue="Cooings"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="region">Region</Label>
              <Input id="region" name="region" placeholder="e.g. Southern California" />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex gap-3">
              <Button
                type="submit"
                className="bg-ada-purple hover:bg-ada-purple/90"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Doula'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
