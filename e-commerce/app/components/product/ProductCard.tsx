import Link from "next/link"

type ProductCardProps = {
    discounted_percentage: number | string,
    image: string,
    title: string,
    price: number | string;
    id: number
}

export default function ProductCard({ discounted_percentage, image, title, price, id }: ProductCardProps) {
    const discountedPrice = (Number(price) * (1 - Number(discounted_percentage) / 100)).toFixed(2);

    return (
        <section className="w-[95%] p-4 relative max-w-100 mb-6 shadow-lg hover:shadow-lg rounded-lg transition-all duration-300 cursor-pointer">

            <div className="absolute -rotate-12 top-3 left-3 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-md shadow-md">
                {Number(Math.floor(Number(discounted_percentage)))}% OFF
            </div>

            <img src={image} alt={`A picture of ${title}`} loading="lazy" />

            <div className="flex gap-4 justify-between items-center">
                <h2 className="font-semibold text-[20px]">{title}</h2>

                <div className="flex items-baseline gap-3">
                    <span className="text-gray-400 line-through text-lg">${Number(price)}</span>
                    <span className="text-black/80 font-bold text-xl">${Number(discountedPrice)}</span>
                </div>
            </div>

            <Link href={`/products/${id}`}>
                <button className="mt-2 font-bold bg-[#2870d7] text-white w-full shadow-md rounded-lg py-2 cursor-pointer hover:bg-[#28C8D7] hover:shadow-lg transition-all duration-300">View Details</button>
            </Link>

        </section>
    )
}