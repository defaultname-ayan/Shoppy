import { load } from "cheerio";
import { GoogleGenAI } from "@google/genai";
import SavingDB from "@/helper/SavingDB";

export default async function GetData(url, userId) {
  try {
    // First attempt: Shopify product JSON
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

    // Second attempt: Enhanced HTML scraping with Myntra-specific selectors
    const htmlRes = await fetch(url);
    const html = await htmlRes.text();
    const $ = load(html);

    let productData = {};
    
    // Try JSON-LD extraction first
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

    // Enhanced name extraction with Myntra-specific selectors
    if (!productData.name) {
      productData.name = 
        $('h1.pdp-title').text().trim() || // Myntra specific
        $('meta[property="og:title"]').attr("content") ||
        $('h1').first().text().trim() ||
        $('title').text().trim();
    }

    // Enhanced price extraction with Myntra-specific selectors
    if (!productData.price) {
      let priceText = 
        $('.pdp-price strong').text().trim() || // Myntra specific - ₹491 inside <strong>
        $('.pdp-price').text().trim() || // Myntra fallback
        $('meta[property="product:price:amount"]').attr("content") ||
        $('.price, .cost, [class*="price"], [class*="cost"]').first().text().trim();
      
      // Extract numeric value from price text (remove ₹, commas, etc.)
      if (priceText) {
        const priceMatch = priceText.match(/[\d,]+\.?\d*/);
        productData.price = priceMatch ? priceMatch[0].replace(/,/g, '') : priceText;
      }
    }

    // Enhanced image extraction with background-image support for Myntra
    if (!productData.images?.length) {
      let images = [];
      
      // Extract from background-image styles (Myntra specific)
      $('.image-grid-image').each((i, elem) => {
        const style = $(elem).attr('style');
        if (style && style.includes('background-image')) {
          // Extract URL from background-image: url("...")
          const urlMatch = style.match(/background-image:\s*url\(['"]?([^'"]+)['"]?\)/);
          if (urlMatch && urlMatch[1]) {
            images.push(urlMatch[1]);
          }
        }
      });
      
      // Fallback to traditional img src and og:image
      if (images.length === 0) {
        $('img').each((i, elem) => {
          const src = $(elem).attr('src');
          if (src && src.startsWith('http')) {
            images.push(src);
          }
        });
        
        const ogImage = $('meta[property="og:image"]').attr("content");
        if (ogImage) images.push(ogImage);
      }
      
      productData.images = images.length > 0 ? images : [];
    }

    // Category extraction
    if (!productData.category) {
      productData.category = 
        $('nav.breadcrumbs a').last().text().trim() || // Breadcrumb-based category
        $('meta[property="product:category"]').attr("content") ||
        "Uncategorized";
    }

    // Check if we got sufficient data from enhanced scraping
    const hasGoodData = productData.name && productData.price;
    
    if (hasGoodData) {
      try {
        await SavingDB({
          ...productData,
          url,
          extractedBy: "enhanced_scraping"
        }, userId);
        console.log("Product data saved to DB (enhanced scraping)");
        return productData;
      } catch (err) {
        console.error("Error saving to DB:", err);
      }
    }

    // Third attempt: Gemini API fallback
    console.log("Enhanced scraping insufficient, trying Gemini API...");
    
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable not set");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Limit HTML content but focus on relevant sections
    const limitedHtml = html.substring(0, 8000);
    
    const prompt = `
Extract product information from this Myntra/e-commerce HTML content and return it as valid JSON with these exact fields:
{
  "name": "string - product title/name",
  "price": "string or number - product price (numeric value only, like 491 for ₹491)",
  "images": "array - complete product image URLs (look for background-image CSS properties too)",
  "category": "string - product category or type"
}

Special Instructions for Myntra:
- Price is often in <span class="pdp-price"><strong>₹491</strong></span> format - extract just the number
- Images may be in background-image CSS style properties, not just <img> tags
- Look for complete URLs starting with https://assets.myntassets.com/
- Product name is usually in <h1 class="pdp-title">
- Return '0' for price if not found, empty array for images if none found
- Return ONLY the JSON object, no markdown formatting

HTML Content:
${limitedHtml}
`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt
      });
      
      const geminiText = response.text;
      console.log("Gemini API response:", geminiText);
      
      // Clean the response by removing markdown formatting
      function cleanMarkdown(text) {
        let cleaned = text.trim();
        
        if (cleaned.startsWith('```')) {
          cleaned = cleaned.substring(7);
        }
        if (cleaned.startsWith('```')) {
          cleaned = cleaned.substring(3);
        }
        if (cleaned.endsWith('```')) {
          cleaned = cleaned.substring(0, cleaned.length - 3);
        }
        
        cleaned = cleaned.split('`').join('');
        
        return cleaned.trim();
      }
      
      const cleanedText = cleanMarkdown(geminiText);
      console.log("Cleaned JSON text:", cleanedText);
      
      const geminiData = JSON.parse(cleanedText);
      
      // Validate and merge the extracted data
      const finalProductData = {
        name: geminiData.name || productData.name || "Unknown Product",
        price: geminiData.price || productData.price || "0",
        images: (geminiData.images && Array.isArray(geminiData.images) && geminiData.images.length > 0) 
          ? geminiData.images.filter(img => img && img.startsWith('http')) 
          : (productData.images || []),
        category: geminiData.category || productData.category || "Uncategorized",
        url,
        extractedBy: "gemini"
      };

      // Validate that we have meaningful data
      if (finalProductData.name && finalProductData.name !== "Unknown Product") {
        await SavingDB(finalProductData, userId);
        console.log("Product data saved to DB (Gemini extraction)");
        return finalProductData;
      } else {
        throw new Error("Insufficient product data from Gemini");
      }
      
    } catch (geminiError) {
      console.error("Gemini API extraction failed:", geminiError);
      
      // Fall back to whatever data we could extract traditionally
      if (productData.name) {
        try {
          const fallbackData = {
            name: productData.name,
            price: productData.price || "0",
            images: productData.images || [],
            category: productData.category || "Uncategorized",
            url,
            extractedBy: "partial"
          };
          
          await SavingDB(fallbackData, userId);
          console.log("Product data saved to DB (partial data)");
          return fallbackData;
        } catch (err) {
          console.error("Error saving partial data to DB:", err);
        }
      }
    }
    
    return { error: "Could not extract sufficient product data" };
    
  } catch (error) {
    console.error("Error fetching product:", error);
    return { error: "Could not fetch product data" };
  }
}
