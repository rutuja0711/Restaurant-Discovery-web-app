import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { createSessionToken } from '@/lib/auth';

export async function POST(request) {
  const { username, password } = await request.json();

  const validUsername = username === process.env.ADMIN_USERNAME;
  const validPassword = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);

  if (!validUsername || !validPassword) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = createSessionToken();
  const response = NextResponse.json({ success: true });
  response.cookies.set('admin_session', token, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 4,
  });
  return response;
}
