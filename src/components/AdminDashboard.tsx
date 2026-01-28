/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Product } from "@/lib/products";
import { Plus, Edit, Trash2, X, AlertCircle } from "lucide-react";
import { clsx } from "clsx";

interface Category {
    id: number;
    name: string;
    parentId: number | null;
}

export default function AdminDashboard({ initialProducts, allCategories }: { initialProducts: Product[], allCategories: Category[] }) {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Partial<any>>({}); // using any for form state flexibility
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    // Filtered Categories
    const parentCategories = allCategories.filter(c => c.parentId === null);
    const [selectedParent, setSelectedParent] = useState<string>("");

    // When editing, we need to set selectedParent based on the product's category
    useEffect(() => {
        if (isEditing && currentProduct.category) {
            // Find the category object in allCategories
            const cat = allCategories.find(c => c.id === currentProduct.category.id);
            if (cat && cat.parentId) {
                // If it has a parent, set it
                setSelectedParent(cat.parentId.toString());
            } else if (cat) {
                // If it IS a parent (shouldn't happen for products usually but possible)
                setSelectedParent(cat.id.toString());
            }
        }
    }, [isEditing, currentProduct, allCategories]);

    const childCategories = selectedParent
        ? allCategories.filter(c => c.parentId === parseInt(selectedParent))
        : [];

    const handleOpenModal = (product?: Product) => {
        if (product) {
            setCurrentProduct({ ...product, categoryId: product.category.id });
            setIsEditing(true);
        } else {
            setCurrentProduct({ stockStatus: "READY" });
            setSelectedParent("");
            setIsEditing(false);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentProduct({});
        setIsEditing(false);
        setStatusMessage(null);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const data = new FormData();
        data.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: data
            });
            const json = await res.json();
            if (json.success) {
                setCurrentProduct(prev => ({ ...prev, image: json.url }));
            } else {
                alert("Failed to upload image");
            }
        } catch (err) {
            console.error("Upload failed", err);
            alert("Error uploading image");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        setIsLoading(true);
        try {
            const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setProducts(products.filter(p => p.id !== id));
            } else {
                alert("Failed to delete");
            }
        } catch (e) {
            alert("Error deleting product");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setStatusMessage(null);

        try {
            const url = isEditing ? `/api/products/${currentProduct.id}` : '/api/products';
            const method = isEditing ? 'PUT' : 'POST';

            const payload = {
                ...currentProduct,
                // Ensure price is number
                price: Number(currentProduct.price),
                // Ensure categoryId is set (from form state)
                categoryId: parseInt(currentProduct.categoryId)
            };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                // Refresh is tricky because we need the full product with generic category object
                // For now, reload the page to get fresh data from server
                window.location.reload();
            } else {
                const err = await res.json();
                setStatusMessage(err.error || "Failed to save");
            }
        } catch (e) {
            setStatusMessage("An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
                    <p className="text-gray-500">Manage your gold inventory and stock status.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg flex items-center shadow-lg transition-transform active:scale-95"
                >
                    <Plus className="mr-2" size={20} /> Add Product
                </button>
            </div>

            {/* Product Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                        <tr>
                            <th className="p-4 font-semibold">Image</th>
                            <th className="p-4 font-semibold">Name</th>
                            <th className="p-4 font-semibold">Price</th>
                            <th className="p-4 font-semibold">Category</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="p-4">
                                    <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden relative border border-gray-200">
                                        {product.image ? (
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-yellow-100 flex items-center justify-center text-xs text-yellow-600 font-bold">IMG</div>
                                        )}
                                    </div>
                                </td>
                                <td className="p-4 font-medium text-gray-800">{product.name}</td>
                                <td className="p-4 text-primary font-bold">Rp {product.price.toLocaleString("id-ID")}</td>
                                <td className="p-4 text-gray-500 text-sm">
                                    {/* Display Category Name safely */}
                                    {product.category?.name || "Uncategorized"}
                                </td>
                                <td className="p-4">
                                    <span className={clsx(
                                        "px-3 py-1 rounded-full text-xs font-bold",
                                        product.stockStatus === "READY" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                    )}>
                                        {product.stockStatus}
                                    </span>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <button
                                        onClick={() => handleOpenModal(product)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-400">No products found. Add one to get started.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 flex-shrink-0">
                            <h2 className="text-xl font-bold text-gray-800">{isEditing ? "Edit Product" : "Add New Product"}</h2>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                            <div className="p-6 space-y-4 overflow-y-auto flex-1">

                                {/* Image Upload Section */}
                                <div className="flex justify-center mb-4">
                                    <div className="relative w-32 h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden hover:bg-gray-50 transition cursor-pointer group">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            onChange={handleImageUpload}
                                        />
                                        {currentProduct.image ? (
                                            <Image
                                                src={currentProduct.image}
                                                alt="Preview"
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center text-gray-400 group-hover:text-primary">
                                                <Plus size={24} />
                                                <span className="text-xs mt-1">Upload</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                            value={currentProduct.name || ""}
                                            onChange={e => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea
                                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none h-24 text-sm"
                                            value={currentProduct.description || ""}
                                            onChange={e => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                                            placeholder="Product description... (optional)"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rp)</label>
                                    <input
                                        required
                                        type="number"
                                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                        value={currentProduct.price || ""}
                                        onChange={e => setCurrentProduct({ ...currentProduct, price: e.target.value })}
                                    />
                                </div>

                                {/* 
                                    HIERARCHICAL CATEGORY SELECTION 
                                */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Utama</label>
                                    <select
                                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none mb-2"
                                        value={selectedParent}
                                        onChange={e => {
                                            const pId = e.target.value;
                                            setSelectedParent(pId);
                                            // Set categoryId to the parent by default. 
                                            // If user selects a sub-category later, it will overwrite this.
                                            setCurrentProduct({ ...currentProduct, categoryId: pId });
                                        }}
                                    >
                                        <option value="">Pilih Kategori Induk</option>
                                        {parentCategories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>

                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sub-Kategori / Seri</label>
                                    <select
                                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                        value={currentProduct.categoryId || ""}
                                        onChange={e => setCurrentProduct({ ...currentProduct, categoryId: e.target.value })}
                                        disabled={!selectedParent}
                                    >
                                        <option value="">Pilih Sub-Kategori</option>
                                        {childCategories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>


                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Status (Logic)</label>
                                    <div className="flex items-center space-x-4">
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="stockStatus"
                                                value="READY"
                                                checked={currentProduct.stockStatus === "READY"}
                                                onChange={e => setCurrentProduct({ ...currentProduct, stockStatus: "READY" })}
                                                className="w-4 h-4 text-primary focus:ring-primary"
                                            />
                                            <span className="font-medium text-green-700 bg-green-50 px-2 py-1 rounded">Ready Stock</span>
                                        </label>
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="stockStatus"
                                                value="NOT_READY"
                                                checked={currentProduct.stockStatus === "NOT_READY"}
                                                onChange={e => setCurrentProduct({ ...currentProduct, stockStatus: "NOT_READY" })}
                                                className="w-4 h-4 text-red focus:ring-red-500"
                                            />
                                            <span className="font-medium text-red-700 bg-red-50 px-2 py-1 rounded">Not Ready (Habis)</span>
                                        </label>
                                    </div>
                                    <div className="mt-4">
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={currentProduct.isBestSeller || false}
                                                onChange={e => setCurrentProduct({ ...currentProduct, isBestSeller: e.target.checked })}
                                                className="w-5 h-5 text-primary rounded focus:ring-primary"
                                            />
                                            <span className="font-bold text-gray-800">Jadikan Produk Terbaik? (Best Seller)</span>
                                        </label>
                                    </div>
                                </div>

                                {statusMessage && (
                                    <div className="text-red-600 bg-red-50 p-3 rounded-md text-sm flex items-center">
                                        <AlertCircle size={16} className="mr-2" /> {statusMessage}
                                    </div>
                                )}

                            </div>

                            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3 flex-shrink-0">
                                <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-6 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark disabled:opacity-50 shadow-md"
                                >
                                    {isLoading ? "Saving..." : "Save Product"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
