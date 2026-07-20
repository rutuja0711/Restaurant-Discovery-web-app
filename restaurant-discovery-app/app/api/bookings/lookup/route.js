import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get('phone');

  if (!phone?.trim()) {
    return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
  }

  const bookings = await prisma.booking.findMany({
    where: { customerPhone: phone.trim() },
    include: { restaurant: { select: { name: true, address: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(bookings);
}
