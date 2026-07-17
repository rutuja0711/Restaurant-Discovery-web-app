import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createAdminToken } from '@/lib/auth';

export async function POST(request) {
  const { email, password } = await request.json();

  if (!email?.trim() || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  const admin = await prisma.admin.findUnique({ where: { email: email.trim().toLowerCase() } });
  if (!admin) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  const validPassword = await bcrypt.compare(password, admin.passwordHash);
  if (!validPassword) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  const token = createAdminToken(admin.id);
  const response = NextResponse.json({ success: true, name: admin.name });
  response.cookies.set('admin_session', token, { httpOnly: true, sameSite: 'strict', maxAge: 60 * 60 * 24 * 7 });
  return response;
}
