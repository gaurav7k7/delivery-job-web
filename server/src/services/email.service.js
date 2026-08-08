import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

const smtpConfigured = Boolean(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS);

const transporter = smtpConfigured
  ? nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT || 587,
      secure: env.SMTP_PORT === 465,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    })
  : null;

/**
 * Degrades gracefully when SMTP isn't configured (same optional-service
 * pattern as Redis/Sentry): logs the email to the console instead of
 * throwing, so the password-reset flow works end-to-end in local dev
 * without requiring real SMTP credentials.
 */
export async function sendMail({ to, subject, html, text }) {
  if (!transporter) {
    console.log(`[email:dev] To: ${to} | Subject: ${subject}\n${text || html}`);
    return { delivered: false };
  }

  await transporter.sendMail({
    from: env.SMTP_FROM || '"Zerivon" <no-reply@zerivon.in>',
    to,
    subject,
    html,
    text,
  });
  return { delivered: true };
}

export function buildPasswordResetEmail(resetUrl) {
  return {
    subject: 'Reset your Zerivon admin password',
    text: `Reset your password using this link (valid for 30 minutes): ${resetUrl}`,
    html: `<p>You requested a password reset for your Zerivon admin account.</p><p><a href="${resetUrl}">Click here to reset your password</a> (valid for 30 minutes).</p><p>If you did not request this, you can safely ignore this email.</p>`,
  };
}
