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

interface VerificationEmailProps {
  name: string;
  verifyUrl: string;
}

export const VerificationEmail = ({
  name,
  verifyUrl,
}: VerificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Verify your SecureGate account</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Welcome to SecureGate</Heading>
        <Text style={text}>Hello {name},</Text>
        <Text style={text}>
          Thank you for signing up. Please click the button below to verify your account and get started.
        </Text>
        <Section style={buttonContainer}>
          <Button style={button} href={verifyUrl}>
            Verify Email
          </Button>
        </Section>
        <Text style={text}>
          If you didn&apos;t create this account, you can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
);
