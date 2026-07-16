import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';


export async function GET(request, { params }) {
  const { id } = await params;
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: Number(id) },
    include :{images:true},
  });

  if (!restaurant) {
    return NextResponse.json({ error: 'Restaurant not found' }, { status:404 });
  }
  return NextResponse.json(restaurant);
}

export async function PUT(request, { params }) {
  const body = await request.json();

  if (!body.name || !body.cuisine || !body.location) {
    return NextResponse.json({ error: 'name, cuisine and location are required' }, { status: 400 });
  }

  const restaurant = await prisma.restaurant.update({
    where: { id: Number(params.id) },
    data: body,
  });
  return NextResponse.json(restaurant);
}

export async function DELETE(request, { params }) {
  await prisma.restaurant.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ success: true });
}

