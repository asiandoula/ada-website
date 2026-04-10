'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface ExamSession {
  id: string;
  session_code: string;
  status: 'pending' | 'active' | 'completed';
  exam_type: string;
  exam_part: string | null;
  location: string | null;
  scheduled_date: string | null;
  duration_minutes: number | null;
  started_at: string | null;
  created_at: string;
}

function generateSessionCode(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `IRV-${yyyy}${mm}${dd}-001`;
}

function getTodayDate(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

function StatusBadge({ status }: { status: ExamSession['status'] }) {
  if (status === 'pending') {
    return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
  }
  if (status === 'active') {
    return <Badge className="bg-green-100 text-green-800">Active</Badge>;
  }
  return <Badge className="bg-gray-100 text-gray-500">Completed</Badge>;
}

export default function ExamSessionsPage() {
  const supabase = createClient();
  const [sessions, setSessions] = useState<ExamSession[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [form, setForm] = useState({
    session_code: generateSessionCode(),
    scheduled_date: getTodayDate(),
    location: 'Irvine, CA',
    exam_type: 'postpartum',
    duration_minutes: 60,
  });

  async function loadSessions() {
    const { data } = await supabase
      .from('exam_sessions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    setSessions(data ?? []);
  }

  useEffect(() => {
    loadSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreate() {
    setLoading(true);
    try {
      await fetch('/api/exam-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          session_code: form.session_code,
          scheduled_date: form.scheduled_date,
          location: form.location,
          exam_type: form.exam_type,
          duration_minutes: form.duration_minutes,
        }),
      });
      setShowForm(false);
      setForm({ ...form, session_code: generateSessionCode() });
      await loadSessions();
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(sessionId: string, action: string, examPart?: string) {
    setActionLoading(`${sessionId}-${action}-${examPart ?? ''}`);
    try {
      await fetch('/api/exam-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          id: sessionId,
          ...(examPart ? { exam_part: examPart } : {}),
        }),
      });
      await loadSessions();
    } finally {
      setActionLoading(null);
    }
  }

  async function handleCopy(sessionCode: string) {
    const url = `https://asiandoula.org/exam-home?session=${sessionCode}`;
    await navigator.clipboard.writeText(url);
    setCopiedCode(sessionCode);
    setTimeout(() => setCopiedCode(null), 2000);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Exam Sessions</h1>
        <Button
          className="bg-ada-purple hover:bg-ada-purple/90"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? 'Cancel' : 'Create Session'}
        </Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg border p-4 mb-6 space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            New Session
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Session Code</label>
              <Input
                value={form.session_code}
                onChange={(e) => setForm({ ...form, session_code: e.target.value })}
                placeholder="IRV-YYYYMMDD-001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <Input
                type="date"
                value={form.scheduled_date}
                onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <Input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Irvine, CA"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Exam Type</label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm bg-white"
                value={form.exam_type}
                onChange={(e) => setForm({ ...form, exam_type: e.target.value })}
              >
                <option value="postpartum">Postpartum</option>
                <option value="birth">Birth</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
              <Input
                type="number"
                value={form.duration_minutes}
                onChange={(e) => setForm({ ...form, duration_minutes: Number(e.target.value) })}
                min={1}
              />
            </div>
          </div>
          <Button
            className="bg-ada-purple hover:bg-ada-purple/90"
            onClick={handleCreate}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create'}
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {sessions.length === 0 && (
          <div className="bg-white rounded-lg border p-8 text-center text-muted-foreground text-sm">
            No exam sessions yet. Create one above.
          </div>
        )}
        {sessions.map((session) => {
          const examUrl = `https://asiandoula.org/exam-home?session=${session.session_code}`;
          const isBusy = actionLoading?.startsWith(session.id);
          return (
            <div key={session.id} className="bg-white rounded-lg border p-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-sm">{session.session_code}</span>
                    <StatusBadge status={session.status} />
                    {session.exam_part && (
                      <Badge className="bg-blue-100 text-blue-800 capitalize">
                        {session.exam_part}
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground flex flex-wrap gap-3">
                    {session.scheduled_date && <span>{session.scheduled_date}</span>}
                    {session.location && <span>{session.location}</span>}
                    <span className="capitalize">{session.exam_type}</span>
                    {session.duration_minutes && (
                      <span>{session.duration_minutes} min</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-muted-foreground font-mono truncate max-w-xs">
                      {examUrl}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-6 px-2"
                      onClick={() => handleCopy(session.session_code)}
                    >
                      {copiedCode === session.session_code ? 'Copied!' : 'Copy URL'}
                    </Button>
                  </div>
                </div>

                {(session.status === 'pending' || session.status === 'active') && (
                  <div className="flex flex-wrap gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isBusy}
                      onClick={() => handleAction(session.id, 'start', 'written')}
                    >
                      Start Written
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isBusy}
                      onClick={() => handleAction(session.id, 'start', 'practical')}
                    >
                      Start Practical
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isBusy}
                      onClick={() => handleAction(session.id, 'end')}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      End Exam
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
