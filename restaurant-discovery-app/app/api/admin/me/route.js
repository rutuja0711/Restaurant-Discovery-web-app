import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';

export async function GET(request) {
  const token = request.cookies.get('admin_session')?.value;
  const adminId = verifyAdminToken(token);
  if (!adminId) return NextResponse.json({ admin: null });

  const admin = await prisma.admin.findUnique({ where: { id: adminId }, select: { id: true, name: true, email: true } });
  return NextResponse.json({ admin });
}
