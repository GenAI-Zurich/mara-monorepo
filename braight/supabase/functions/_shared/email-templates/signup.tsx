/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
  token: string
}

export const SignupEmail = ({
  siteName,
  siteUrl,
  recipient,
  confirmationUrl,
  token,
}: SignupEmailProps) => (
  <Html lang="de" dir="ltr">
    <Head />
    <Preview>Dein Verifizierungscode für brAIght</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <Img
            src="https://xgjiulkqwqxprgvlzpld.supabase.co/storage/v1/object/public/email-assets/logo_braight.png"
            width="140"
            alt="brAIght"
            style={logo}
          />
        </Section>
        <Heading style={h1}>Dein Verifizierungscode</Heading>
        <Text style={text}>
          Willkommen bei brAIght! Verwende den folgenden Code, um deine E-Mail-Adresse zu bestätigen:
        </Text>
        <Section style={codeSection}>
          <Text style={codeStyle}>{token}</Text>
        </Section>
        <Text style={textSmall}>
          Der Code ist 60 Minuten gültig. Falls du kein Konto erstellt hast, kannst du diese E-Mail ignorieren.
        </Text>
        <Text style={footer}>
          © brAIght · Lichtberatung mit KI
        </Text>
      </Container>
    </Body>
  </Html>
)

export default SignupEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Muli', 'Jost', Arial, sans-serif" }
const container = { padding: '40px 25px', maxWidth: '460px', margin: '0 auto' }
const logoSection = { marginBottom: '32px' }
const logo = { display: 'block' as const }
const h1 = {
  fontSize: '22px',
  fontWeight: '600' as const,
  color: 'hsl(36, 20%, 15%)',
  margin: '0 0 16px',
}
const text = {
  fontSize: '14px',
  color: 'hsl(36, 10%, 50%)',
  lineHeight: '1.6',
  margin: '0 0 24px',
}
const textSmall = {
  fontSize: '13px',
  color: 'hsl(36, 10%, 50%)',
  lineHeight: '1.5',
  margin: '0 0 24px',
}
const codeSection = {
  backgroundColor: 'hsl(40, 15%, 96%)',
  borderRadius: '8px',
  padding: '20px',
  textAlign: 'center' as const,
  marginBottom: '24px',
  border: '1px solid hsl(40, 20%, 75%)',
}
const codeStyle = {
  fontFamily: "'Courier New', Courier, monospace",
  fontSize: '32px',
  fontWeight: '700' as const,
  color: 'hsl(40, 73%, 47%)',
  letterSpacing: '6px',
  margin: '0',
}
const footer = {
  fontSize: '11px',
  color: 'hsl(36, 10%, 50%)',
  margin: '30px 0 0',
  borderTop: '1px solid hsl(40, 20%, 75%)',
  paddingTop: '16px',
}
