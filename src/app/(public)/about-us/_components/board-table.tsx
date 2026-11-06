/**
 * The live board as a dark-header table, plus its composition rows.
 * Used on /about-us (Governance) and /about-us/board. Names stay in Latin script.
 */
import { useLocale, useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { DIRECTORS, directorsIn, type Director, type DirectorGroup, type DirectorRole } from '../_lib/governance';
import { asLocale, formatList } from '../_lib/format';
import { DataTable, Rows, tdClass, thRowClass, type DocRow } from './doc';

export function BoardTable() {
  const t = useTranslations('board');
  const role: Record<DirectorRole, string> = {
    founderEmeritus: t('roles.founderEmeritus'),
    president: t('roles.president'),
    independentDirector: t('roles.independentDirector'),
    director: t('roles.director'),
  };
  const location: Record<Director['id'], string> = {
    qiWang: t('people.qiWang.location'),
    sethMeng: t('people.sethMeng.location'),
    wesleyLau: t('people.wesleyLau.location'),
    minyuZhang: t('people.minyuZhang.location'),
    veronicaTseng: t('people.veronicaTseng.location'),
    miaLiu: t('people.miaLiu.location'),
  };
  return (
    <DataTable
      caption={t('table.caption')}
      minWidth={0}
      columns={[{ label: t('table.director') }, { label: t('table.role') }, { label: t('table.basedIn') }]}
    >
      {DIRECTORS.map((d) => (
        <tr key={d.id}>
          <th scope="row" lang="en" className={`${thRowClass} sm:whitespace-nowrap`}>
            {d.name}
          </th>
          {/* keep-all: short CJK labels (荣誉创始人, 纽约州布法罗) never break mid-word. */}
          <td className={`${tdClass} [word-break:keep-all]`}>{role[d.role]}</td>
          <td className={`${tdClass} [word-break:keep-all]`}>{location[d.id]}</td>
        </tr>
      ))}
    </DataTable>
  );
}

/**
 * Composition, in the live page's own groups: two independent directors, two
 * industry directors, the chair and the Founder Emeritus. `extra` rows go last.
 */
export function BoardComposition({ extra = [], labelWidth = 220 }: { extra?: DocRow[]; labelWidth?: number }) {
  const t = useTranslations('board');
  const locale = asLocale(useLocale());
  const names = (group: DirectorGroup) => directorsIn(group).map((d) => d.name);
  // Latin names in a Chinese sentence read best with the enumeration comma: "Wesley Lau、Minyu Zhang".
  const joinNames = (list: string[]) => (locale.startsWith('zh') ? list.join('、') : formatList(list, locale));
  const nameList = (group: DirectorGroup): ReactNode => <span lang="en">{joinNames(names(group))}</span>;
  const rows: DocRow[] = [
    { label: t('composition.independent'), value: nameList('independent') },
    { label: t('composition.industry'), value: nameList('industry') },
    { label: t('composition.chair'), value: t('composition.chairValue', { name: names('chair')[0] }) },
    { label: t('composition.founder'), value: t('composition.founderValue', { name: names('founder')[0] }) },
    { label: t('composition.pay'), value: t('composition.payValue') },
    ...extra,
  ];
  return <Rows rows={rows} labelWidth={labelWidth} />;
}
