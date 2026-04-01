'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  DOULA_STATUSES, STATUS_LABELS, EXAM_STATUSES, EXAM_STATUS_LABELS,
  CREDENTIAL_TYPES, CREDENTIAL_LABELS,
} from '@/lib/constants';
import { generateDoulaIdCode } from '@/lib/utils';

export default function NewDoulaPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCredentials, setSelectedCredentials] = useState<string[]>([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = new FormData(e.currentTarget);

    const { data: newDoula, error } = await supabase.from('doulas').insert({
      doula_id_code: generateDoulaIdCode(),
      full_name: form.get('full_name'),
      full_name_zh: form.get('full_name_zh') || null,
      email: form.get('email') || null,
      phone: form.get('phone') || null,
      date_of_birth: form.get('date_of_birth') || null,
      status: form.get('status'),
      exam_status: form.get('exam_status'),
      training_provider: form.get('training_provider') || null,
      region: form.get('region') || null,
    }).select('id').single();

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Create selected credentials
    if (selectedCredentials.length > 0 && newDoula) {
      const today = new Date().toISOString().split('T')[0];
      const { error: credError } = await supabase.from('doula_credentials').insert(
        selectedCredentials.map((type) => ({
          doula_id: newDoula.id,
          credential_type: type,
          status: 'active',
          certification_date: today,
          expiration_date: type === 'ibclc_training' ? null : new Date(
            new Date().setFullYear(new Date().getFullYear() + 1)
          ).toISOString().split('T')[0],
        }))
      );
      if (credError) {
        alert(`Doula created but credentials failed: ${credError.message}`);
      }
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
                <Label htmlFor="training_provider">Training Provider</Label>
                <Input
                  id="training_provider"
                  name="training_provider"
                  defaultValue="Cooings"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Account Status</Label>
                <select
                  id="status"
                  name="status"
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  defaultValue="registered"
                >
                  {DOULA_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="exam_status">Exam Status</Label>
                <select
                  id="exam_status"
                  name="exam_status"
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  defaultValue="not_started"
                >
                  {EXAM_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {EXAM_STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label>Credentials (optional)</Label>
              <div className="flex gap-4 mt-1">
                {CREDENTIAL_TYPES.map((type) => (
                  <label key={type} className="flex items-center gap-1.5 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={selectedCredentials.includes(type)}
                      onChange={(e) => {
                        setSelectedCredentials(
                          e.target.checked
                            ? [...selectedCredentials, type]
                            : selectedCredentials.filter((t) => t !== type)
                        );
                      }}
                    />
                    {CREDENTIAL_LABELS[type]}
                  </label>
                ))}
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
