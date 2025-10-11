import GetData from "./Getdata.js";
import { verifyToken, getTokenFromRequest } from "@/helper/auth";

export const runtime = "nodejs"; // ensure Node.js runtime (required for mongoose/dotenv)
export const dynamic = "force-dynamic"; // disable caching for dynamic scraping
export const revalidate = 0;

export async function POST(req) {
  try {
    // Verify authentication
    const token = getTokenFromRequest(req);
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
    }

    const { url } = await req.json();
    if (!url) {
      return new Response(JSON.stringify({ error: "No URL provided" }), { status: 400 });
    }

    const data = await GetData(url, payload.userId);
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error("API error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
