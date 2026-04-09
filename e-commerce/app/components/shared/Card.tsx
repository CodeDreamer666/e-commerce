import Link from "next/link";
import React from "react";
import { AlertCircle, ArrowLeft } from "lucide-react"; // Optional: npm i lucide-react

type CardProps = {
    heading?: string;
    text?: string;
    buttonOneText?: string;
    buttonOnePath?: string;
    buttonTwoText?: string;
    buttonTwoPath?: string;
    onClick?: () => void;
};

export default function Card({
    heading,
    text,
    buttonOneText,
    buttonOnePath,
    buttonTwoText,
    buttonTwoPath,
    onClick
}: CardProps) {
    return (
        // Centers perfectly in the viewport
        <section className="fixed inset-0 flex items-center justify-center bg-slate-50/50 backdrop-blur-sm px-4 z-50">
            <div className="w-full max-w-md overflow-hidden bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-red-100 p-8 text-center transition-all animate-in fade-in zoom-in duration-300">
                
                {/* Error Icon Header */}
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                </div>

                <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-3">
                    {heading || "Something went wrong"}
                </h2>

                <p className="text-slate-500 leading-relaxed mb-8">
                    {text || "We couldn't process that request. Please check your connection or try again."}
                </p>

                <div className="flex flex-col gap-3">
                    {/* Primary Button */}
                    {buttonOneText && (
                        buttonOnePath ? (
                            <Link
                                href={buttonOnePath}
                                className="w-full inline-flex items-center justify-center px-6 py-3.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all shadow-sm"
                            >
                                {buttonOneText}
                            </Link>
                        ) : (
                            <button
                                onClick={onClick}
                                className="w-full inline-flex items-center justify-center px-6 py-3.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all shadow-sm"
                            >
                                {buttonOneText}
                            </button>
                        )
                    )}

                    {/* Secondary/Ghost Button */}
                    {buttonTwoText && buttonTwoPath && (
                        <Link
                            href={buttonTwoPath}
                            className="w-full inline-flex items-center justify-center px-6 py-3 text-slate-600 font-medium rounded-xl hover:bg-slate-100 transition-colors"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {buttonTwoText}
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
}