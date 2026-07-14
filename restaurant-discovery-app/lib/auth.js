import crypto from 'crypto';

const SECRET = process.env.ADMIN_SESSION_SECRET;

export function createSessionToken() {
  const payload = `admin:${Date.now()}`;
  const signature = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
  return `${Buffer.from(payload).toString('base64')}.${signature}`;
}

export function verifySessionToken(token) {
  if (!token) return false;
  const [encodedPayload, signature] = token.split('.');
  if (!encodedPayload || !signature) return false;

  const payload = Buffer.from(encodedPayload, 'base64').toString();
  const expectedSignature = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');

  return signature === expectedSignature;
}