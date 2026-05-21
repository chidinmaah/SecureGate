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
