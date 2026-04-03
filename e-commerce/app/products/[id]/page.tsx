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
        url: `http://localhost:8000/products/${Number(id)}`,
        idealSchema: productIdDataSchema,
        option: "ISR"
    });

    const reviewsData = await fetchAndValidateData({
        url: `http://localhost:8000/reviews/${Number(id)}`,
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
