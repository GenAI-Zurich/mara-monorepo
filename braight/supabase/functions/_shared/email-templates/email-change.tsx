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
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface EmailChangeEmailProps {
  siteName: string
  email: string
  newEmail: string
  confirmationUrl: string
}

export const EmailChangeEmail = ({
  siteName,
  email,
  newEmail,
  confirmationUrl,
}: EmailChangeEmailProps) => (
  <Html lang="de" dir="ltr">
    <Head />
    <Preview>E-Mail-Änderung bestätigen für brAIght</Preview>
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
        <Heading style={h1}>E-Mail-Änderung bestätigen</Heading>
        <Text style={text}>
          Du hast eine Änderung deiner E-Mail-Adresse von{' '}
          <Link href={`mailto:${email}`} style={link}>{email}</Link>{' '}
          zu{' '}
          <Link href={`mailto:${newEmail}`} style={link}>{newEmail}</Link>{' '}
          angefordert.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Änderung bestätigen
        </Button>
        <Text style={textSmall}>
          Falls du diese Änderung nicht angefordert hast, sichere bitte sofort dein Konto.
        </Text>
        <Text style={footer}>
          © brAIght · Lichtberatung mit KI
        </Text>
      </Container>
    </Body>
  </Html>
)

export default EmailChangeEmail

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
const link = { color: 'hsl(40, 73%, 47%)', textDecoration: 'underline' }
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
