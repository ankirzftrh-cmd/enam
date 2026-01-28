"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { clsx } from "clsx";

interface Product {
    id: number;
    name: string;
    slug: string;
    image: string | null;
    price: number;
    categoryId: number;
    category?: { name: string };
    isNew: boolean;
    stockStatus: string;
}

interface Category {
    id: number;
    name: string;
}

interface ProductShowcaseProps {
    products: Product[];
    categories: Category[];
}

export default function ProductShowcase({ products = [], categories = [] }: ProductShowcaseProps) {
    const [activeTab, setActiveTab] = useState("ALL");

    // Filter Logic
    const filteredProducts = activeTab === "ALL"
        ? products
        : products.filter(p => p.category?.name === activeTab);

    return (
        <section className="bg-white py-12 md:py-20">
            <div className="container mx-auto px-4">
                {/* Title */}
                <h2 className="text-center text-[#b48d5e] font-serif text-3xl md:text-4xl font-bold mb-10 tracking-wide">
                    Produk Terbaik
                </h2>

                {/* Tabs / Pills Navigation */}
                <div className="flex flex-wrap justify-center gap-2 mb-12 border-b border-gray-200 w-full md:w-fit mx-auto pb-4">
                    <button
                        onClick={() => setActiveTab("ALL")}
                        className={clsx(
                            "px-4 py-2 text-[11px] font-bold uppercase transition-all rounded-full",
                            activeTab === "ALL"
                                ? "bg-[#1e3a8a] text-white"
                                : "text-gray-500 hover:text-[#b48d5e] hover:bg-gray-100"
                        )}
                    >
                        SEMUA
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveTab(cat.name)}
                            className={clsx(
                                "px-4 py-2 text-[11px] font-bold uppercase transition-all rounded-full",
                                activeTab === cat.name
                                    ? "bg-[#1e3a8a] text-white"
                                    : "text-gray-500 hover:text-[#b48d5e] hover:bg-gray-100"
                            )}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Product Grid */}
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="group flex flex-col items-center">
                                <div className="relative w-full aspect-square md:aspect-[4/3] mb-6 p-8 bg-white flex items-center justify-center border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                    {/* New Label */}
                                    {product.isNew && (
                                        <div className="absolute top-2 left-2 bg-[#00a651] text-white text-[10px] font-bold px-3 py-1 rounded-sm uppercase z-10">
                                            New
                                        </div>
                                    )}

                                    {/* Stock Status */}
                                    {product.stockStatus !== "READY" && (
                                        <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-sm uppercase z-10">
                                            Habis
                                        </div>
                                    )}

                                    {/* Image */}
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={product.image || "/placeholder.jpg"} // Fallback image
                                            alt={product.name}
                                            fill
                                            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                </div>

                                {/* Info */}
                                <h3 className="text-gray-700 font-serif text-lg mb-2 text-center group-hover:text-[#1e3a8a] transition-colors line-clamp-2 px-4">
                                    {product.name}
                                </h3>

                                <p className="text-[#b48d5e] font-bold mb-4">
                                    Rp {product.price.toLocaleString("id-ID")}
                                </p>

                                <Link
                                    href={`/product/${product.slug}`}
                                    className="text-[#1e3a8a] font-bold text-xs uppercase border border-[#1e3a8a] px-6 py-2 rounded hover:bg-[#1e3a8a] hover:text-white transition-colors"
                                >
                                    Lihat Detail
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-lg">
                        <p className="text-gray-500 text-lg">Thinking...</p>
                        <p className="text-gray-400 text-sm">Belum ada produk di kategori ini.</p>
                    </div>
                )}

                {/* View All Logic - Optional */}
                <div className="mt-16 text-center">
                    <Link href="/products" className="inline-block border border-[#b48d5e] text-[#b48d5e] hover:bg-[#b48d5e] hover:text-white transition-all font-bold uppercase text-xs px-8 py-3 rounded-sm tracking-widest">
                        Lihat Semua Produk
                    </Link>
                </div>
            </div>
        </section>
    );
}
