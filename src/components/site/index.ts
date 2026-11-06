/**
 * Direction C (2026-11) public-site kit, ported from canvas KitC.dc.html.
 * Server-compatible unless noted; all copy comes from the `site` namespace.
 */
export { SiteHeader } from './site-header'; // client
export { SiteFooter } from './site-footer';
export { CookieBanner } from './cookie-banner'; // client
export { Hero, type HeroProps, type HeroAction, type HeroImage } from './hero';
export { Breadcrumb, type BreadcrumbItem } from './breadcrumb';
export { RuledRows, type RuledRow, type RuledRowsProps } from './ruled-rows';
export { Tiles, type TilesProps, type PrimaryTile, type SecondaryTile } from './tiles';
export { LinkList, type LinkListItem } from './link-list';
export { DatesTable, type DatesTableProps } from './dates-table';
export { CtaBox, type CtaBoxProps } from './cta-box';
export { AlertCard, type AlertCardProps } from './alert-card';
export {
  StatusTag,
  PageTag,
  credentialStatusTag,
  certificateStatusTag,
  type StatusKind,
} from './status-tag';
export {
  Pill,
  ArrowLink,
  pillClassName,
  inlineLinkClassName,
  type PillVariant,
  type PillSize,
} from './pill';
export {
  RecordFrame,
  RecordArticle,
  RecordRow,
  RecordId,
  RecordPublicActions,
  RecordLinkBar,
  type RecordFrameProps,
} from './record-frame';
export { VerifyField, type VerifyFieldProps } from './verify-field';
export { AUDIENCES, audienceForPath, showPhoneVerifyBlock, type AudienceKey } from './site-nav';
