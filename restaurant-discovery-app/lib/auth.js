import crypto from 'crypto';

const SECRET = process.env.SUPERADMIN_SESSION_SECRET;

function sign(payload) {
  return crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
}

function createToken(prefix, id) {
  const payload = `${prefix}:${id}:${Date.now()}`;
  const signature = sign(payload);
  return `${Buffer.from(payload).toString('base64')}.${signature}`;
}

function verifyToken(token, prefix) {
  if (!token) return null;
  const [encodedPayload, signature] = token.split('.');
  if (!encodedPayload || !signature) return null;

  const payload = Buffer.from(encodedPayload, 'base64').toString();
  if (sign(payload) !== signature) return null;

  const [tokenPrefix, id] = payload.split(':');
  if (tokenPrefix !== prefix) return null;

  return Number(id);
}

// SuperAdmin session 
export function createSuperadminToken() {
  return createToken('superadmin', 'superadmin');
}
export function verifySuperadminToken(token) {
  return verifyToken(token, 'superadmin') !== null;
}

// User session 
export function createUserToken(userId) {
  return createToken('user', userId);
}
export function verifyUserToken(token) {
  return verifyToken(token, 'user'); 
}

// admin (restaurant owner)
export function createAdminToken(adminId) {
  return createToken('admin', adminId);
}
export function verifyAdminToken(token) {
  return verifyToken(token, 'admin'); 
}