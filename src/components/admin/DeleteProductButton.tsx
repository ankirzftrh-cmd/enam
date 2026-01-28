"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteProductButton({ id }: { id: number }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Yakin ingin menghapus produk ini?")) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/admin/products?id=${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                router.refresh();
            } else {
                alert("Gagal menghapus produk");
            }
        } catch (error) {
            console.error(error);
            alert("Error");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
        >
            <Trash2 size={16} />
        </button>
    );
}
