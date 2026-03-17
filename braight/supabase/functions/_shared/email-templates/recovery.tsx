/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

export const RecoveryEmail = ({
  siteName,
  confirmationUrl,
}: RecoveryEmailProps) => (
  <Html lang="de" dir="ltr">
    <Head />
    <Preview>Passwort zurücksetzen für brAIght</Preview>
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
        <Heading style={h1}>Passwort zurücksetzen</Heading>
        <Text style={text}>
          Du hast eine Anfrage zum Zurücksetzen deines Passworts für brAIght gestellt. Klicke auf den Button, um ein neues Passwort zu wählen.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Neues Passwort setzen
        </Button>
        <Text style={textSmall}>
          Falls du kein Passwort-Reset angefordert hast, kannst du diese E-Mail ignorieren. Dein Passwort bleibt unverändert.
        </Text>
        <Text style={footer}>
          © brAIght · Lichtberatung mit KI
        </Text>
      </Container>
    </Body>
  </Html>
)

export default RecoveryEmail

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
const button = {
  backgroundColor: 'hsl(40, 73%, 47%)',
  color: '#ffffff',
  fontSize: '13px',
  fontWeight: '600' as const,
  borderRadius: '8px',
  padding: '12px 24px',
  textDecoration: 'none',
  letterSpacing: '0.5px',
  display: 'inline-block' as const,
  marginBottom: '24px',
}
const footer = {
  fontSize: '11px',
  color: 'hsl(36, 10%, 50%)',
  margin: '30px 0 0',
  borderTop: '1px solid hsl(40, 20%, 75%)',
  paddingTop: '16px',
}
