import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { ReactElement } from "react";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED !== "false",
  },
});

export const sendEmail = async (
  to: string,
  subject: string,
  component: ReactElement
) => {
  const html = await render(component);

  await transporter.sendMail({
    from: process.env.SMTP_FROM || `"SecureGate" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
};
