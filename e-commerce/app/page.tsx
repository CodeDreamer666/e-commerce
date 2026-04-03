import fetchAndValidateData from "./lib/fetchAndValidateData";
import { fullProductData } from "@/app/schemas/productData";
import ShopClient from "./pageClient";

export default async function Shop() {
  const productsData = await fetchAndValidateData({
    url: "http://localhost:8000/products",
    idealSchema: fullProductData,
    option: "ISR"
  });

  return <ShopClient data={productsData ?? []} />
}