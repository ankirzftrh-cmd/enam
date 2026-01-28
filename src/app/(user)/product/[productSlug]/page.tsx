import { prisma } from "@/lib/prisma";
import ProductGallery from "@/components/ProductGallery";
import { Star, Heart, Share2, Facebook } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartSection from "@/components/AddToCartSection";
import ProductCard from "@/components/ProductCard";

// Helper for currency
const formatPrice = (price: number) => `Rp ${price.toLocaleString("id-ID")}`;

export default async function ProductDetailPage({ params }: { params: Promise<{ productSlug: string }> }) {
    const { productSlug } = await params;

    // Fetch Product
    const product = await prisma.product.findUnique({
        where: { slug: productSlug },
        include: {
            category: true,
            reviews: { orderBy: { date: 'desc' } }
        }
    });



    if (!product) return notFound();

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-gray-500 mb-8 space-x-2">
                <Link href="/" className="hover:text-[#b48d5e]">Home</Link>
                <span>/</span>
                <Link href={`/products/${product.category.slug}`} className="hover:text-[#b48d5e]">{product.category.name}</Link>
                <span>/</span>
                <span className="text-gray-800 font-medium truncate max-w-[200px]">{product.name}</span>
            </div>

            {/* Main Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                {/* Left: Gallery */}
                <div>
                    <ProductGallery
                        images={(product.images as string[])?.length > 0 ? (product.images as string[]) : [product.image || ""]}
                        name={product.name}
                    />
                </div>

                {/* Right: Info */}
                <div>
                    {/* New Badge */}
                    {product.isNew && (
                        <span className="bg-green-500 text-white text-[10px] uppercase font-bold px-3 py-1 rounded inline-block mb-4">
                            New
                        </span>
                    )}

                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 font-serif mb-4 leading-tight">
                        {product.name}
                    </h1>

                    {/* Rating & Share */}
                    <div className="flex items-center gap-6 mb-6">
                        <div className="flex items-center gap-1 text-yellow-400 text-sm">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    size={16}
                                    fill={star <= (product.reviews && product.reviews.length > 0 ? product.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / product.reviews.length : 0) ? "currentColor" : "none"}
                                    className={star <= (product.reviews && product.reviews.length > 0 ? product.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / product.reviews.length : 0) ? "text-yellow-400" : "text-gray-300"}
                                />
                            ))}
                            <span className="text-gray-400 ml-2">({product.reviews?.length || 0} Ulasan)</span>
                        </div>

                        <div className="flex gap-2">
                            <button className="flex items-center gap-1 bg-[#1877F2] text-white text-xs px-2 py-1 rounded hover:bg-opacity-90 transition">
                                <Facebook size={12} /> Share 0
                            </button>
                            <button className="flex items-center gap-1 bg-black text-white text-xs px-2 py-1 rounded hover:bg-gray-800 transition">
                                <Share2 size={12} /> Post
                            </button>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="text-3xl font-bold text-[#b48d5e] mb-2 font-serif">
                        {formatPrice(product.price)}
                    </div>

                    {/* Stock Status */}
                    <div className="mb-8">
                        {product.stockStatus === "READY" ? (
                            <span className="text-green-600 border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold rounded-full">
                                Ready Stock
                            </span>
                        ) : (
                            <span className="text-red-600 border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold rounded-full">
                                Belum Tersedia
                            </span>
                        )}
                    </div>

                    {/* Variant & Cart Inputs */}
                    <AddToCartSection product={product} />

                </div>
            </div>

            {/* Bottom Section: Info & Specs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 border-t border-gray-100 pt-12">
                {/* Description (2 cols) */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-xl p-8 shadow-sm border border-blue-50">
                        <h2 className="text-2xl font-bold text-[#b48d5e] mb-6 font-serif">Info Produk</h2>
                        <div className="prose text-gray-600 leading-relaxed text-sm text-justify">
                            {product.description || "Tidak ada deskripsi produk."}
                            <p className="mt-4">
                                Produk emas batangan {product.category.name} menghadirkan visualisasi elegan yang melambangkan kemewahan dan nilai abadi.
                                Dibuat menggunakan teknologi modern dengan standar kualitas tertinggi, produk ini dilengkapi fitur keamanan terkini untuk
                                menjamin keaslian.
                            </p>
                        </div>

                        {/* Security Notice */}
                        <div className="mt-8 flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100 items-start">
                            <div className="mt-1 text-gray-500">ℹ️</div>
                            <div className="text-xs text-gray-500">
                                <p className="font-bold text-gray-700 mb-1">Pungutan Pajak Penghasilan Pasal 22</p>
                                <p>Sesuai dengan PMK Nomor 48 tahun 2023, penjualan emas batangan dikenakan PPh 22 sebesar 0,25% bagi pemegang NPWP.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Specs Table (1 col) */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                            <h3 className="font-bold text-gray-800">Spesifikasi Produk</h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            <div className="flex justify-between px-6 py-4">
                                <span className="text-sm text-gray-500">Berat Emas</span>
                                <span className="text-sm font-bold text-gray-800">{product.weight} gram</span>
                            </div>
                            <div className="flex justify-between px-6 py-4">
                                <span className="text-sm text-gray-500">Kemurnian</span>
                                <span className="text-sm font-bold text-gray-800">{product.purity || "-"}</span>
                            </div>
                            <div className="flex justify-between px-6 py-4">
                                <span className="text-sm text-gray-500">Tebal Emas</span>
                                <span className="text-sm font-bold text-gray-800">{product.thickness || "-"}</span>
                            </div>
                            <div className="flex justify-between px-6 py-4">
                                <span className="text-sm text-gray-500">Dimensi Emas</span>
                                <span className="text-sm font-bold text-gray-800">{product.dimensions || "-"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section Placeholder */}
            <div className="mt-12">
                <h2 className="text-2xl font-bold text-[#b48d5e] mb-6 font-serif">Ulasan ({product.reviews?.length || 0})</h2>
                {product.reviews && product.reviews.length > 0 ? (
                    <div className="grid gap-6">
                        {product.reviews.map((review: any) => (
                            <div key={review.id} className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <span className="font-bold text-gray-800 block">{review.userName}</span>
                                        <div className="flex text-yellow-500 text-xs mt-1">
                                            {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString("id-ID", { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center border border-dashed border-gray-300 rounded-lg text-gray-400">
                        Belum ada ulasan untuk produk ini.
                    </div>
                )}
            </div>

            {/* Related Products Section */}

        </div>
    );
}



