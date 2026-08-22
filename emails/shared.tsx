import { Hr, Section, Text } from "@react-email/components";
import { SITE } from "@/content/site";
import type { PortraitType } from "@/lib/commission-schema";

/**
 * Shared palette, type stacks and primitives for the two commission emails —
 * `commission-request.tsx` (to the artist) and `commission-confirmation.tsx`
 * (to the visitor). They are deliberately one system: same band, same rows,
 * same button, so the artist's inbox and the client's inbox show the same hand.
 *
 * Hex equivalents of the oklch design tokens in `app/globals.css`. Mail clients
 * do not support oklch or CSS variables, so the values are resolved here once
 * rather than per template.
 */
export const COLORS = {
  paper: "#FBF7F4", // --background / --paper
  white: "#FFFFFF", // --card
  ink: "#1A1416", // --foreground
  inkMuted: "#4C4849", // --ink-muted flattened onto white — 9.0:1
  rose: "#C9647F", // --primary
  wine: "#7A2E43", // --secondary
  border: "#E8DCD8", // --border
  gold: "#C8A06A", // --accent
  blush: "#F4D9DC", // --muted
  blushFill: "#FDF3F4", // --muted at reading weight, for the description panel

  /**
   * Meta/label grey. NOT the #8A8180 this file's predecessor used — that value is
   * 3.8:1 on white and fails WCAG AA. #6F6664 is 5.6:1 on white, 5.2:1 on cream.
   */
  label: "#6F6664"
} as const;

/**
 * Fraunces / Manrope / Caveat with fallbacks, mirroring `app/layout.tsx`. Most
 * clients strip webfonts, so the fallback is what actually renders in Gmail and
 * Outlook — every stack names a real one.
 */
export const FONT = {
  body: "'Manrope', Helvetica, Arial, sans-serif",
  display: "'Fraunces', Georgia, 'Times New Roman', serif",
  hand: "'Caveat', 'Segoe Script', cursive"
} as const;

export const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Caveat:wght@500&family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Manrope:wght@400;500;600&display=swap";

/**
 * The static form of the `.mesh-bloom` gradient in `app/globals.css` — four
 * radial washes over a solid wine fill. No animation: mail clients do not run
 * keyframes, and the solid `backgroundColor` is what Outlook shows.
 */
export const BAND_BACKGROUND =
  "radial-gradient(at 18% 22%, #B95E80 0px, transparent 55%)," +
  "radial-gradient(at 82% 18%, #C36A5E 0px, transparent 52%)," +
  "radial-gradient(at 72% 82%, #D8A97A 0px, transparent 50%)," +
  "radial-gradient(at 25% 88%, #8E3A5C 0px, transparent 55%)";

/**
 * Client resets plus the dark-mode block, which cannot be inlined.
 *
 * Dark mode inverts within the SAME blush palette rather than reusing the site's
 * `.dark` tokens — that scale is green/purple and would land in the inbox looking
 * like a different brand.
 */
export const EMAIL_CSS = `
  :root { color-scheme: light dark; supported-color-schemes: light dark; }
  body { margin: 0 !important; padding: 0 !important; width: 100% !important; }
  table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
  td { mso-line-height-rule: exactly; }
  img { border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }

  @media (max-width: 600px) {
    .sm-px { padding-left: 20px !important; padding-right: 20px !important; }
    .sm-block { display: block !important; width: 100% !important; text-align: center !important; }
  }

  @media (prefers-color-scheme: dark) {
    .page      { background-color: #14100F !important; }
    .card      { background-color: #241D20 !important; border-color: #3A3134 !important; }
    .fill      { background-color: #2E2528 !important; border-color: #3A3134 !important; }
    .heading   { color: #FBF7F4 !important; }
    .body-text { color: #DCD3D3 !important; }
    .value     { color: #FBF7F4 !important; }
    .label     { color: #B9AFAE !important; }
    .meta      { color: #B9AFAE !important; }
    .hair      { border-color: #3A3134 !important; }
    .link      { color: #D98BA0 !important; }
    .btn       { background-color: #FBF7F4 !important; color: #1A1416 !important; }
    .sig       { color: #E3A2B4 !important; }
  }
`;

/**
 * "Solo — One person" etc., derived from `SITE.pricing.tiers` rather than a map
 * local to this file. The tiers are what built the form's own select options
 * (`PORTRAIT_OPTIONS` in `components/portfolio/commission-form.tsx`), so the label
 * in the email is the label the visitor picked.
 */
export function portraitLabel(id: PortraitType): string {
  const tier = SITE.pricing.tiers.find((t) => t.id === id);
  return tier ? `${tier.tier} — ${tier.people}` : id;
}

export const labelStyle = {
  margin: 0,
  fontFamily: FONT.body,
  fontSize: 12,
  lineHeight: "16px",
  letterSpacing: 1.4,
  textTransform: "uppercase",
  color: COLORS.label
} as const;

export const valueStyle = {
  margin: "3px 0 0",
  fontFamily: FONT.body,
  fontSize: 15,
  lineHeight: "24px",
  color: COLORS.ink,
  whiteSpace: "pre-wrap"
} as const;

/**
 * One label/value pair. Returns null for an empty optional field — the row is
 * dropped rather than rendered blank, which is why the templates do not need
 * placeholder text for a field the visitor skipped.
 */
export function Field({
  label,
  value,
  fallback
}: {
  label: string;
  value?: string | number | null;
  fallback?: string;
}) {
  const resolved = value === undefined || value === null || value === "" ? fallback : value;
  if (resolved === undefined || resolved === "") return null;

  return (
    <Section style={{ marginBottom: 16 }}>
      <Text className="label" style={labelStyle}>
        {label}
      </Text>
      <Text className="value" style={valueStyle}>
        {resolved}
      </Text>
    </Section>
  );
}

/** Hairline in `--border`. */
export function Hairline({ margin = "24px 0" }: { margin?: string }) {
  return <Hr className="hair" style={{ borderColor: COLORS.border, margin }} />;
}

/** The short gold accent bar the site uses to open a section. */
export function GoldRule({ margin = "28px 0 0" }: { margin?: string }) {
  return (
    <Section style={{ margin }}>
      <table role="presentation" cellPadding={0} cellSpacing={0} border={0}>
        <tbody>
          <tr>
            <td
              width={48}
              style={{
                width: 48,
                height: 2,
                backgroundColor: COLORS.gold,
                fontSize: 0,
                lineHeight: "2px"
              }}>
              &nbsp;
            </td>
          </tr>
        </tbody>
      </table>
    </Section>
  );
}

/**
 * The form's submit button, in an inbox: ink fill, cream text, pill, uppercase at
 * 0.12em, 48px tall so it clears the 44px touch-target floor.
 */
export const buttonStyle = {
  display: "inline-block",
  backgroundColor: COLORS.ink,
  color: COLORS.paper,
  fontFamily: FONT.body,
  fontSize: 13,
  lineHeight: "20px",
  fontWeight: 600,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  textDecoration: "none",
  padding: "14px 32px",
  borderRadius: 999
} as const;

export const linkStyle = {
  color: COLORS.wine,
  textDecoration: "underline",
  wordBreak: "break-all"
} as const;
