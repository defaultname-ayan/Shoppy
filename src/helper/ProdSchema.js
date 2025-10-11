import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    images: { type: [String], required: true },
    category: { type: String, required: false, default: "Uncategorized" },
    url: { type: String, required: true },
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
  },
  { timestamps: true }
);

// Compound index to ensure unique URL per user
ProductSchema.index({ url: 1, user: 1 }, { unique: true });

// Re-use model if it already exists (prevents OverwriteModelError in dev)
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;