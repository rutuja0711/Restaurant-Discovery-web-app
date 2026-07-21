import { NextResponse } from 'next/server';
import { verifySuperadminToken, verifyAdminToken } from '@/lib/auth';
import { writeFile } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

export async function POST(request) {
  const superadminToken = request.cookies.get('superadmin_session')?.value;
  const adminToken = request.cookies.get('admin_session')?.value;

  const isSuperadmin = verifySuperadminToken(superadminToken);
  const isAdmin = verifyAdminToken(adminToken);

  if (!isSuperadmin && !isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const files = formData.getAll('images');

  if (!files.length) {
    return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
  }

  const urls = [];

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
    const filePath = path.join(process.cwd(), 'public', 'uploads', safeName);

    const converted = await sharp(buffer)
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    await writeFile(filePath, converted);
    urls.push(`/uploads/${safeName}`);
  }

  return NextResponse.json({ urls });
}
