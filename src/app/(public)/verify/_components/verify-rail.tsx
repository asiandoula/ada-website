/**
 * /verify right rail (board Verify.dc.html): what the statuses mean, how to
 * tell a real record, report a concern. The board's letter and bulk-lookup
 * section is left out: there is no letter service or fee to point at yet.
 */
import { useTranslations } from 'next-intl';
import { ArrowLink, StatusTag, type StatusKind } from '@/components/site';
import { SITE } from '@/lib/facts';

const LEGEND: readonly StatusKind[] = ['active', 'expired', 'suspended', 'revoked', 'retired', 'superseded', 'withdrawn'];

export function VerifyRail() {
  const t = useTranslations('verify.rail');
  const block = 'flex flex-col gap-2 pt-3.5 border-t-2 border-solid border-ada2-ink';
  const h3 = 'm-0 text-[20px] leading-[26px] font-semibold text-ada2-ink [text-wrap:balance]';
  const real = ['real1', 'real2', 'real3'] as const;

  return (
    <aside aria-labelledby="aside-h" className="relative flex-[4_1_300px] min-w-0 flex flex-col gap-9">
      <h2 id="aside-h" className="ada2-sr">
        {t('heading')}
      </h2>

      <section aria-labelledby="legend-h" className={block}>
        <h3 id="legend-h" className={h3}>
          {t('legendTitle')}
        </h3>
        <dl className="m-0 flex flex-col">
          {LEGEND.map((k) => (
            <div key={k} className="flex flex-wrap items-start gap-x-4 gap-y-2 py-3 border-b border-solid border-ada2-hairline">
              <dt className="flex-[0_0_124px]">
                <StatusTag status={k} />
              </dt>
              <dd className="flex-[1_1_160px] min-w-0 m-0 text-[15px] leading-[22px] text-ada2-muted [text-wrap:pretty]">
                {t(`legend.${k}`)}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="real-h" className={block}>
        <h3 id="real-h" className={h3}>
          {t('realTitle')}
        </h3>
        <ol className="m-0 p-0 list-none flex flex-col">
          {real.map((k, i) => (
            <li key={k} className="flex gap-3.5 py-3 border-b border-solid border-ada2-hairline text-[16px] leading-[25px]">
              <span aria-hidden="true" className="flex-[0_0_14px] font-semibold text-ada2-muted [font-variant-numeric:tabular-nums_lining-nums]">
                {i + 1}
              </span>
              <span className="min-w-0 [text-wrap:pretty]">
                {t.rich(k, {
                  host: SITE.host,
                  b: (chunks) => <span className="font-semibold text-ada2-blossom whitespace-nowrap">{chunks}</span>,
                })}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="rep-h" className="flex flex-col items-start gap-3.5 pt-3.5 border-t-2 border-solid border-ada2-ink">
        <h3 id="rep-h" className={h3}>
          {t('reportTitle')}
        </h3>
        <p className="m-0 text-[16px] leading-[25px] text-ada2-body [text-wrap:pretty]">{t('reportBody')}</p>
        <ArrowLink href="/for-doulas/code-of-conduct">{t('reportLink')}</ArrowLink>
      </section>
    </aside>
  );
}
