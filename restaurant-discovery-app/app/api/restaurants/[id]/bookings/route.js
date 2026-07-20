import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  const { id } = await params;
  const body = await request.json();

  if (!body.customerName?.trim() || !body.customerPhone?.trim() || !body.partySize || !body.bookingDate || !body.bookingTime) {
    return NextResponse.json({ error: 'Please fill in all required fields' }, { status: 400 });
  }

  const booking = await prisma.booking.create({
    data: {
      restaurantId: Number(id),
      customerName: body.customerName.trim(),
      customerPhone: body.customerPhone.trim(),
      partySize: Number(body.partySize),
      bookingDate: body.bookingDate,
      bookingTime: body.bookingTime,
      notes: body.notes?.trim() || null,
    },
  });

  return NextResponse.json(booking, { status: 201 });
}
