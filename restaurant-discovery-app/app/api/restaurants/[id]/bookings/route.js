import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getSlotEnd } from '@/lib/slots';

export async function POST(request, { params }) {
  const { id } = await params;
  const body = await request.json();

  if (!body.customerName?.trim() || !body.customerPhone?.trim() || !body.partySize || !body.slotStart) {
    return NextResponse.json({ error: 'Please fill in all required fields' }, { status: 400 });
  }

  const restaurantId = Number(id);
  const partySize = Number(body.partySize);
  const slotStart = new Date(body.slotStart);
  const slotEnd = getSlotEnd(slotStart);

  const candidateTables = await prisma.restaurantTable.findMany({
    where: { restaurantId, capacity: { gte: partySize } },
    orderBy: { capacity: 'asc' }, 
  });

  if (candidateTables.length === 0) {
    return NextResponse.json({ error: 'No table available for this party size' }, { status: 409 });
  }

  // Try each candidate table in order; the unique constraint on (tableId, slotStart)
  // guarantees no two requests can ever double-book the same table+slot, even under a race.
  for (const table of candidateTables) {
    try {
      const booking = await prisma.booking.create({
        data: {
          restaurantId,
          tableId: table.id,
          customerName: body.customerName.trim(),
          customerPhone: body.customerPhone.trim(),
          partySize,
          slotStart,
          slotEnd,
        },
      });
      return NextResponse.json(booking, { status: 201 });
    } catch (err) {
      // P2002 = unique constraint violation, this table+slot just got taken, try the next table
      if (err.code === 'P2002') continue;
      throw err;
    }
  }

  return NextResponse.json({ error: 'This time slot just got fully booked. Please pick another.' }, { status: 409 });
}
