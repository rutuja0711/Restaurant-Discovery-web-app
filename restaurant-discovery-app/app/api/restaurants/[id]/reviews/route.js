import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  const { id } = await params;
  const body = await request.json();

  if (!body.reviewerName?.trim() || !body.comment?.trim() || !body.rating) {
    return NextResponse.json({ error: 'Name, rating and comment are required' }, { status: 400 });
  }
  if (body.rating < 1 || body.rating > 5) {
    return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
  }

  const review = await prisma.review.create({
    data: {
      reviewerName: body.reviewerName.trim(),
      rating: Number(body.rating),
      comment: body.comment.trim(),
      restaurantId: Number(id),
    },
  });

  return NextResponse.json(review, { status: 201 });
}
