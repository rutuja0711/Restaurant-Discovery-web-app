import { NextResponse } from 'next/server';
import { verifySuperadminToken } from '@/lib/auth';

export async function GET(request) {
  const token = request.cookies.get('superadmin_session')?.value;
  if (!verifySuperadminToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ success: true });
}