"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Copy, CheckCircle, Clock, ArrowRight, ShieldCheck } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams.get("orderId");

    const [isLoading, setIsLoading] = useState(true);
    const [paymentData, setPaymentData] = useState<any>(null);
    const [timeLeft, setTimeLeft] = useState<string>("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (orderId) {
            fetchPaymentDetails();
        }
    }, [orderId]);

    useEffect(() => {
        if (!paymentData?.expiryDate) return;

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const expiry = new Date(paymentData.expiryDate).getTime();
            const distance = expiry - now;

            if (distance < 0) {
                clearInterval(interval);
                setTimeLeft("EXPIRED");
            } else {
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                setTimeLeft(`${hours}j ${minutes}m ${seconds}s`);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [paymentData]);

    const fetchPaymentDetails = async () => {
        try {
            const res = await fetch("/api/transaction/get-payment-details", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId })
            });
            const data = await res.json();
            if (data.success) {
                setPaymentData(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyVA = async () => {
        if (paymentDetails?.accountNumber) {
            try {
                await navigator.clipboard.writeText(paymentDetails.accountNumber);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy', err);
            }
        }
    };

    if (!orderId) return <div className="p-10 text-center">Order ID Missing</div>;
    if (isLoading) return <div className="p-10 text-center">Memuat Info Pembayaran...</div>;

    // Helper: Extract valid Payment Details (Normalize from API response)
    const paymentDetails = paymentData?.paymentDetails || (paymentData?.availableBanks ? {
        bankCode: paymentData.availableBanks[0].bankCode,
        accountNumber: paymentData.availableBanks[0].bankAccountNumber,
        amount: paymentData.amount,
        expiryDate: paymentData.expiryDate,
        provider: "XENDIT"
    } : null);

    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4">
            <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">

                {/* Header */}
                <div className="bg-[#1e3a8a] p-6 text-center text-white">
                    <p className="opacity-80 text-sm mb-1">Total Tagihan</p>
                    <h1 className="text-3xl font-bold font-serif mb-4">
                        Rp {paymentData?.amount?.toLocaleString("id-ID")}
                    </h1>

                    <div className="inline-flex items-center bg-white/10 px-4 py-1.5 rounded-full text-sm backdrop-blur-sm">
                        <Clock size={16} className="mr-2" />
                        <span>Bayar dalam: <b>{timeLeft}</b></span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8">

                    {/* Virtual Account Display */}
                    {paymentDetails && (paymentDetails.provider === 'VA' || paymentDetails.accountNumber) && (
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <p className="text-sm text-gray-500 mb-1">Nomor Virtual Account ({paymentDetails.bankCode})</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-mono font-bold text-gray-900 tracking-wider">
                                        {paymentDetails.accountNumber}
                                    </span>
                                    <button
                                        onClick={handleCopyVA}
                                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                        title="Salin Nomor VA"
                                    >
                                        {copied ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-gray-500" />}
                                    </button>
                                </div>
                            </div>

                            {/* Expiry / Amount Info */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500">Total Pembayaran</p>
                                    <p className="font-semibold text-gray-900">
                                        Rp {paymentDetails.amount ? paymentDetails.amount.toLocaleString('id-ID') : '0'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Batas Waktu</p>
                                    <p className="font-semibold text-orange-600">
                                        {paymentDetails.expiryDate ? new Date(paymentDetails.expiryDate).toLocaleString('id-ID') : '-'}
                                    </p>
                                </div>
                            </div>

                            <div className="text-xs text-center text-gray-400 mt-2">
                                Menunggu pembayaran... Halaman akan otomatis update jika sudah dibayar.
                                {paymentDetails.status === "MOCK_PENDING" && (
                                    <span className="block mt-1 text-orange-400 font-mono">(MOCK DATA MODE)</span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* FLASH_MOBILE QR Code Display */}
                    {paymentDetails && paymentDetails.provider === 'FLASH_MOBILE' && paymentDetails.qrCode && (
                        <div className="space-y-4 text-center">
                            <p className="text-gray-500 text-sm font-semibold mb-2 text-transform uppercase">
                                Pembayaran QR Code
                            </p>
                            {paymentDetails.qrCode && (
                                <div className="flex justify-center mb-4">
                                    <QRCodeCanvas value={paymentDetails.qrCode} size={200} />
                                </div>
                            )}
                            <p className="text-sm text-gray-700">Scan QR Code di atas untuk menyelesaikan pembayaran.</p>
                            <p className="text-xs text-gray-400">
                                Gunakan aplikasi pembayaran favorit Anda (misal: OVO, GoPay, Dana, LinkAja, dll.)
                            </p>

                            {/* Expiry / Amount Info */}
                            <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                                <div>
                                    <p className="text-gray-500">Total Pembayaran</p>
                                    <p className="font-semibold text-gray-900">
                                        Rp {paymentDetails.amount ? paymentDetails.amount.toLocaleString('id-ID') : '0'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Batas Waktu</p>
                                    <p className="font-semibold text-orange-600">
                                        {paymentDetails.expiryDate ? new Date(paymentDetails.expiryDate).toLocaleString('id-ID') : '-'}
                                    </p>
                                </div>
                            </div>

                            <div className="text-xs text-center text-gray-400 mt-2">
                                Menunggu pembayaran... Halaman akan otomatis update jika sudah dibayar.
                                {paymentDetails.status === "MOCK_PENDING" && (
                                    <span className="block mt-1 text-orange-400 font-mono">(MOCK DATA MODE)</span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Fallback for other payment methods or missing details */}
                    {!paymentDetails && paymentData?.invoiceUrl && (
                        <div className="text-center p-6 border rounded mb-6">
                            <p>Silakan lanjutkan pembayaran melalui link ini:</p>
                            <a href={paymentData?.invoiceUrl} target="_blank" className="font-bold text-blue-600 underline">
                                Buka Halaman Pembayaran
                            </a>
                        </div>
                    )}

                    {/* Check Status */}
                    <button onClick={() => window.location.reload()}
                        className="w-full bg-[#b48d5e] hover:bg-[#a17a4b] text-white font-bold py-3 rounded-lg mb-4 transition shadow-sm">
                        Cek Status Pembayaran
                    </button>

                    <button onClick={() => router.push("/")}
                        className="w-full bg-white border border-gray-200 text-gray-600 font-bold py-3 rounded-lg hover:bg-gray-50 transition">
                        Kembali ke Beranda
                    </button>

                </div>

                {/* Secure Footer */}
                <div className="bg-gray-50 p-4 text-center text-xs text-gray-400 border-t border-gray-100 flex items-center justify-center gap-2">
                    <ShieldCheck size={14} />
                    Pembayaran Aman & Verifikasi Otomatis
                </div>
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={
            <div className="bg-gray-50 min-h-screen py-12 px-4 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#b48d5e] mx-auto mb-4"></div>
                    <p className="text-gray-500">Memuat halaman pembayaran...</p>
                </div>
            </div>
        }>
            <PaymentSuccessContent />
        </Suspense>
    );
}
