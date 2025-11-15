import { NextResponse } from "next/server";
import { getSongData } from "@/app/lib/action/searchSong";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const lookup = searchParams.get("lookup");

  if (!type || !lookup) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  try {
    const data = await getSongData(type, lookup);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
