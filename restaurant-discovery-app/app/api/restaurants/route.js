import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { verifySuperadminToken } from "@/lib/auth";
import { geocodeAddress } from "@/lib/geocode";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const location = searchParams.get("location");
  const cuisine = searchParams.get("cuisine");
  const cuisinesParam = searchParams.get("cuisines"); // comma-separated multi-select
  const minRating = Number(searchParams.get("minRating") || 0);
  const sortBy = searchParams.get("sortBy") || "popularity";
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 8);
  const noPagination = searchParams.get("all") === "true";



  const cuisineList = cuisinesParam ? cuisinesParam.split(",").filter(Boolean) : [];

  const where = {
    name: search ? { contains: search, mode: "insensitive" } : undefined,
    location: location || undefined,
    ...(cuisineList.length > 0
      ? { OR: cuisineList.map((c) => ({ cuisine: { contains: c, mode: "insensitive" } })) }
      : cuisine
      ? { cuisine: { contains: cuisine, mode: "insensitive" } }
      : {}),
  };

  const all = await prisma.restaurant.findMany({
    where,
    include: { images: true, reviews: { select: { rating: true } } },
    orderBy: { createdAt: "desc" },
  });

  let withComputedRating = all.map((r) => {
    const avgRating =
      r.reviews.length > 0
        ? r.reviews.reduce((sum, rev) => sum + rev.rating, 0) / r.reviews.length
        : 0;
    const { reviews, ...rest } = r;
    return { ...rest, rating: Number(avgRating.toFixed(1)), reviewCount: reviews.length };
  });

  if (minRating > 0) {
    withComputedRating = withComputedRating.filter((r) => r.rating >= minRating);
  }

  if (sortBy === "rating") {
    withComputedRating.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === "popularity") {
    withComputedRating.sort((a, b) => b.reviewCount - a.reviewCount);
  }

  const totalCount = withComputedRating.length;
  const totalPages = Math.ceil(totalCount / limit);

  const pageItems = noPagination
    ? withComputedRating
    : withComputedRating.slice((page - 1) * limit, page * limit);

  return NextResponse.json({
    restaurants: pageItems,
    totalCount,
    totalPages,
    currentPage: page,
  });
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
