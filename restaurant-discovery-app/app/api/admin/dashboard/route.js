import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';

export async function GET(request) {
  const token = request.cookies.get('admin_session')?.value;
  const adminId = verifyAdminToken(token);
  if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const restaurantId = Number(searchParams.get('restaurantId'));

  const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
  if (!restaurant || restaurant.ownerId !== adminId) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const [totalBookings, todaysReservations, pendingConfirmations, availableTables, bookingsWithPhone, reviews] =
    await Promise.all([
      prisma.booking.count({ where: { restaurantId } }),
      prisma.booking.count({ where: { restaurantId, slotStart: { gte: startOfDay, lte: endOfDay } } }),
      prisma.booking.count({ where: { restaurantId, status: 'pending' } }),
      prisma.restaurantTable.count({ where: { restaurantId, isActive: true } }),
      prisma.booking.findMany({ where: { restaurantId }, select: { customerPhone: true } }),
      prisma.review.findMany({ where: { restaurantId }, select: { rating: true } }),
    ]);

  const totalCustomers = new Set(bookingsWithPhone.map((b) => b.customerPhone)).size;
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '0.0';

  return NextResponse.json({
    totalBookings,
    todaysReservations,
    pendingConfirmations,
    availableTables,
   totalCustomers, 
   averageRating,
  });
}
