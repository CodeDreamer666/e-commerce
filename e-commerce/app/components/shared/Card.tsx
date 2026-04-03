import Link from "next/link"
import React from "react"

type CardProps = {
    heading?: string
    text?: string
    children?: React.ReactNode
    className?: string
    buttonOneText?: string
    buttonOnePath?: string
    buttonTwoText?: string
    buttonTwoPath?: string
    onClick?: () => void
}

export default function Card({
    heading,
    text,
    children,
    className = "",
    buttonOneText,
    buttonOnePath,
    buttonTwoText,
    buttonTwoPath,
    onClick
}: CardProps) {
    return (
        <section className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
            <div
                className={`w-full max-w-100 border border-gray-200 rounded-lg shadow-lg p-6 bg-white ${className}`}
            >

                <h2 className="text-xl font-bold text-gray-800 mb-2">
                    {heading}
                </h2>


                <p className="text-gray-600 mb-4">
                    {text}
                </p>

                {children}

                {(buttonOneText || buttonTwoText) && (
                    <div className="flex flex-col gap-2 mt-6">
                        {buttonOnePath && buttonOneText && (
                            <Link
                                href={buttonOnePath}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center"
                            >
                                {buttonOneText}
                            </Link>
                        )}

                        {!buttonOnePath && buttonOneText && (
                            <button
                                onClick={onClick}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                {buttonOneText}
                            </button>
                        )}

                        {buttonTwoPath && buttonTwoText && (
                            <Link
                                href={buttonTwoPath}
                                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-400 transition-colors text-center"
                            >
                                {buttonTwoText}
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </section>
    )
}