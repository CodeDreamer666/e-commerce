import fetchAndValidateData from "./lib/fetchAndValidateData";
import { fullProductData } from "@/app/schemas/productData";
import ShopClient from "./pageClient";

export default async function Shop() {
  const productsData = await fetchAndValidateData({
    url: `${process.env.NEXT_PUBLIC_API_URL}/products`,
    idealSchema: fullProductData,
    option: "ISR"
  });

  return <ShopClient data={productsData ?? []} />
}