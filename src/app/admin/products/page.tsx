import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Edit, Trash2, Plus } from "lucide-react";
import DeleteProductButton from "@/components/admin/DeleteProductButton"; // Client component for delete

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
    const products = await prisma.product.findMany({
        include: { category: true },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manajemen Produk</h1>
                <Link
                    href="/admin/products/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700 transition"
                >
                    <Plus size={18} /> Tambah Produk
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Gambar</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Produk</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Harga</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Kategori</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden relative border border-gray-200">
                                        {product.image ? (
                                            <Image src={product.image} alt={product.name} fill className="object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-xs text-gray-400">No Img</div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-bold text-gray-800 text-sm">{product.name}</div>
                                    <div className="text-xs text-gray-500 truncate max-w-[200px]">{product.description}</div>
                                </td>
                                <td className="px-6 py-4 font-mono text-sm">
                                    Rp {product.price.toLocaleString("id-ID")}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {product.category?.name || "-"}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-[10px] font-bold rounded-full border ${product.stockStatus === 'READY'
                                            ? 'bg-green-50 text-green-600 border-green-100'
                                            : 'bg-red-50 text-red-600 border-red-100'
                                        }`}>
                                        {product.stockStatus}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                    <Link
                                        href={`/admin/products/edit/${product.id}`}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                    >
                                        <Edit size={16} />
                                    </Link>
                                    <DeleteProductButton id={product.id} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {products.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        Belum ada produk. Silakan tambah produk baru.
                    </div>
                )}
            </div>
        </div>
    );
}
