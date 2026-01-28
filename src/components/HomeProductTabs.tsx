"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
// import { formatRupiah } from "@/lib/utils"; // Removed as we use inline helper

// Helper if utils doesn't exist
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    image: string | null;
    images?: unknown; // Accept JsonValue from Prisma
    isNew: boolean;
    category: Category;
    stockStatus: string;
}

interface Props {
    categories: Category[];
    initialProducts: Product[]; // These are "Best Seller" products or all products to filter
}

export default function HomeProductTabs({ categories, initialProducts }: Props) {
    // 1. Setup Tabs
    // We want "EMAS IMLEK" or the first category as default.
    // Let's find "Emas Imlek" id if exists, else first category.
    const defaultCat = categories.find(c => c.name === "Emas Imlek") || categories[0];
    const [activeTabId, setActiveTabId] = useState<number>(defaultCat?.id || 0);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // 2. Filter Logic
    // If the data passed in `initialProducts` contains EVERYTHING, we filter client side.
    // If getting ALL products is too heavy, we would need a server action or API.
    // Assuming for now we pass a reasonable amount of top products (e.g. 50-100) or we just fetch per click?
    // Let's assume client-side filtering of the "Best Products" list for responsiveness.

    const filteredProducts = initialProducts.filter(p => p.category.id === activeTabId);

    // If no products found for this category (maybe they are not in the 'best seller' list passed?), 
    // we might want to show empty state or fetch more. 
    // For this specific UI request "Produk Terbaik", we likely only show products that ARE best sellers AND in that category.

    return (
        <section className="py-12 container mx-auto px-4">
            {/* HEADLINE */}
            <h2 className="text-center text-[#bf9a53] font-serif text-3xl md:text-4xl font-bold mb-8 uppercase tracking-widest">
                Produk Terbaik
            </h2>

            {/* TAB NAVIGATION */}
            <div className="flex flex-col md:flex-row flex-wrap justify-center mb-8 gap-y-2 relative z-20">
                {/* MOBILE DROPDOWN */}
                <div className="md:hidden w-full px-4">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full bg-[#1e3a8a] text-white font-bold py-3 px-4 rounded flex justify-between items-center text-sm uppercase tracking-wider"
                    >
                        <span>{categories.find(c => c.id === activeTabId)?.name || "Pilih Kategori"}</span>
                        <ChevronDown size={20} className={`transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    {/* Dropdown Content */}
                    <div className={`
                        overflow-hidden transition-all duration-300 ease-in-out bg-white border border-gray-200 mt-1 rounded shadow-lg
                        ${isDropdownOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}
                    `}>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => {
                                    setActiveTabId(cat.id);
                                    setIsDropdownOpen(false);
                                }}
                                className={`
                                    w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider border-b border-gray-100 last:border-0 hover:bg-gray-50
                                    ${activeTabId === cat.id ? "text-[#1e3a8a] bg-blue-50" : "text-gray-600"}
                                `}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* DESKTOP TABS (Hidden on mobile) */}
                <div className="hidden md:inline-flex flex-wrap justify-center border border-gray-200 rounded-lg overflow-hidden divide-x divide-gray-200 bg-white shadow-sm">
                    {categories.map((cat) => {
                        const isActive = activeTabId === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setActiveTabId(cat.id)}
                                className={`
                                    px-4 md:px-6 py-3 text-xs md:text-sm font-bold uppercase tracking-wider transition-all
                                    ${isActive
                                        ? "bg-[#1e3a8a] text-white"
                                        : "bg-white text-gray-500 hover:bg-gray-50 hover:text-[#1e3a8a]"
                                    }
                                `}
                            >
                                {cat.name}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* PRODUCT GRID */}
            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-500">
                    {filteredProducts.map((product) => (
                        <Link
                            href={`/product/${product.slug}`}
                            key={product.id}
                            className="group bg-white border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-xl hover:border-[#bf9a53]/30 transition-all duration-300"
                        >
                            <div className="relative aspect-square mb-4 overflow-hidden rounded-md bg-gray-50">
                                <Image
                                    src={product.image || (product.images as string[])?.[0] || "/placeholder.jpg"}
                                    alt={product.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                {product.isNew && (
                                    <span className="absolute top-2 left-2 bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                                        NEW
                                    </span>
                                )}
                            </div>

                            <h3 className="text-gray-900 font-bold text-lg mb-1 line-clamp-2 min-h-[56px] group-hover:text-[#1e3a8a] transition-colors">
                                {product.name}
                            </h3>

                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{product.category.name}</p>
                                    <p className="text-[#bf9a53] font-serif font-bold text-xl">
                                        {formatCurrency(product.price)}
                                    </p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-[#1e3a8a] group-hover:text-white transition-all">
                                    <ArrowRight size={16} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-400 italic">Belum ada produk terbaik di kategori ini.</p>
                </div>
            )}

            <div className="mt-12 text-center">
                <Link href="/products" className="inline-flex items-center text-[#1e3a8a] font-bold hover:underline">
                    Lihat Semua Produk <ArrowRight size={16} className="ml-2" />
                </Link>
            </div>
        </section>
    );
}
