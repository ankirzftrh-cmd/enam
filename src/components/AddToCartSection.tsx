"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddToCartSection({ product }: { product: any }) {
    const { addToCart, isLoading } = useCart();
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = async () => {
        setIsAdding(true);
        await addToCart(product, quantity);
        // Maybe show toast? For now just small delay then reset adding state
        setTimeout(() => {
            setIsAdding(false);
            alert("Produk berhasil masuk keranjang");
        }, 500);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Varian</label>
                    <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#b48d5e]">
                        <option>{product.name}</option>
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Jumlah</label>
                    <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#b48d5e]"
                    />
                </div>
            </div>

            <div className="flex gap-4 pt-4">
                <button className="flex items-center justify-center gap-2 px-6 py-3 border border-blue-600 text-blue-600 font-bold rounded hover:bg-blue-50 transition w-full lg:w-auto">
                    <Heart size={18} /> Tambah ke Daftar Keinginan
                </button>

                <button
                    onClick={handleAddToCart}
                    disabled={isAdding || product.stockStatus !== "READY"}
                    className="flex-1 px-6 py-3 bg-[#b48d5e] text-white font-bold rounded hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                    {isAdding ? "Menambahkan..." : "Masuk Keranjang"}
                </button>
            </div>
        </div>
    );
}
