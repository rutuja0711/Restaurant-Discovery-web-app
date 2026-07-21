import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';

export async function DELETE(request, { params }) {
  const token = request.cookies.get('admin_session')?.value;
  const adminId = verifyAdminToken(token);
  if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const table = await prisma.restaurantTable.findUnique({ where: { id: Number(id) }, include: { restaurant: true } });
  if (!table || table.restaurant.ownerId !== adminId) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.restaurantTable.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}
