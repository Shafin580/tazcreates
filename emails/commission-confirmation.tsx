import {
  Body,
  Button,
  Column,
  Container,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
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
  portraitLabel
} from "./shared";

/**
 * The auto-reply the visitor receives, and the counterpart to
 * `commission-request.tsx`. Same palette and primitives, opposite job: this one
 * reassures rather than informs, so the artist is the headline, the summary is an
 * echo of what they typed, and the only action offered is Instagram.
 *
 * Labels come from `SITE.commission.fields` — the second-person wording already on
 * the form — not `SITE.email.*`, which is written to the artist about the visitor.
 *
 * Every value still originates from a public form. React Email escapes interpolated
 * text, so each field is passed as a child; `referenceUrl` is constrained to a valid
 * URL by the zod schema before it reaches an href. No `dangerouslySetInnerHTML`.
 *
 * No unsubscribe link: this is a transactional reply to a form the recipient just
 * submitted, not a marketing send to an audience.
 */

const client = SITE.email.client;
const fields = SITE.commission.fields;
const empty = SITE.email.empty;

/** "Priya Raman" -> "Priya". Falls back to the whole string for a single-word name. */
function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] || name;
}

export function CommissionConfirmationEmail({ data }: { data: CommissionInput }) {
  return (
    <Html lang="en">
      <EmailHead />
      <Preview>{client.preview}</Preview>
      <Body
        className="page"
        style={{ backgroundColor: COLORS.paper, fontFamily: FONT.body, margin: 0 }}>
        <Container style={{ maxWidth: 600, margin: "0 auto", padding: "32px 12px" }}>
          {/* Header band — the artist is the headline: this is her replying. */}
          <Section
            className="sm-px"
            style={{
              backgroundColor: COLORS.wine,
              backgroundImage: BAND_BACKGROUND,
              borderRadius: 20,
              padding: "36px 32px"
            }}>
            <Row>
              <Column width={72} style={{ width: 72, verticalAlign: "middle" }}>
                <Img
                  src={`${SITE_URL}${SITE.artist.avatar.src}`}
                  alt={SITE.artist.avatar.alt}
                  width={56}
                  height={56}
                  style={{ display: "block", borderRadius: 28 }}
                />
              </Column>
              <Column style={{ verticalAlign: "middle" }}>
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
                  {client.eyebrow}
                </Text>
                <Heading
                  as="h1"
                  style={{
                    margin: "6px 0 0",
                    fontFamily: FONT.display,
                    fontSize: 26,
                    lineHeight: "32px",
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    color: COLORS.paper
                  }}>
                  {SITE.artist.name}
                </Heading>
                <Text
                  style={{
                    margin: "2px 0 0",
                    fontFamily: FONT.body,
                    fontSize: 14,
                    lineHeight: "20px",
                    color: COLORS.blush
                  }}>
                  {SITE.artist.role}
                </Text>
              </Column>
            </Row>
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
            <Heading
              as="h2"
              className="heading"
              style={{
                margin: 0,
                fontFamily: FONT.display,
                fontSize: 24,
                lineHeight: "32px",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: COLORS.ink
              }}>
              {`${client.greeting} ${firstName(data.name)},`}
            </Heading>

            <Text
              className="body-text"
              style={{
                margin: "12px 0 0",
                fontFamily: FONT.body,
                fontSize: 16,
                lineHeight: "26px",
                color: COLORS.inkMuted
              }}>
              {SITE.commission.success.body}
            </Text>
            <Text
              className="body-text"
              style={{
                margin: "12px 0 0",
                fontFamily: FONT.body,
                fontSize: 16,
                lineHeight: "26px",
                color: COLORS.inkMuted
              }}>
              {client.body}
            </Text>

            <GoldRule />

            <Text
              className="label"
              style={{ ...labelStyle, margin: "20px 0 16px", fontWeight: 600 }}>
              {client.summaryHeading}
            </Text>

            <Field label={fields.portraitType} value={portraitLabel(data.portraitType)} />
            <Field label={fields.people} value={data.people} />
            <Field label={fields.medium} value={data.medium} fallback={empty.medium} />
            <Field label={fields.deadline} value={data.deadline} fallback={empty.notSet} />
            <Field label={fields.budget} value={data.budget} fallback={empty.notSet} />

            <Hairline margin="8px 0 24px" />

            <Field label={fields.description} value={data.description} />

            {data.referenceUrl ? (
              <Section style={{ marginTop: 4 }}>
                <Text className="label" style={labelStyle}>
                  {fields.referenceUrl}
                </Text>
                <Text style={{ margin: "3px 0 0", fontFamily: FONT.body, fontSize: 15 }}>
                  <Link className="link" href={data.referenceUrl} style={linkStyle}>
                    {data.referenceUrl}
                  </Link>
                </Text>
              </Section>
            ) : null}

            <Hairline margin="20px 0 24px" />

            <Text
              className="meta"
              style={{
                margin: 0,
                fontFamily: FONT.body,
                fontSize: 14,
                lineHeight: "22px",
                color: COLORS.label
              }}>
              {SITE.pricing.note}
            </Text>

            <Section style={{ marginTop: 28 }}>
              <Button className="btn sm-block" href={SITE.cta.href} style={buttonStyle}>
                {SITE.cta.primary}
              </Button>
            </Section>

            <Text
              className="sig"
              style={{
                margin: "28px 0 0",
                fontFamily: FONT.hand,
                fontSize: 24,
                lineHeight: "30px",
                color: COLORS.wine
              }}>
              {SITE.artist.signature}
            </Text>
          </Section>

          <Section style={{ padding: "20px 24px 0" }}>
            <Text style={{ margin: 0, fontFamily: FONT.body, fontSize: 14, lineHeight: "24px" }}>
              <Link
                className="link"
                href={SITE.contact.instagramUrl}
                style={{ ...linkStyle, wordBreak: "normal" }}>
                {`${SITE.footer.instagramLabel} ${SITE.contact.instagramHandle}`}
              </Link>
            </Text>
            <Text
              style={{
                margin: "4px 0 0",
                fontFamily: FONT.body,
                fontSize: 14,
                lineHeight: "24px"
              }}>
              <Link className="link" href={`mailto:${SITE.contact.email}`} style={linkStyle}>
                {SITE.contact.email}
              </Link>
            </Text>
            <Text
              className="meta"
              style={{
                margin: "8px 0 0",
                fontFamily: FONT.body,
                fontSize: 13,
                lineHeight: "20px",
                color: COLORS.label
              }}>
              {SITE.footer.rights}
            </Text>
            <Text
              className="meta"
              style={{
                margin: "12px 0 0",
                fontFamily: FONT.body,
                fontSize: 13,
                lineHeight: "20px",
                color: COLORS.label
              }}>
              {`${client.footerReason} ${SITE_URL.replace("https://", "")}.`}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default CommissionConfirmationEmail;
