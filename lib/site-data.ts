import { promises as fs } from "fs";
import path from "path";

export type Dish = { id: string; name: string; description: string; price: number; category: string; image: string; featured: boolean };
export type HotSale = { id: string; name: string; description: string; price: number; oldPrice: number; image: string; active: boolean };
export type SiteData = { brand: string; tagline: string; description: string; phone: string; address: string; hours: string; categories: string[]; dishes: Dish[]; hotSales: HotSale[] };

const dataPath = path.join(process.cwd(), "data", "site.json");
export async function getSiteData(): Promise<SiteData> {
  return JSON.parse(await fs.readFile(dataPath, "utf8")) as SiteData;
}
export async function saveSiteData(data: SiteData) {
  await fs.writeFile(dataPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}
