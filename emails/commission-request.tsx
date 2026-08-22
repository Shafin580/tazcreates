import {
  Body,
  Button,
  Container,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text
} from "@react-email/components";
import type { CommissionInput } from "@/lib/commission-schema";
import { SITE } from "@/content/site";
import { SITE_URL } from "@/config/site.config";
import {
  EmailHead,
  BAND_BACKGROUND,
  COLORS,
  FONT,
  Field,
  GoldRule,
  Hairline,
  buttonStyle,
  labelStyle,
  linkStyle,
  portraitLabel,
  valueStyle
} from "./shared";

/**
 * The email the artist receives.
 *
 * All values arrive from a public form, so every one of them is untrusted input. React
 * Email escapes interpolated text by default — that is why every field below is passed
 * as a child rather than assembled into raw HTML, and why `referenceUrl` is rendered as
 * a plain `Link` whose href has already been constrained to a valid URL by the zod
 * schema. Do not switch any of this to `dangerouslySetInnerHTML`.
 *
 * Laid out for scanning rather than reading: the sender is the headline, the reply
 * button is above the fold, and the description — the one part that has to be read
 * properly — gets the blush panel. Its counterpart is `commission-confirmation.tsx`,
 * which is what the visitor gets; the two share `shared.tsx` so they stay one system.
 */

const admin = SITE.email.admin;
const empty = SITE.email.empty;

export function CommissionRequestEmail({ data }: { data: CommissionInput }) {
  const type = portraitLabel(data.portraitType);

  return (
    <Html lang="en">
      <EmailHead />
      <Preview>{`${SITE.email.eyebrow} — ${data.name} (${type})`}</Preview>
      <Body
        className="page"
        style={{ backgroundColor: COLORS.paper, fontFamily: FONT.body, margin: 0 }}>
        <Container style={{ maxWidth: 600, margin: "0 auto", padding: "32px 12px" }}>
          {/* Header band — the sender, not the artist, is the headline here. */}
          <Section
            className="sm-px"
            style={{
              backgroundColor: COLORS.wine,
              backgroundImage: BAND_BACKGROUND,
              borderRadius: 20,
              padding: "36px 32px"
            }}>
            <Text
              style={{
                margin: 0,
                fontFamily: FONT.body,
                fontSize: 13,
                lineHeight: "16px",
                letterSpacing: 2,
                textTransform: "uppercase",
                color: COLORS.blush
              }}>
              {SITE.email.eyebrow}
            </Text>
            <Heading
              as="h1"
              style={{
                margin: "8px 0 0",
                fontFamily: FONT.display,
                fontSize: 30,
                lineHeight: "38px",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: COLORS.paper
              }}>
              {data.name}
            </Heading>
            <Text
              style={{
                margin: "4px 0 0",
                fontFamily: FONT.body,
                fontSize: 15,
                lineHeight: "24px"
              }}>
              <Link
                className="breakable"
                href={`mailto:${data.email}`}
                style={{ ...linkStyle, color: COLORS.blush }}>
                {data.email}
              </Link>
            </Text>
          </Section>

          <Section style={{ height: 16, fontSize: 0, lineHeight: "16px" }}>&nbsp;</Section>

          <Section
            className="card sm-px"
            style={{
              backgroundColor: COLORS.white,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 20,
              padding: 32
            }}>
            {/* The only action this email asks for. */}
            <Button className="btn sm-block" href={`mailto:${data.email}`} style={buttonStyle}>
              {`${admin.replyCta} ${data.name}`}
            </Button>

            <GoldRule />

            <Section style={{ marginTop: 24 }}>
              <Field label={SITE.email.portraitType} value={type} />
              <Field label={SITE.email.people} value={data.people} />
              <Field label={SITE.email.medium} value={data.medium} fallback={empty.medium} />
              <Field label={SITE.email.deadline} value={data.deadline} fallback={empty.notSet} />
              <Field label={SITE.email.budget} value={data.budget} fallback={empty.notSet} />
            </Section>

            <Hairline margin="8px 0 24px" />

            {/* The description gets the blush panel, because it is the part that has
                to be read properly rather than scanned. */}
            <Text className="label" style={{ ...labelStyle, marginBottom: 8 }}>
              {SITE.email.description}
            </Text>
            <Section
              className="fill"
              style={{
                backgroundColor: COLORS.blushFill,
                border: `1px solid ${COLORS.blush}`,
                borderRadius: 14,
                padding: "16px 18px"
              }}>
              <Text className="value" style={{ ...valueStyle, margin: 0, lineHeight: "26px" }}>
                {data.description}
              </Text>
            </Section>

            {data.referenceUrl ? (
              <Section style={{ marginTop: 20 }}>
                <Text className="label" style={labelStyle}>
                  {SITE.email.reference}
                </Text>
                <Text style={{ margin: "3px 0 0", fontFamily: FONT.body, fontSize: 15 }}>
                  <Link className="link" href={data.referenceUrl} style={linkStyle}>
                    {data.referenceUrl}
                  </Link>
                </Text>
              </Section>
            ) : null}

            <Hairline />

            <Text
              className="meta"
              style={{
                margin: 0,
                fontFamily: FONT.body,
                fontSize: 14,
                lineHeight: "22px",
                color: COLORS.label
              }}>
              {`${SITE.email.replyHint} ${data.name}.`}
            </Text>
          </Section>

          {/* No unsubscribe: this is a transactional notification the artist sends to
              herself, not a marketing send to an audience. */}
          <Section style={{ padding: "20px 24px 0" }}>
            <Text
              className="meta"
              style={{
                margin: 0,
                fontFamily: FONT.body,
                fontSize: 13,
                lineHeight: "20px",
                color: COLORS.label
              }}>
              {admin.sentBy}{" "}
              <Link className="link" href={SITE_URL} style={{ ...linkStyle, wordBreak: "normal" }}>
                {SITE_URL.replace("https://", "")}
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default CommissionRequestEmail;
