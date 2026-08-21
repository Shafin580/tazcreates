import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text
} from "@react-email/components";
import type { CommissionInput } from "@/lib/commission-schema";
import { SITE } from "@/content/site";

/**
 * The email the artist receives.
 *
 * All values arrive from a public form, so every one of them is untrusted input. React
 * Email escapes interpolated text by default — that is why every field below is passed
 * as a child rather than assembled into raw HTML, and why `referenceUrl` is rendered as
 * a plain `Link` whose href has already been constrained to a valid URL by the zod
 * schema. Do not switch any of this to `dangerouslySetInnerHTML`.
 *
 * Palette matches the site so the email reads as hers, not as a form dump.
 */

const CREAM = "#FBF7F4";
const INK = "#1A1416";
const ROSE = "#C9647F";
const WINE = "#7A2E43";
const BORDER = "#E8DCD8";

const TYPE_LABEL: Record<CommissionInput["portraitType"], string> = {
  solo: "Solo — one person",
  duo: "Duo — two people",
  group: "Group — three or more"
};

function Row({ label, value }: { label: string; value?: string | number | null }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <Section style={{ marginBottom: 12 }}>
      <Text
        style={{
          margin: 0,
          fontSize: 11,
          letterSpacing: 1.4,
          textTransform: "uppercase",
          color: "#8A8180"
        }}>
        {label}
      </Text>
      <Text style={{ margin: "2px 0 0", fontSize: 15, color: INK, whiteSpace: "pre-wrap" }}>
        {value}
      </Text>
    </Section>
  );
}

export function CommissionRequestEmail({ data }: { data: CommissionInput }) {
  return (
    <Html>
      <Head />
      <Preview>{`New ${TYPE_LABEL[data.portraitType]} commission request from ${data.name}`}</Preview>
      <Body
        style={{ backgroundColor: CREAM, fontFamily: "Helvetica, Arial, sans-serif", margin: 0 }}>
        <Container style={{ maxWidth: 560, margin: "0 auto", padding: "32px 24px" }}>
          <Text
            style={{
              margin: 0,
              fontSize: 12,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: ROSE
            }}>
            {SITE.email.eyebrow}
          </Text>
          <Heading style={{ margin: "6px 0 0", fontSize: 28, color: INK, fontWeight: 600 }}>
            {data.name}
          </Heading>
          <Text style={{ margin: "4px 0 0", fontSize: 15 }}>
            <Link href={`mailto:${data.email}`} style={{ color: WINE }}>
              {data.email}
            </Link>
          </Text>

          <Hr style={{ borderColor: BORDER, margin: "24px 0" }} />

          <Row label={SITE.email.portraitType} value={TYPE_LABEL[data.portraitType]} />
          <Row label={SITE.email.people} value={data.people} />
          <Row label={SITE.email.medium} value={data.medium} />
          <Row label={SITE.email.deadline} value={data.deadline} />
          <Row label={SITE.email.budget} value={data.budget} />

          <Hr style={{ borderColor: BORDER, margin: "24px 0" }} />

          <Row label={SITE.email.description} value={data.description} />

          {data.referenceUrl ? (
            <Section style={{ marginTop: 12 }}>
              <Text
                style={{
                  margin: 0,
                  fontSize: 11,
                  letterSpacing: 1.4,
                  textTransform: "uppercase",
                  color: "#8A8180"
                }}>
                {SITE.email.reference}
              </Text>
              <Text style={{ margin: "2px 0 0", fontSize: 15 }}>
                <Link href={data.referenceUrl} style={{ color: WINE }}>
                  {data.referenceUrl}
                </Link>
              </Text>
            </Section>
          ) : null}

          <Hr style={{ borderColor: BORDER, margin: "24px 0" }} />

          <Text style={{ margin: 0, fontSize: 13, color: "#8A8180" }}>
            {SITE.email.replyHint} {data.name}.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default CommissionRequestEmail;
