import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { createSuperadminToken } from '@/lib/auth';

export async function POST(request) {
  const { username , password } = await request.json();

  const validUsername = username === process.env.SUPERADMIN_USERNAME;
  const validPassword = await bcrypt.compare(password, process.env.SUPERADMIN_PASSWORD_HASH);

  if (!validUsername || !validPassword) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = createSuperadminToken();
  const response = NextResponse.json({ success: true });
  response.cookies.set('superadmin_session', token, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 4,
  });
  return response;
}
