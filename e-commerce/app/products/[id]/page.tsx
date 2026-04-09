import fetchAndValidateData from "@/app/lib/fetchAndValidateData"
import { productIdDataSchema } from "@/app/schemas/productDetailData";
import { reviewsDataSchema } from "@/app/schemas/reviewData";
import ProductIdClient from "./pageClient";
import { notFound } from "next/navigation";

type Params = {
    params: {
        id: string
    }
}

export default async function ProductId({ params }: Params) {
    const { id } = await params;

    const productIdData = await fetchAndValidateData({
        url: `${process.env.NEXT_PUBLIC_API_URL}/products/${Number(id)}`,
        idealSchema: productIdDataSchema,
        option: "ISR"
    });

    const reviewsData = await fetchAndValidateData({
        url: `${process.env.NEXT_PUBLIC_API_URL}/reviews/${Number(id)}`,
        idealSchema: reviewsDataSchema,
        option: "ISR"
    });

    if (!productIdData) {
        notFound();
    }

    return (
        <ProductIdClient productIdData={productIdData} reviewsData={reviewsData ?? []} />
    )
}
