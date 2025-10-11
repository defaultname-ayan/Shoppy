import { load } from "cheerio";
import SavingDB from "@/helper/SavingDB";

export default async function GetData(url, userId) {
  try {
    // Step 1: Try Shopify JSON
    const shopifyRes = await fetch(url + "/product.json");
    if (shopifyRes.ok) {
      const data = await shopifyRes.json();
      if (data?.product) {
        const product = {
          name: data.product.title,
          price: data.product.variants?.[0]?.price,
          images: data.product.images?.map(img => img.src),
          category: data.product.product_type || "Uncategorized",
          url,
        };
        await SavingDB(product, userId);
        return product;
      }
    }

    
    const htmlRes = await fetch(url);
    const html = await htmlRes.text();
    const $ = load(html);

    
    let productData = {};
    const jsonLd = $('script[type="application/ld+json"]').first().html();
    if (jsonLd) {
      try {
        const parsed = JSON.parse(jsonLd);
        productData = {
          name: parsed.name,
          price: parsed.offers?.price,
          images: Array.isArray(parsed.image) ? parsed.image : [parsed.image],
          category: parsed["@type"],
        };
      } catch {}
    }

   
    if (!productData.name) {
      productData.name = $('meta[property="og:title"]').attr("content");
    }
    if (!productData.images?.length) {
      const ogImage = $('meta[property="og:image"]').attr("content");
      if (ogImage) productData.images = [ogImage];
    }
    if (!productData.price) {
      productData.price = $('meta[property="product:price:amount"]').attr("content");
    }
    try{
      await SavingDB({
        ...productData,
        url,
      }, userId);
      console.log("Product data saved to DB");
    }catch(err){
      console.error("Error saving to DB:", err);
    }
    
    return productData;
  } catch (error) {
    console.error("Error fetching product:", error);
    return { error: "Could not fetch product data" };
  }
}
