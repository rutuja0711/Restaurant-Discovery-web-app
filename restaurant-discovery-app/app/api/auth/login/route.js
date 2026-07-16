import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createUserToken } from '@/lib/auth';

export async function POST(request) {
  const { email, password } = await request.json();

  if (!email?.trim() || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
  if (!user) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  const token = createUserToken(user.id);
  const response = NextResponse.json({ success: true, name: user.name });
  response.cookies.set('user_session', token, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
