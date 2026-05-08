// Minimal email transport.
// In dev/no-provider mode it logs to the server console so you can copy the link.
// Wire SES/Resend/SendGrid here later — keep the signature stable.

import crypto from 'crypto';

export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export async function sendEmail(msg: EmailMessage) {
  // eslint-disable-next-line no-console
  console.log(
    `\n📧 [email] to=${msg.to}\n   subject: ${msg.subject}\n   ${msg.text}\n`
  );
}

export function appUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${base.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
}

export function generateToken(bytes = 32) {
  const raw = crypto.randomBytes(bytes).toString('base64url');
  const hash = crypto.createHash('sha256').update(raw).digest('hex');
  return { raw, hash };
}

export function hashToken(raw: string) {
  return crypto.createHash('sha256').update(raw).digest('hex');
}
