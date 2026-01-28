"use client";

import { useState } from "react";

export default function SidebarFilter() {
    // Mock States for UI demo
    const [priceRange, setPriceRange] = useState(5000000);

    return (
        <div className="w-full">
            <h2 className="text-xl font-bold text-[#b48d5e] mb-8 font-serif">Saring</h2>

            {/* Filter Berat */}
            <div className="mb-8 border-b border-gray-100 pb-8">
                <h3 className="font-bold text-gray-700 mb-4 text-sm">Berdasarkan Berat</h3>
                <div className="space-y-3">
                    {['8 Gr', '10 Gr', '100 Gr', '250 Gr'].map(weight => (
                        <label key={weight} className="flex items-center space-x-3 cursor-pointer group">
                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#b48d5e] focus:ring-[#b48d5e]" />
                            <span className="text-gray-500 text-sm group-hover:text-[#b48d5e] transition font-medium">{weight}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Filter Harga */}
            <div className="mb-8 border-b border-gray-100 pb-8">
                <h3 className="font-bold text-gray-700 mb-4 text-sm">Berdasarkan Harga</h3>
                <div className="px-1 py-4">
                    <input
                        type="range"
                        min="0"
                        max="100000000"
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#b48d5e]"
                    />
                </div>
                <div className="flex justify-between items-center mt-2 gap-2 text-gray-500">
                    <span className="text-xs">10.000</span>
                    <span className="text-xs">90.000.000</span>
                </div>
                <div className="text-[10px] text-gray-400 mt-2 italic">Semua harga dalam ribu rupiah</div>
            </div>

            {/* Filter Ulasan */}
            <div>
                <h3 className="font-bold text-gray-700 mb-4 text-sm">Berdasarkan Ulasan</h3>
                <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => (
                        <label key={star} className="flex items-center space-x-3 cursor-pointer group">
                            <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-[#b48d5e] focus:ring-[#b48d5e]" />
                            <div className="flex items-center text-yellow-400">
                                {Array(star).fill(0).map((_, i) => (
                                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                ))}
                                {Array(5 - star).fill(0).map((_, i) => (
                                    <svg key={i} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                ))}
                            </div>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}
