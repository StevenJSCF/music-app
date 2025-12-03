import { NextResponse } from "next/server";
import { getSongData } from "@/lib/action/searchSong";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const lookup = searchParams.get("lookup");
  const limit = searchParams.get("limit");

  if (!type || !lookup) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  try {
    const data = await getSongData(type, lookup, limit || undefined);
    return NextResponse.json(data);
  } catch (error: any) {
    const message = error?.message || "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
