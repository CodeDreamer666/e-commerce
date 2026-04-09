"use client"
import { useState } from "react"
import ProductCard from "@/app/components/product/ProductCard"
import { FullProductData } from "@/app/schemas/productData"

export default function ShopClient({ data }: { data: FullProductData }) {
    const [shopData, setShopData] = useState(data);
    const [searchInput, setSearchInput] = useState("");

    const filterShopData = shopData.filter(product => product.title.toLowerCase().includes(searchInput.trim().toLowerCase()))

    return (
        <>
            <section className="mt-20 justify-around flex w-[95%] max-w-75 mb-2 mx-auto gap-1 items-center text-lg border-2 rounded-full px-2 py-1">
                <label htmlFor="search">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </label>

                <input
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    type="text"
                    autoComplete="off"
                    id="search"
                    name="search"
                    className="outline-none px-2 rounded-full"
                />

                <button
                    onClick={() => setSearchInput("")}
                    className="font-semibold cursor-pointer mr-1">
                    X
                </button>
            </section>

            <section className="py-4 flex flex-col items-center justify-center md:grid md:grid-cols-2 md:p-8 md:gap-2 md:mx-auto md:max-w-250 lg:grid-cols-3 lg:max-w-7xl">

                {filterShopData.map(({ image, title, price, discounted_percentage, id }) => {
                    return (
                        <ProductCard
                            key={id}
                            discounted_percentage={discounted_percentage}
                            id={id}
                            image={image}
                            title={title}
                            price={price}
                        />
                    )
                })}

            </section>
        </>
    )
}