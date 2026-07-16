import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { verifyUserToken } from '@/lib/auth';

export async function GET(request) {
  const token = request.cookies.get('user-session')?.value;

  const userId = verifyUserToken(token);

  if (!userId) {
    return NextResponse.json({ user: null });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true },
  });

  return NextResponse.json({ user });
}
