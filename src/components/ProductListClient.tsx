"use client";

import { useState } from "react";
import Image from "next/image";
import { Product } from "@/lib/products";
import { clsx } from "clsx";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";

export default function ProductListClient({
    products,
    title = "Beli Emas",
    bannerImage = "/gold-banner.png"
}: {
    products: Product[],
    title?: string,
    bannerImage?: string
}) {
    const [quantities, setQuantities] = useState<Record<number, number>>({});

    // Helper to update quantity
    const updateQuantity = (id: number, delta: number) => {
        setQuantities(prev => {
            const current = prev[id] || 0;
            const next = Math.max(0, current + delta);
            const newState = { ...prev, [id]: next };
            if (next === 0) delete newState[id];
            return newState;
        });
    };

    const handleInputChange = (id: number, val: string) => {
        const num = parseInt(val) || 0;
        setQuantities(prev => {
            if (num <= 0) {
                const { [id]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [id]: num };
        });
    };

    // Calculate Totals
    const totalItems = Object.values(quantities).reduce((a, b) => a + b, 0);
    const totalPrice = products.reduce((sum, p) => sum + (p.price * (quantities[p.id] || 0)), 0);
    const tax = totalPrice * 0.00; // Assuming 0 for now or user can config later
    const grandTotal = totalPrice + tax;

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="mb-8">
                {/* Generated Luxury Banner */}
                <div className="w-full h-48 relative rounded-2xl overflow-hidden mb-8 shadow-lg">
                    <Image
                        src={bannerImage}
                        alt={`${title} Banner`}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/20"></div> {/* Subtle overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white drop-shadow-md tracking-widest uppercase">
                            {title.includes("Beli") ? title.replace("Beli", "Koleksi") : `Koleksi ${title}`}
                        </h2>
                    </div>
                </div>

                <div className="mb-8">
                    <h1 className="text-3xl font-serif font-bold text-secondary mb-2">{title}</h1>
                    <p className="text-gray-500 max-w-3xl">
                        Produk {title} dari ANTAM LM terjamin keaslian dan kemurniannya. Segera miliki koleksi terbaik kami dengan harga kompetitif.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* LEFT: Product List */}
                    <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-primary px-6 py-4 text-white font-bold flex justify-between">
                            <span>Produk</span>
                            <div className="hidden md:flex gap-16 pr-8">
                                <span>Harga</span>
                                <span>Kuantitas</span>
                            </div>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {products.map(product => {
                                const qty = quantities[product.id] || 0;
                                const isReady = product.stockStatus === "READY";

                                return (
                                    <div key={product.id} className="p-6 flex flex-col md:flex-row items-center gap-6">
                                        {/* Image & Name */}
                                        <div className="flex items-center gap-4 flex-1 w-full">
                                            <div className="bg-gray-50 p-2 rounded-md">
                                                {/* Fallback image logic if null */}
                                                <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-300 rounded-full flex items-center justify-center text-[10px] text-yellow-700 font-bold">
                                                    {product.image ? <Image src={product.image} alt={product.name} width={64} height={64} className="object-cover" /> : "FOTO"}
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-800">{product.name}</h3>
                                                {!isReady && <span className="text-xs text-red-500 font-bold">Stok Habis</span>}
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="w-full md:w-32 font-bold text-secondary text-lg text-right md:text-left">
                                            Rp {product.price.toLocaleString('id-ID')}
                                        </div>

                                        {/* Quantity Input */}
                                        <div className="w-full md:w-40 flex justify-end">
                                            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                                                <button
                                                    onClick={() => updateQuantity(product.id, -1)}
                                                    disabled={!isReady || qty === 0}
                                                    className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                                                >
                                                    {qty === 1 ? <Trash2 size={16} className="text-red-500" /> : <Minus size={16} />}
                                                </button>
                                                <input
                                                    type="number"
                                                    value={qty}
                                                    onChange={(e) => handleInputChange(product.id, e.target.value)}
                                                    disabled={!isReady}
                                                    className="w-14 h-10 text-center border-x border-gray-300 focus:outline-none appearance-none m-0"
                                                />
                                                <button
                                                    onClick={() => updateQuantity(product.id, 1)}
                                                    disabled={!isReady}
                                                    className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* RIGHT: Summary Sidebar */}
                    <div className="w-full lg:w-96">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 sticky top-24 p-6">
                            <h3 className="font-serif font-bold text-xl text-primary mb-6 border-b pb-4">Harga Total</h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Total Barang ({totalItems})</span>
                                    <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Pajak (0%)</span>
                                    <span>Rp 0</span>
                                </div>
                                <div className="border-t pt-3 flex justify-between font-bold text-xl text-secondary">
                                    <span>Total</span>
                                    <span>Rp {grandTotal.toLocaleString('id-ID')}</span>
                                </div>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-xs text-yellow-800 mb-6">
                                *Jika tidak memiliki NPWP atas nama Anda maka tidak perlu mengisi kolom NPWP.
                            </div>

                            <button
                                disabled={totalItems === 0}
                                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-md flex items-center justify-center transition-all shadow-lg hover:shadow-green-600/30"
                            >
                                <ShoppingCart size={18} className="mr-2" />
                                Tambah ke Keranjang
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
