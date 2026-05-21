import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { main, container, h1, text, buttonContainer, button } from "./shared-styles";

interface WelcomeEmailProps {
  name: string;
  email: string;
  loginUrl: string;
}

export const WelcomeEmail = ({
  name,
  email,
  loginUrl,
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Your SecureGate admin account is ready</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Welcome to SecureGate</Heading>
        <Text style={text}>Hello {name},</Text>
        <Text style={text}>
          Your admin account has been created. Here are your account details:
        </Text>
        <Text style={text}>
          <strong>Email:</strong> {email}
        </Text>
        <Text style={text}>
          You&apos;ll need to set a password to sign in. Click the button below to
          go to the login page, then use the "Forgot Password" link to set up
          your password.
        </Text>
        <Section style={buttonContainer}>
          <Button style={button} href={loginUrl}>
            Sign In to SecureGate
          </Button>
        </Section>
        <Text style={text}>
          If you didn&apos;t expect this email, you can safely ignore it.
        </Text>
      </Container>
    </Body>
  </Html>
);
