import { NextResponse } from "next/server";
import ConnectDB from "@/helper/ConnectDB";
import Product from "@/helper/ProdSchema";
import { verifyToken, getTokenFromRequest } from "@/helper/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request) {
  try {
    // Verify authentication
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await ConnectDB();
    // Fetch products only for the authenticated user
    const products = await Product.find({ user: payload.userId }).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
