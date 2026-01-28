"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const productId = resolvedParams.id;

    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        id: 0,
        name: "",
        description: "",
        price: 0,
        weight: 0,
        stock: 0,
        categoryId: "",
        stockStatus: "READY",
        isNew: false,
        isBestSeller: false,
        images: ["", ""],
        purity: "",
        thickness: "",
        dimensions: ""
    });

    const [previewImages, setPreviewImages] = useState<string[]>(["", ""]);
    const [reviews, setReviews] = useState<any[]>([]);
    const [reviewForm, setReviewForm] = useState({
        userName: "",
        rating: 5,
        comment: "",
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        async function loadData() {
            try {
                const catRes = await fetch("/api/categories");
                if (catRes.ok) {
                    setCategories(await catRes.json());
                }

                const prodRes = await fetch(`/api/admin/products/${productId}`);
                if (prodRes.ok) {
                    const product = await prodRes.json();
                    setFormData({
                        id: product.id,
                        name: product.name,
                        description: product.description || "",
                        price: product.price,
                        weight: product.weight || 0,
                        stock: product.stock || 0,
                        categoryId: product.categoryId.toString(),
                        stockStatus: product.stockStatus,
                        isNew: product.isNew,
                        isBestSeller: product.isBestSeller,
                        images: (product.images as string[])?.length > 0 ? [...(product.images as string[]), "", ""].slice(0, 2) : [product.image || "", ""],
                        purity: product.purity || "",
                        thickness: product.thickness || "",
                        dimensions: product.dimensions || ""
                    });

                    const loadedImages = (product.images as string[])?.length > 0 ? [...(product.images as string[]), "", ""].slice(0, 2) : [product.image || "", ""];
                    setPreviewImages(loadedImages);

                    fetchReviews();
                } else {
                    alert("Produk tidak ditemukan");
                    router.push("/admin/products");
                }
            } catch (e) {
                console.error("Failed to fetch data", e);
            }
        }
        loadData();
    }, [productId, router]);

    const fetchReviews = async () => {
        try {
            const res = await fetch(`/api/admin/products/${productId}/reviews`);
            if (res.ok) {
                setReviews(await res.json());
            }
        } catch (e) { console.error("Failed to fetch reviews"); }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const newPreviews = [...previewImages];
        newPreviews[index] = URL.createObjectURL(file);
        setPreviewImages(newPreviews);

        const data = new FormData();
        data.append("file", file);
        try {
            const res = await fetch("/api/upload", { method: "POST", body: data });
            const json = await res.json();
            if (json.success) {
                const newImages = [...formData.images];
                newImages[index] = json.url;
                setFormData({ ...formData, images: newImages });
            }
        } catch (err) { alert("Gagal upload gambar"); }
    };

    const handleAddReview = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/admin/products/${productId}/reviews`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reviewForm)
            });
            if (res.ok) {
                fetchReviews();
                setReviewForm({ userName: "", rating: 5, comment: "", date: new Date().toISOString().split('T')[0] });
                alert("Ulasan berhasil ditambahkan");
            }
        } catch (e) { alert("Gagal menambah ulasan"); }
    };

    const handleDeleteReview = async (id: number) => {
        if (!confirm("Hapus ulasan ini?")) return;
        try {
            const res = await fetch(`/api/admin/products/${productId}/reviews?reviewId=${id}`, { method: "DELETE" });
            if (res.ok) fetchReviews();
        } catch (e) { alert("Gagal menghapus ulasan"); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const payload = {
                ...formData,
                categoryId: parseInt(formData.categoryId),
                weight: parseFloat(formData.weight.toString()),
                price: parseInt(formData.price.toString()),
                stock: parseInt(formData.stock.toString()),
                image: formData.images[0] || "",
                images: formData.images.filter(img => img !== ""),
                purity: formData.purity,
                thickness: formData.thickness,
                dimensions: formData.dimensions
            };

            const res = await fetch("/api/admin/products", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                router.push("/admin/products");
                router.refresh();
            } else {
                alert("Gagal mengupdate produk");
            }
        } catch (error) { alert("Error"); }
        finally { setIsLoading(false); }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <Link href="/admin/products" className="flex items-center text-gray-500 mb-6 hover:text-gray-800">
                <ArrowLeft size={18} className="mr-2" /> Kembali ke Daftar Produk
            </Link>
            <h1 className="text-2xl font-bold text-gray-800 mb-8">Edit Produk</h1>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Col */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Nama Produk</label>
                            <input
                                type="text" required
                                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-blue-500"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Kategori</label>
                            <select
                                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-blue-500"
                                value={formData.categoryId}
                                onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                                required
                            >
                                <option value="">Pilih Kategori</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Harga (IDR)</label>
                            <input
                                type="number" required
                                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-blue-500"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: parseInt(e.target.value) })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Berat (Gram)</label>
                                <input
                                    type="number" step="0.01"
                                    className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-blue-500"
                                    value={formData.weight}
                                    onChange={e => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Stok</label>
                                <input
                                    type="number"
                                    className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-blue-500"
                                    value={formData.stock}
                                    onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Col */}
                    <div className="space-y-6">
                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Foto Produk (Maksimal 2)</label>
                            <div className="flex gap-4">
                                {/* Main Image */}
                                <div className="w-2/3">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg h-60 flex items-center justify-center relative hover:bg-gray-50 transition overflow-hidden">
                                        <input
                                            type="file" accept="image/*"
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            onChange={(e) => handleImageUpload(e, 0)}
                                        />
                                        {previewImages[0] ? (
                                            <div className="relative w-full h-full">
                                                <Image src={previewImages[0]} alt="Main Preview" fill className="object-cover" />
                                                <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">Utama</div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center text-gray-400">
                                                <Upload size={32} className="mb-2" />
                                                <span className="text-xs font-bold">Foto Utama</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {/* Secondary Image */}
                                <div className="w-1/3">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg h-60 flex items-center justify-center relative hover:bg-gray-50 transition overflow-hidden">
                                        <input
                                            type="file" accept="image/*"
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            onChange={(e) => handleImageUpload(e, 1)}
                                        />
                                        {previewImages[1] ? (
                                            <div className="relative w-full h-full">
                                                <Image src={previewImages[1]} alt="Secondary Preview" fill className="object-cover" />
                                                <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">Ke-2</div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center text-gray-400">
                                                <Upload size={24} className="mb-2" />
                                                <span className="text-xs text-center">Foto Ke-2</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Specifications Section */}
                        <div className="border-t border-gray-100 pt-6">
                            <h3 className="font-bold text-gray-800 mb-4">Spesifikasi Produk</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Kemurnian (Purity)</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-blue-500"
                                        placeholder="Contoh: 99.99%"
                                        value={formData.purity}
                                        onChange={e => setFormData({ ...formData, purity: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Ketebalan</label>
                                        <input
                                            type="text"
                                            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-blue-500"
                                            placeholder="Contoh: 1.2 mm"
                                            value={formData.thickness}
                                            onChange={e => setFormData({ ...formData, thickness: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Dimensi</label>
                                        <input
                                            type="text"
                                            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-blue-500"
                                            placeholder="Contoh: 10 x 20 mm"
                                            value={formData.dimensions}
                                            onChange={e => setFormData({ ...formData, dimensions: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status Toggles */}
                        <div className="bg-gray-50 p-4 rounded border border-gray-200">
                            <label className="flex items-center justify-between cursor-pointer mb-4">
                                <span className="font-bold text-sm text-gray-700">Status Stok</span>
                                <div className="relative inline-flex items-center cursor-pointer">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, stockStatus: formData.stockStatus === "READY" ? "EMPTY" : "READY" })}
                                        className={`w-11 h-6 rounded-full transition-colors focus:outline-none ${formData.stockStatus === "READY" ? 'bg-green-500' : 'bg-gray-300'}`}
                                    >
                                        <span className={`block w-4 h-4 rounded-full bg-white shadow transform transition-transform ${formData.stockStatus === "READY" ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                    <span className="ml-3 text-xs font-medium text-gray-900">{formData.stockStatus === "READY" ? "Tersedia" : "Habis"}</span>
                                </div>
                            </label>

                            <label className="flex items-center space-x-3 mb-2">
                                <input
                                    type="checkbox"
                                    checked={formData.isNew}
                                    onChange={e => setFormData({ ...formData, isNew: e.target.checked })}
                                    className="h-4 w-4 text-blue-600 rounded"
                                />
                                <span className="text-sm text-gray-700">Tandai sebagai "Baru" (New)</span>
                            </label>

                            <label className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    checked={formData.isBestSeller}
                                    onChange={e => setFormData({ ...formData, isBestSeller: e.target.checked })}
                                    className="h-4 w-4 text-blue-600 rounded"
                                />
                                <span className="text-sm text-gray-700">Tandai sebagai "Best Seller"</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="mt-8 border-t border-gray-100 pt-6">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi Produk</label>
                    <textarea
                        rows={4}
                        className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-blue-500"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>
                <div className="mt-8 flex justify-end">
                    <button type="submit" disabled={isLoading} className="bg-blue-600 text-white font-bold px-8 py-3 rounded hover:bg-blue-700 transition disabled:opacity-50">{isLoading ? "Menyimpan..." : "Update Produk"}</button>
                </div>
            </form>

            {/* Review Management Section */}
            <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Manajemen Ulasan</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Add Review Form */}
                    <div className="md:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="font-bold text-lg mb-4">Tambah Ulasan Manual</h3>
                            <form onSubmit={handleAddReview} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Nama User</label>
                                    <input
                                        type="text" required
                                        className="w-full border px-3 py-2 rounded"
                                        value={reviewForm.userName}
                                        onChange={e => setReviewForm({ ...reviewForm, userName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Rating (1-5)</label>
                                    <select
                                        className="w-full border px-3 py-2 rounded"
                                        value={reviewForm.rating}
                                        onChange={e => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) })}
                                    >
                                        {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Bintang</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Tanggal</label>
                                    <input
                                        type="date"
                                        className="w-full border px-3 py-2 rounded"
                                        value={reviewForm.date}
                                        onChange={e => setReviewForm({ ...reviewForm, date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Komentar</label>
                                    <textarea
                                        required rows={3}
                                        className="w-full border px-3 py-2 rounded"
                                        value={reviewForm.comment}
                                        onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                    />
                                </div>
                                <button type="submit" className="w-full bg-green-600 text-white font-bold py-2 rounded hover:bg-green-700">
                                    Tambah Ulasan
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Review List */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3">User</th>
                                        <th className="px-6 py-3">Rating</th>
                                        <th className="px-6 py-3">Komentar</th>
                                        <th className="px-6 py-3">Tanggal</th>
                                        <th className="px-6 py-3">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {reviews.length === 0 ? (
                                        <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Belum ada ulasan</td></tr>
                                    ) : (
                                        reviews.map((review) => (
                                            <tr key={review.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium">{review.userName}</td>
                                                <td className="px-6 py-4 text-yellow-500">{"★".repeat(review.rating)}</td>
                                                <td className="px-6 py-4 truncate max-w-xs" title={review.comment}>{review.comment}</td>
                                                <td className="px-6 py-4 text-gray-500">{new Date(review.date).toLocaleDateString("id-ID")}</td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => handleDeleteReview(review.id)}
                                                        className="text-red-600 hover:text-red-800 font-bold text-xs"
                                                    >
                                                        Hapus
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
