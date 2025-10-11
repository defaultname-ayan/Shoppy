import { configDotenv } from "dotenv";
import ConnectDB from "./ConnectDB";
import Product from "./ProdSchema";

const SavingDB = async (data, userId) => {
  configDotenv();
  await ConnectDB();
  try {
    const productData = {
      ...data,
      user: userId
    };
    const created = await Product.create(productData);
    console.log("Product saved:", created.name);
  } catch (error) {
    if (error?.code === 11000) {
      console.log("Duplicate URL for this user, product not saved:", data.url);
    } else {
      console.error("Error saving product:", error);
    }
  }
};

export default SavingDB;