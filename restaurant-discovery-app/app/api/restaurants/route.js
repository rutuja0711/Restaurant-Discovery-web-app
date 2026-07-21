import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { verifySuperadminToken } from "@/lib/auth";
import { geocodeAddress } from "@/lib/geocode";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const location = searchParams.get("location");
  const cuisine = searchParams.get("cuisine");

  const restaurants = await prisma.restaurant.findMany({
    where: {
      name: search ? { contains: search, mode: "insensitive" } : undefined,
      location: location || undefined,
      cuisine: cuisine ? { contains: cuisine, mode: "insensitive" } : undefined,
    },
    include: { images: true, reviews: { select: { rating: true } } },
    orderBy: { createdAt: "desc" },
  });

  const withComputedRating = restaurants.map((r) => {
    const avgRating =
      r.reviews.length > 0
        ? r.reviews.reduce((sum, rev) => sum + rev.rating, 0) / r.reviews.length
        : 0;
    const { reviews, ...rest } = r;
    return { ...rest, rating: Number(avgRating.toFixed(1)), reviewCount: reviews.length };
  });

  return NextResponse.json(withComputedRating);
}

export async function POST(request) {
  const token = request.cookies.get("superadmin_session")?.value;
  if (!verifySuperadminToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (!body.name || !body.cuisine || !body.location) {
    return NextResponse.json(
      { error: "name, cuisine and location are required" },
      { status: 400 },
    );
  }

  const { imageUrls, menuItems, ...restaurantData } = body;

  const fullAddress = `${restaurantData.address}, ${restaurantData.location}`;
  const coords = await geocodeAddress(fullAddress);
  if (coords) {
    restaurantData.latitude = coords.lat;
    restaurantData.longitude = coords.lng;
  }

  const restaurant = await prisma.restaurant.create({
    data: {
      ...restaurantData,
      images: imageUrls?.length
        ? {
            create: imageUrls.map((url, i) => ({
              imageUrl: url,
              isPrimary: i === 0,
            })),
          }
        : undefined,
      menuItems: menuItems?.length ? { create: menuItems } : undefined,
    },
  });

  return NextResponse.json(restaurant, { status: 201 });
}
