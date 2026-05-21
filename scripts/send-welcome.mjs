import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { WelcomeEmail } from "../emails/WelcomeEmail.tsx";
import React from "react";

dotenv.config({ path: "../.env.local" });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: { rejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED === "false" ? false : true },
});

const html = await render(
  React.createElement(WelcomeEmail, {
    name: "Chidinma Okereke",
    email: "chidinmaah@gmail.com",
    loginUrl: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/login`,
  })
);

await transporter.sendMail({
  from: process.env.SMTP_FROM || `"SecureGate" <${process.env.SMTP_USER}>`,
  to: "chidinmaah@gmail.com",
  subject: "Your SecureGate Admin Account Details",
  html,
});

console.log("Welcome email sent to chidinmaah@gmail.com");
