"use client";

import { useState } from "react";
import Image from "next/image";
import { Info } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

interface Product {
    id: number;
    name: string;
    price: number;
    image: string | null;
    stockStatus: string;
    slug: string;
}

export default function PurchaseGoldView({ products, categoryName = "Produk", description }: { products: Product[], categoryName?: string, description?: string }) {
    const router = useRouter();
    const { addToCart } = useCart();

    // State to track quantity for each product: { [productId]: quantity }
    const [quantities, setQuantities] = useState<Record<number, number>>({});
    const [selectedLocation, setSelectedLocation] = useState("BELM Pengiriman Ekspedisi, Pulogadung Jakarta");
    const [isLocModalOpen, setIsLocModalOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    const locations = [
        "BELM Pengiriman Ekspedisi, Pulogadung Jakarta",
        "Butik Emas LM - Gedung Antam Jakarta",
        "Butik Emas LM - Bandung",
        "Butik Emas LM - Surabaya Darmo",
        "Butik Emas LM - Medan"
    ];

    const handleQuantityChange = (id: number, val: string) => {
        const qty = parseInt(val) || 0;
        setQuantities(prev => ({ ...prev, [id]: qty }));
    };

    const calculateSubtotal = (price: number, qty: number) => price * qty;

    // Calculate Grand Totals
    const totalAmount = products.reduce((acc, p) => acc + (p.price * (quantities[p.id] || 0)), 0);
    const totalItems = Object.values(quantities).reduce((acc, q) => acc + q, 0);

    const handleAddToCart = async () => {
        setIsAdding(true);
        try {
            const promises = products.map(async (product) => {
                const qty = quantities[product.id] || 0;
                if (qty > 0) {
                    await addToCart(product, qty);
                }
            });

            await Promise.all(promises);
            router.push('/cart');
        } catch (error) {
            console.error("Error adding to cart", error);
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column: Product List */}
            <div className="flex-1 w-full">
                {/* Location Bar (New Feature) */}
                <div className="bg-[#1e3a8a] rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 shadow-md text-white">
                    <div className="flex items-center gap-4">
                        <span className="text-[#b48d5e] font-bold text-sm tracking-wider uppercase">Lokasi Butik</span>
                        <div className="h-4 w-[1px] bg-white/20 hidden sm:block"></div>
                        <div className="flex items-center gap-2 text-sm">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            <span className="font-medium truncate max-w-[200px] sm:max-w-md">{selectedLocation}</span>
                        </div>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setIsLocModalOpen(!isLocModalOpen)}
                            className="bg-transparent border border-white/30 hover:bg-white/10 text-xs font-bold py-2 px-4 rounded-full transition"
                        >
                            Ubah Lokasi
                        </button>

                        {/* Simple Dropdown for Demo */}
                        {isLocModalOpen && (
                            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-20 text-gray-800 border border-gray-100">
                                <div className="px-4 py-2 border-b border-gray-50 text-xs font-bold text-gray-400">Pilih Lokasi</div>
                                {locations.map(loc => (
                                    <button
                                        key={loc}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 hover:text-[#b48d5e] transition"
                                        onClick={() => {
                                            setSelectedLocation(loc);
                                            setIsLocModalOpen(false);
                                        }}
                                    >
                                        {loc}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Header Info */}
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-start gap-3 mb-6 text-sm text-[#1e3a8a]">
                    <Info className="flex-shrink-0 mt-0.5" size={18} />
                    <div>
                        <p className="font-bold">{categoryName} ANTAM LM</p>
                        <p>{description || "Terjamin keaslian dan kemurniannya dengan sertifikat LBMA. Harga dapat berubah sewaktu-waktu mengikuti harga pasar dunia."}</p>
                    </div>
                </div>

                {/* Table List */}
                <div className="space-y-4">
                    {products.map((product) => (
                        <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
                            {/* Image */}
                            <div className="relative w-24 h-24 flex-shrink-0 bg-gray-50 rounded p-2 border border-gray-100">
                                {product.image ? (
                                    <Image src={product.image} alt={product.name} fill className="object-contain" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-xs text-gray-400">No Image</div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 text-center sm:text-left">
                                <h3 className="font-bold text-gray-800">{product.name}</h3>
                                <div className="text-sm text-gray-500 mt-1">Stok: <span className={product.stockStatus === 'READY' ? 'text-green-600 font-bold' : 'text-red-500'}>{product.stockStatus}</span></div>
                                <div className="text-lg font-bold text-[#b48d5e] mt-2">
                                    Rp {product.price.toLocaleString('id-ID')}
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                                <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                                    <button
                                        className="px-3 py-1 bg-gray-50 hover:bg-gray-100 border-r border-gray-300 text-gray-600"
                                        onClick={() => setQuantities(prev => ({ ...prev, [product.id]: Math.max(0, (prev[product.id] || 0) - 1) }))}
                                    >-</button>
                                    <input
                                        type="number"
                                        className="w-16 text-center py-1 text-sm focus:outline-none"
                                        value={quantities[product.id] || 0}
                                        onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                                        min="0"
                                    />
                                    <button
                                        className="px-3 py-1 bg-gray-50 hover:bg-gray-100 border-l border-gray-300 text-gray-600"
                                        onClick={() => setQuantities(prev => ({ ...prev, [product.id]: (prev[product.id] || 0) + 1 }))}
                                    >+</button>
                                </div>
                                <div className="text-xs text-gray-500">
                                    Subtotal: <span className="font-bold text-gray-800">Rp {calculateSubtotal(product.price, quantities[product.id] || 0).toLocaleString('id-ID')}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Column: Sticky Summary */}
            <div className="w-full lg:w-[350px] flex-shrink-0">
                <div className="sticky top-24 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                        <h3 className="text-lg font-bold text-[#b48d5e] font-serif mb-4 border-b border-gray-100 pb-2">
                            Ringkasan Pesanan
                        </h3>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Harga Barang</span>
                                <span className="font-bold">Rp {totalAmount.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 flex items-center gap-1">PPh 22 (0 %) <Info size={12} className="text-yellow-500" /></span>
                                <span className="font-bold">Rp 0</span>
                            </div>
                            <div className="flex justify-between items-center border-t border-dashed border-gray-200 pt-2 mt-2">
                                <span className="font-bold text-gray-800">Harga Total</span>
                                <span className="font-bold text-xl text-[#1e3a8a]">
                                    Rp {totalAmount.toLocaleString('id-ID')}
                                </span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                <span>DPP (11/12)</span>
                                <span>Rp {Math.floor(totalAmount * 11 / 12).toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-400">
                                <span>PPN (12 %) *)</span>
                                <span>Rp {Math.floor(totalAmount * 0.12).toLocaleString('id-ID')}</span>
                            </div>

                            <div className="text-[10px] text-gray-400 leading-tight mt-4 pt-2 border-t border-gray-100">
                                *) PPN TIDAK DIPUNGUT SESUAI PP NO.49 TAHUN 2022. NILAI PPN TIDAK DIPERHITUNGKAN DALAM PERHITUNGAN GRAND TOTAL.
                            </div>

                            <div className="text-[10px] text-gray-500 leading-tight mt-2">
                                *Jika tidak memiliki NPWP atas nama Anda maka tidak perlu mengisi kolom NPWP dan silahkan ajukan perubahan data akun pada <span className="text-yellow-600 cursor-pointer hover:underline">halaman profile</span>.
                            </div>
                        </div>

                        <button
                            className="w-full bg-[#00A528] text-white font-bold py-3 rounded-lg hover:bg-green-700 transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={totalItems === 0 || isAdding}
                            onClick={handleAddToCart}
                        >
                            {isAdding ? "Memproses..." : "Tambah ke Keranjang"}
                        </button>
                    </div>

                    {/* Price Comparison Section */}
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                        <h3 className="text-[#b48d5e] font-bold mb-4 font-serif">Perbandingan Harga</h3>

                        <div className="flex items-center gap-2 mb-2">
                            <span className="font-bold text-gray-700">BRANKAS</span>
                            <div className="bg-gray-200 p-0.5 rounded"><div className="w-4 h-4 grid grid-cols-2 gap-0.5"><div className="bg-gray-500 rounded-full"></div><div className="bg-gray-500 rounded-full"></div><div className="bg-gray-500 rounded-full"></div><div className="bg-gray-500 rounded-full"></div></div></div>
                        </div>

                        <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                            Anda mendapat harga lebih murah untuk pembelian emas non fisik di BRANKAS LM
                        </p>

                        <div className="flex justify-between items-center text-sm mb-4">
                            <div className="flex items-center gap-1">
                                <span className="font-bold text-gray-500">BRANKAS</span>
                                <div className="w-3 h-3 bg-gray-300 grid grid-cols-2 gap-[1px]"><div className="bg-gray-500"></div><div className="bg-gray-500"></div><div className="bg-gray-500"></div><div className="bg-gray-500"></div></div>
                            </div>
                            <span className="text-[#1e3a8a] font-bold">Rp {Math.floor(totalAmount * 0.98).toLocaleString('id-ID')}</span>
                        </div>

                        <div className="text-xs text-orange-500 mb-4">
                            Anda menghemat <span className="font-bold">Rp {(totalAmount - Math.floor(totalAmount * 0.98)).toLocaleString('id-ID')}</span>
                        </div>

                        <p className="text-[10px] text-gray-500 mb-4 leading-relaxed">
                            Simpan emas di Brankas LM banyak untungnya! Keamanan terjamin, terlindungi asuransi, serta bisa diambil dan dijual kapan saja
                        </p>

                        <button className="w-full border border-[#1e3a8a] text-[#1e3a8a] font-bold py-2 rounded-lg hover:bg-blue-50 transition text-sm flex items-center justify-center gap-2">
                            <span>🔒</span> Kunjungi Brankas LM
                        </button>
                    </div>

                    {/* Tax Info Section */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-3">
                        <div className="mt-0.5 text-gray-400"><Info size={16} /></div>
                        <div className="text-[10px] text-gray-500 leading-relaxed">
                            <p className="font-bold text-gray-700 mb-1">Pungutan Pajak Penghasilan Pasal 22 atas Penjualan Emas Batangan dan Perhiasan</p>
                            Sesuai dengan PMK Nomor 48 tahun 2023 dengan tarif 0,25% (sesuai ketentuan yang berlaku) dan akan diterbitkan bukti potong PPh 22 oleh PT ANTAM Tbk sebagai Penjual.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
