import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { verifyUserToken } from '@/lib/auth';

export async function GET(request) {
  const token = request.cookies.get('user_session')?.value;
  const userId = verifyUserToken(token);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const bookings = await prisma.booking.findMany({
    where: { userId },
    include: { restaurant: { select: { name: true, address: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(bookings);
}
