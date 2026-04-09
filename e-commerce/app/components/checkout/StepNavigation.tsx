import Link from "next/link"

export default function StepNavigation({ path }: { path?: string }) {
    return (
        <section className="flex justify-end mb-2">
            <div className="flex gap-4 max-sm:flex-col max-sm:gap-2">
                <Link
                    href="/cart"
                    className="px-4 py-2 bg-blue-600 text-center text-white font-semibold rounded-md text-lg shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md active:scale-[0.98]"
                >
                    Back to Cart
                </Link>
                {path ? (
                    <Link
                        href={path}
                        className="px-4 py-2 bg-blue-600 text-center text-white font-semibold rounded-md text-lg shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md active:scale-[0.98]"
                    >
                        Back to previous step
                    </Link>
                ) : <></>}
            </div>
        </section>
    )
}