import mongoose from "mongoose";
import Product from "@/helper/ProdSchema.js";

export async function DELETE(request) {
  try {
    
    const { productId } = await request.json();
    
    if (!productId) {
      return Response.json(
        { 
          success: false, 
          message: "Product ID is required" 
        }, 
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return Response.json(
        { 
          success: false, 
          message: "Invalid product ID format" 
        }, 
        { status: 400 }
      );
    }

    // Connect to MongoDB (if not already connected)
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    // Delete the product
    const result = await Product.deleteOne({ _id: productId });
    
    if (result.deletedCount > 0) {
      return Response.json(
        {
          success: true,
          message: "Product deleted successfully",
          deletedCount: result.deletedCount
        }, 
        { status: 200 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Product not found"
        }, 
        { status: 404 }
      );
    }
    
  } catch (error) {
    console.error("Delete API error:", error);
    
    return Response.json(
      { 
        success: false, 
        message: "Internal server error",
        error: error.message 
      }, 
      { status: 500 }
    );
  }
}
