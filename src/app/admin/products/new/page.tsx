"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AddProductPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: 0,
        weight: 0,
        stock: 10,
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
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await fetch("/api/categories");
                if (res.ok) {
                    const data = await res.json();
                    setCategories(data);
                }
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        }
        fetchCategories();
    }, []);

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
                showToast(`Gambar ${index + 1} berhasil diupload`, "success");
            } else {
                showToast("Gagal upload gambar", "error");
            }
        } catch (err) {
            console.error("Upload failed", err);
            showToast("Gagal upload gambar", "error");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.description) {
            showToast("Deskripsi wajib diisi", "error");
            return;
        }

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
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const result = await res.json();

            if (res.ok) {
                showToast("Produk berhasil ditambahkan!", "success");
                setTimeout(() => {
                    router.push("/admin/products");
                    router.refresh();
                }, 1500);
            } else {
                showToast(result.error || "Gagal menambahkan produk", "error");
            }
        } catch (error) {
            console.error(error);
            showToast("Terjadi kesalahan sistem", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto relative">
            {toast && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded shadow-lg text-white font-medium ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
                    {toast.message}
                </div>
            )}

            <Link href="/admin/products" className="flex items-center text-gray-500 mb-6 hover:text-gray-800">
                <ArrowLeft size={18} className="mr-2" /> Kembali ke Daftar Produk
            </Link>

            <h1 className="text-2xl font-bold text-gray-800 mb-8">Tambah Produk Baru</h1>

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
                                type="text" inputMode="numeric" required
                                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-blue-500"
                                value={formData.price || ""}
                                placeholder="Contoh: 150000"
                                onChange={e => {
                                    const rawValue = e.target.value.replace(/\D/g, '');
                                    const sanitizedValue = rawValue ? parseInt(rawValue) : 0;
                                    setFormData({ ...formData, price: sanitizedValue });
                                }}
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
                                            required={!formData.images[0]}
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
                            <p className="text-xs text-gray-500 mt-2">*Foto pertama akan menjadi foto utama produk di katalog.</p>
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
                    <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi Produk (Wajib)</label>
                    <textarea
                        rows={4} required
                        className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-blue-500"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Jelaskan detail produk, kemurnian emas, dimensi, dll."
                    />
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-blue-600 text-white font-bold px-8 py-3 rounded hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {isLoading ? "Menyimpan..." : "Simpan Produk"}
                    </button>
                </div>
            </form>
        </div>
    );
}
