"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
    product: {
        id: number;
        name: string;
        price: number;
        image: string | null;
        description: string | null;
        slug: string;
        isNew?: boolean;
    }
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();
    const router = useRouter();
    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full group">
            {/* Image Area */}
            <div className="relative aspect-square w-full p-8 flex items-center justify-center">
                {/* New Badge */}
                {product.isNew && (
                    <div className="absolute top-4 left-4 bg-[#00A528] text-white text-[10px] font-bold px-3 py-1 rounded-[2px] z-10 shadow-sm">
                        New
                    </div>
                )}

                <div className="relative w-full h-full transform transition-transform duration-500 group-hover:scale-105">
                    {product.image ? (
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-300 bg-gray-50 rounded">
                            <span className="text-xs">No Image</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className="px-6 pb-8 pt-2 flex flex-col flex-1 text-center items-center">
                <Link href={`/product/${product.slug}`} className="block w-full">
                    <h3 className="text-[16px] text-gray-600 mb-6 group-hover:text-[#b48d5e] transition-colors font-sans">
                        {product.name}
                    </h3>
                </Link>

                <div className="mt-auto w-full flex flex-col gap-2">
                    <div className="flex gap-2">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                addToCart(product);
                            }}
                            className="flex-1 bg-white border border-[#b48d5e] text-[#b48d5e] text-[12px] font-bold py-2 rounded hover:bg-[#b48d5e] hover:text-white transition-colors uppercase"
                        >
                            + Keranjang
                        </button>
                        <button
                            onClick={async (e) => {
                                e.preventDefault();
                                await addToCart(product);
                                router.push('/cart');
                            }}
                            className="flex-1 bg-[#1e3a8a] text-white text-[12px] font-bold py-2 rounded hover:bg-[#152c6e] transition-colors uppercase"
                        >
                            Beli
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
