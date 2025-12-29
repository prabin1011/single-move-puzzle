// src/app/api/landmark-images/route.ts
import { NextRequest, NextResponse } from "next/server";

// Simple Wikimedia image search for a given landmark
const WIKI_ENDPOINT = "https://en.wikipedia.org/w/api.php";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title");
  const limit = searchParams.get("limit") ?? "10";

  if (!title) {
    return NextResponse.json({ error: "Missing title param" }, { status: 400 });
  }

  // This uses the Wikipedia search API to find pages related to the landmark,
  // then we ask for their thumbnails.
  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: title,
    gsrlimit: limit,
    prop: "pageimages",
    piprop: "thumbnail",
    pithumbsize: "600", // smaller = faster
    format: "json",
    origin: "*" // allow cross-origin
  });

  const res = await fetch(`${WIKI_ENDPOINT}?${params.toString()}`);
  if (!res.ok) {
    return NextResponse.json({ images: [], error: "Failed to fetch images" }, { status: 500 });
  }

  const data = await res.json();

  const pages = data?.query?.pages ?? {};
  const images: string[] = [];

  for (const key of Object.keys(pages)) {
    const thumb = pages[key]?.thumbnail?.source;
    if (thumb && !images.includes(thumb)) {
      images.push(thumb);
    }
  }

  // Shuffle a bit so “next image” feels random
  images.sort(() => Math.random() - 0.5);

  return NextResponse.json({ images });
}
