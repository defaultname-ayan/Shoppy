import mongoose from "mongoose";
import Product from "@/helper/ProdSchema";
import ConnectDB from "@/helper/ConnectDB";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await ConnectDB();

        const body = await request.json();
        
        const { name, price, images, category, url, user } = body;

        if (!name || !price || !images || !url || !user) {
            return NextResponse.json(
                { error: "Missing required fields: name, price, images, url, or user" },
                { status: 400 }
            );
        }

        

        if (typeof price !== 'number' || price <= 0) {
            return NextResponse.json(
                { error: "Price must be a positive number" },
                { status: 400 }
            );
        }

        if (!mongoose.Types.ObjectId.isValid(user)) {
            return NextResponse.json(
                { error: "Invalid user ID format" },
                { status: 400 }
            );
        }

        const existingProduct = await Product.findOne({ url, user });
        if (existingProduct) {
            return NextResponse.json(
                { error: "Product with this URL already exists for this user" },
                { status: 409 }
            );
        }

        const newProduct = await Product.create({
            name,
            price,
            images,
            category: category || "Uncategorized",
            url,
            user: new mongoose.Types.ObjectId(user)
        });

        return NextResponse.json(
            { 
                message: "Product created successfully", 
                product: newProduct 
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Error creating product:", error);

        if (error.name === 'ValidationError') {
            return NextResponse.json(
                { error: "Validation failed", details: error.message },
                { status: 400 }
            );
        }

        if (error.code === 11000) {
            return NextResponse.json(
                { error: "Duplicate entry: Product already exists" },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: "Internal server error", details: error.message },
            { status: 500 }
        );
    }
}
