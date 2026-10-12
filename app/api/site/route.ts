import { NextResponse } from "next/server";
import { getSiteData, saveSiteData, type SiteData } from "../../../lib/site-data";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    return NextResponse.json(await getSiteData());
  } catch (error) {
    console.error("Unable to read site data.", error);
    return NextResponse.json({ error: "Site data is unavailable." }, { status: 500 });
  }
}
export async function PUT(request: Request) {
  try {
    if (!process.env.ADMIN_TOKEN || request.headers.get("x-admin-token") !== process.env.ADMIN_TOKEN) return NextResponse.json({ error: "Admin token is invalid." }, { status: 401 });
    const data = (await request.json()) as SiteData;
    if (!data.brand || !Array.isArray(data.dishes) || !Array.isArray(data.hotSales)) return NextResponse.json({ error: "Invalid site data." }, { status: 400 });
    await saveSiteData(data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Unable to save site data.", error);
    return NextResponse.json({ error: "Site data could not be saved." }, { status: 500 });
  }
}
