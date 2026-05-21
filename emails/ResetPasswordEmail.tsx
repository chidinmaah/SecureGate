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

interface ResetPasswordEmailProps {
  resetUrl: string;
}

export const ResetPasswordEmail = ({
  resetUrl,
}: ResetPasswordEmailProps) => (
  <Html>
    <Head />
    <Preview>Reset your SecureGate password</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Reset Password</Heading>
        <Text style={text}>
          We received a request to reset your password. If this was you, please click the button below to set a new password.
        </Text>
        <Section style={buttonContainer}>
          <Button style={button} href={resetUrl}>
            Reset Password
          </Button>
        </Section>
        <Text style={text}>
          This link will expire in 1 hour. If you didn&apos;t request a password reset, you can ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#f9fafb",
  fontFamily: 'Inter, system-ui, sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "580px",
};

const h1 = {
  color: "#1e3a5f",
  fontSize: "24px",
  fontWeight: "700",
  textAlign: "center" as const,
  margin: "30px 0",
};

const text = {
  color: "#4b5563",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
};

const buttonContainer = {
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#1e3a5f",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 24px",
};
