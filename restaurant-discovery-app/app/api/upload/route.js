import { NextResponse } from 'next/server';
import { verifySuperadminToken } from '@/lib/auth';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request) {
  const token = request.cookies.get('superadmin_session')?.value;
  if (!verifySuperadminToken(token)) {
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

    const ext = path.extname(file.name) || '.jpg';
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    const filePath = path.join(process.cwd(), 'public', 'uploads', safeName);

    await writeFile(filePath, buffer);
    urls.push(`/uploads/${safeName}`);
  }

  return NextResponse.json({ urls });
}
