"use client";
import { Trash2, ShieldCheck, ArrowRight, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import CheckoutForm from "@/components/CheckoutForm";

export default function CartPage() {
    const router = useRouter();
    const { items, isLoading: cartLoading, addToCart, removeFromCart } = useCart();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [isCheckoutView, setIsCheckoutView] = useState(false);

    // Selection State (Array of selected productId)
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    // Determine if all items are selected
    const isAllSelected = items.length > 0 && selectedItems.length === items.length;

    // Filter Items to Checkout
    const itemsToCheckout = items.filter(item => selectedItems.includes(item.productId));

    // Cart Total (Only for Selected Items)
    const totalAmount = itemsToCheckout.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // Toggle Single Item
    const toggleSelect = (productId: number) => {
        if (selectedItems.includes(productId)) {
            setSelectedItems(selectedItems.filter(id => id !== productId));
        } else {
            setSelectedItems([...selectedItems, productId]);
        }
    };

    // Toggle All
    const toggleSelectAll = () => {
        if (isAllSelected) {
            setSelectedItems([]);
        } else {
            setSelectedItems(items.map(i => i.productId));
        }
    };

    // Handler for CheckoutForm
    const handleCheckoutSubmit = async (formData: any) => {
        if (selectedItems.length === 0) {
            alert("Pilih minimal satu barang untuk di checkout.");
            return;
        }

        setIsSubmitting(true);

        try {
            // Construct Payload matching API
            const payload = {
                items: itemsToCheckout, // Send ONLY selected items
                totalAmount: totalAmount,
                userId: null,

                // Map CheckoutForm Billing to Customer Details
                customerDetails: {
                    name: `${formData.billing.firstName} ${formData.billing.lastName}`,
                    email: formData.billing.email,
                    phone: formData.billing.phone,
                    address: formData.billing.address
                },

                // Pass new extended fields
                shippingAddress: JSON.stringify(formData.shipping),
                billingAddress: JSON.stringify(formData.billing),
                ktpImage: formData.ktpImage,
                paymentMethod: formData.paymentMethod
            };

            // 1. Call API
            const response = await fetch("/api/transaction/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.success && result.paymentUrl) {
                // IMPORTANT: Remove Checked Out items from Cart via Context
                // Assuming success, we clear bought items
                for (const item of itemsToCheckout) {
                    await removeFromCart(item.productId);
                }

                // Redirect to Success Page
                router.push(`/payment/success?orderId=${result.orderId}`);
            } else {
                alert("Gagal: " + (result.error || "Unknown"));
            }
        } catch (error) {
            console.error(error);
            alert("Error processing transaction");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (cartLoading) return <div className="p-12 text-center text-gray-500">Memuat keranjang...</div>;
    if (items.length === 0) return (
        <div className="p-12 text-center flex flex-col items-center justify-center min-h-[50vh]">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="text-gray-400" size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Keranjang Belanja Kosong</h2>
            <p className="text-gray-500 mb-6">Sepertinya Anda belum menambahkan produk apapun.</p>
            <button onClick={() => router.push('/')} className="px-6 py-2 bg-[#1e3a8a] text-white rounded hover:bg-[#152c6e] font-bold">
                Mulai Belanja
            </button>
        </div>
    );

    // --- CHECKOUT VIEW ---
    if (isCheckoutView) {
        return (
            <div className="bg-gray-50 min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    <CheckoutForm
                        isSubmitting={isSubmitting}
                        onSubmit={handleCheckoutSubmit}
                        items={itemsToCheckout}
                        total={totalAmount}
                        onBack={() => setIsCheckoutView(false)}
                    />
                </div>
            </div>
        );
    }

    // --- CART VIEW ---
    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-[#1e3a8a] mb-6 font-serif">Keranjang Belanja</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* LEFT COLUMN: Cart Items */}
                    <div className="flex-1 space-y-6">

                        {/* Header Row (Select All) */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center gap-4">
                            <input
                                type="checkbox"
                                checked={isAllSelected}
                                onChange={toggleSelectAll}
                                className="w-5 h-5 rounded border-gray-300 text-[#1e3a8a] focus:ring-[#1e3a8a]"
                            />
                            <span className="font-semibold text-gray-700">Pilih Semua ({items.length})</span>
                            <span className="ml-auto font-semibold text-[#1e3a8a] cursor-pointer hover:underline text-sm" onClick={() => setSelectedItems([])}>Hapus Pilihan</span>
                        </div>

                        {/* List Items */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
                            {items.map((item) => (
                                <div key={item.id} className="flex flex-col md:flex-row items-center border-b border-gray-100 last:border-0 pb-6 last:pb-0 gap-4">
                                    {/* Checkbox */}
                                    <div className="flex-shrink-0">
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.includes(item.productId)}
                                            onChange={() => toggleSelect(item.productId)}
                                            className="w-5 h-5 rounded border-gray-300 text-[#1e3a8a] focus:ring-[#1e3a8a]"
                                        />
                                    </div>

                                    {/* Image */}
                                    <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden relative flex-shrink-0 border border-gray-200">
                                        {item.image ? (
                                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No IMG</div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 w-full md:w-auto text-center md:text-left">
                                        <h3 className="font-bold text-gray-800 text-sm md:text-base mb-1">{item.name}</h3>
                                        <p className="text-[#b48d5e] font-bold text-sm">
                                            Rp {item.price.toLocaleString("id-ID")}
                                        </p>
                                    </div>

                                    {/* Quantity & Delete */}
                                    <div className="flex items-center gap-4">
                                        {/* Simple Quantity Controls (Optional improvement: +/- buttons) */}
                                        <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                                            <button className="px-2 py-1 hover:bg-gray-100" onClick={() => addToCart({ id: item.productId, name: item.name, price: item.price, image: item.image }, -1)}>
                                                <Minus size={14} className="text-gray-600" />
                                            </button>
                                            <span className="px-3 py-1 text-sm font-semibold min-w-[30px] text-center">{item.quantity}</span>
                                            <button className="px-2 py-1 hover:bg-gray-100" onClick={() => addToCart({ id: item.productId, name: item.name, price: item.price, image: item.image }, 1)}>
                                                <Plus size={14} className="text-gray-600" />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(item.productId)}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-2"
                                            title="Hapus Item"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>

                    {/* RIGHT COLUMN: Summary */}
                    <div className="w-full lg:w-96 h-fit sticky top-24">
                        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                            <h3 className="font-bold text-lg mb-4 text-gray-800 border-b border-gray-100 pb-2">Ringkasan Belanja</h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Total Item ({itemsToCheckout.length} barang)</span>
                                    <span>Rp {totalAmount.toLocaleString("id-ID")}</span>
                                </div>
                                <div className="flex justify-between text-gray-800 font-bold text-lg border-t border-dashed border-gray-300 pt-3 mt-2">
                                    <span>Total Tagihan</span>
                                    <span className="text-[#b48d5e]">Rp {totalAmount.toLocaleString("id-ID")}</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsCheckoutView(true)}
                                disabled={isSubmitting || selectedItems.length === 0}
                                className={`w-full font-bold py-3.5 rounded-lg flex items-center justify-center shadow-md transition-all
                                    ${selectedItems.length === 0
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-[#1e3a8a] text-white hover:brightness-110 hover:shadow-lg'
                                    }
                                `}
                            >
                                {isSubmitting ? "Memproses..." : `Beli (${itemsToCheckout.length})`} <ArrowRight size={18} className="ml-2" />
                            </button>

                            {selectedItems.length === 0 && (
                                <p className="text-xs text-red-500 text-center mt-2">
                                    Pilih minimal satu barang untuk melanjutkan.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
