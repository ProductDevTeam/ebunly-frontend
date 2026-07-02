import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

const ALLOWED_TAGS = new Set(["occasions", "categories"]);

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const tag = searchParams.get("tag");

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!tag || !ALLOWED_TAGS.has(tag)) {
    return NextResponse.json({ error: "Invalid tag" }, { status: 400 });
  }

  revalidateTag(tag);
  return NextResponse.json({ revalidated: true, tag });
}
