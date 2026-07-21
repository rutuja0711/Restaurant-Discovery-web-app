import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { generateSlotsForDate, getSlotEnd } from '@/lib/slots';

export async function GET(request, { params }) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const partySize = Number(searchParams.get('partySize') || 1);

  if (!date) {
    return NextResponse.json({ error: 'Date is required' }, { status: 400 });
  }

  const tables = await prisma.restaurantTable.findMany({
    where: { restaurantId: Number(id), capacity: { gte: partySize } },
  });

  if (tables.length === 0) {
    return NextResponse.json({ slots: [] });
  }

  const tableIds = tables.map((t) => t.id);
  const slots = generateSlotsForDate(date);

  const existingBookings = await prisma.booking.findMany({
    where: {
      tableId: { in: tableIds },
      slotStart: { in: slots },
      status: { not: 'declined' },
    },
    select: { tableId: true, slotStart: true },
  });

  const bookedSet = new Set(existingBookings.map((b) => `${b.tableId}_${b.slotStart.toISOString()}`));

  const availableSlots = slots
    .map((slotStart) => {
      const freeTableCount = tables.filter(
        (t) => !bookedSet.has(`${t.id}_${slotStart.toISOString()}`)
      ).length;
      return { slotStart, freeTableCount };
    })
    .filter((s) => s.freeTableCount > 0);

  return NextResponse.json({ slots: availableSlots });
}
