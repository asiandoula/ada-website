import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InquiryStatusEditor } from '@/components/admin/inquiry-status-editor';
import {
  INQUIRY_STATUS_COLORS,
  INQUIRY_STATUS_LABELS,
  formatPT,
  hasInquiryStatusColumn,
  statusOf,
  timeAgo,
  topicColor,
  type InquiryRow,
} from '@/lib/inquiries';

export const dynamic = 'force-dynamic';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ilike treats % and _ as wildcards; escape them so an email only matches itself.
function likeExact(value: string) {
  return value.replace(/[\\%_]/g, (c) => `\\${c}`);
}

export default async function InquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!UUID_RE.test(id)) notFound();

  const supabase = getSupabase();
  const [tracking, { data }] = await Promise.all([
    hasInquiryStatusColumn(supabase),
    supabase.from('contact_submissions').select('*').eq('id', id).maybeSingle(),
  ]);
  const inquiry = data as InquiryRow | null;
  if (!inquiry) notFound();

  const { data: otherData } = await supabase
    .from('contact_submissions')
    .select('*')
    .ilike('email', likeExact(inquiry.email.trim()))
    .neq('id', inquiry.id)
    .order('created_at', { ascending: false })
    .limit(10);
  const others = (otherData ?? []) as InquiryRow[];

  const status = statusOf(inquiry);
  const now = Date.now();
  const telHref = inquiry.phone ? `tel:${inquiry.phone.replace(/[^\d+]/g, '')}` : null;
  const replySubject = encodeURIComponent('Re: your message to Asian Doula Alliance');

  return (
    <div className="max-w-5xl">
      <Link href="/admin/inquiries" className="text-sm text-ada-purple hover:underline">
        ← All inquiries
      </Link>

      <div className="mt-3 mb-6 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold">{inquiry.full_name}</h1>
        <Badge className={topicColor(inquiry.topic)}>{inquiry.topic || 'No topic'}</Badge>
        {tracking && (
          <Badge className={INQUIRY_STATUS_COLORS[status]}>{INQUIRY_STATUS_LABELS[status]}</Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Message</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-zinc-800">{inquiry.message}</p>
              <p className="mt-4 text-xs text-muted-foreground">
                Received {formatPT(inquiry.created_at)} · {timeAgo(inquiry.created_at, now)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-[80px_1fr] gap-y-2 text-sm">
                <dt className="text-muted-foreground">Email</dt>
                <dd className="break-all">
                  <a href={`mailto:${inquiry.email}?subject=${replySubject}`} className="text-ada-purple hover:underline">
                    {inquiry.email}
                  </a>
                </dd>
                <dt className="text-muted-foreground">Phone</dt>
                <dd>
                  {telHref ? (
                    <a href={telHref} className="text-ada-purple hover:underline">
                      {inquiry.phone}
                    </a>
                  ) : (
                    <span className="text-muted-foreground">Not given</span>
                  )}
                </dd>
              </dl>
            </CardContent>
          </Card>

          {others.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Other messages from this email ({others.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {others.map((o) => {
                    const oStatus = statusOf(o);
                    return (
                      <Link
                        key={o.id}
                        href={`/admin/inquiries/${o.id}`}
                        className="block rounded-md border p-3 hover:bg-zinc-50"
                      >
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span>{formatPT(o.created_at)}</span>
                          <Badge className={topicColor(o.topic)}>{o.topic || 'No topic'}</Badge>
                          {tracking && (
                            <Badge className={INQUIRY_STATUS_COLORS[oStatus]}>{INQUIRY_STATUS_LABELS[oStatus]}</Badge>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-zinc-700 line-clamp-2">{o.message}</p>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <InquiryStatusEditor
            id={inquiry.id}
            enabled={tracking}
            initialStatus={status}
            initialNote={inquiry.note ?? ''}
            lastUpdated={
              inquiry.handled_at
                ? `${inquiry.handled_by ?? 'Someone'} · ${formatPT(inquiry.handled_at)}`
                : null
            }
          />
        </div>
      </div>
    </div>
  );
}
