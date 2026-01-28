"use client";

import { useState, useEffect } from "react";
import { Upload, ChevronDown, CheckCircle, Loader2, AlertCircle } from "lucide-react";

// --- Types & Helper Component for Regions ---

interface Region {
    id: string;
    name: string;
}

interface RegionSelectorProps {
    values: { province: string; city: string; district: string };
    onChange: (field: "province" | "city" | "district", value: string) => void;
    required?: boolean;
}

function RegionSelector({ values, onChange, required }: RegionSelectorProps) {
    const [provinces, setProvinces] = useState<Region[]>([]);
    const [regencies, setRegencies] = useState<Region[]>([]);
    const [districts, setDistricts] = useState<Region[]>([]);

    const [loadingProv, setLoadingProv] = useState(false);
    const [loadingReg, setLoadingReg] = useState(false);
    const [loadingDist, setLoadingDist] = useState(false);

    const [selectedProvId, setSelectedProvId] = useState("");
    const [selectedRegId, setSelectedRegId] = useState("");

    // 1. Fetch Provinces on Mount
    useEffect(() => {
        setLoadingProv(true);
        fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
            .then(res => res.json())
            .then(data => setProvinces(data))
            .catch(err => console.error("Prov fetch err", err))
            .finally(() => setLoadingProv(false));
    }, []);

    // 2. Fetch Regencies when Prov ID changes
    useEffect(() => {
        if (!selectedProvId) {
            setRegencies([]);
            return;
        }
        setLoadingReg(true);
        fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProvId}.json`)
            .then(res => res.json())
            .then(data => setRegencies(data))
            .catch(err => console.error("Regency fetch err", err))
            .finally(() => setLoadingReg(false));
    }, [selectedProvId]);

    // 3. Fetch Districts when Regency ID changes
    useEffect(() => {
        if (!selectedRegId) {
            setDistricts([]);
            return;
        }
        setLoadingDist(true);
        fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${selectedRegId}.json`)
            .then(res => res.json())
            .then(data => setDistricts(data))
            .catch(err => console.error("District fetch err", err))
            .finally(() => setLoadingDist(false));
    }, [selectedRegId]);

    // Handlers
    const handleProvChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value;
        const name = provinces.find(p => p.id === id)?.name || "";

        setSelectedProvId(id);
        setSelectedRegId(""); // Reset child
        setDistricts([]); // Reset grandchild

        onChange("province", name);
        onChange("city", ""); // Reset downstream form values
        onChange("district", "");
    };

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value;
        const name = regencies.find(r => r.id === id)?.name || "";

        setSelectedRegId(id);

        onChange("city", name);
        onChange("district", ""); // Reset downstream
    };

    const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value;
        const name = districts.find(d => d.id === id)?.name || "";
        onChange("district", name);
    };

    return (
        <>
            <div className="mb-4">
                <label className="block text-xs font-bold text-gray-700 mb-1">Province *</label>
                <div className="relative">
                    <select
                        required={required}
                        className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:border-[#b48d5e] outline-none appearance-none disabled:bg-gray-100 placeholder-gray-400"
                        onChange={handleProvChange}
                        value={selectedProvId}
                    >
                        <option value="">{loadingProv ? "Loading..." : "Pilih Provinsi"}</option>
                        {provinces.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-xs font-bold text-gray-700 mb-1">Town / City *</label>
                <div className="relative">
                    <select
                        required={required}
                        className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:border-[#b48d5e] outline-none appearance-none disabled:bg-gray-100"
                        onChange={handleCityChange}
                        value={selectedRegId}
                        disabled={!selectedProvId}
                    >
                        <option value="">{loadingReg ? "Loading..." : "Pilih Kota/Kabupaten"}</option>
                        {regencies.map(r => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-xs font-bold text-gray-700 mb-1">Kecamatan *</label>
                <div className="relative">
                    <select
                        required={required}
                        className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:border-[#b48d5e] outline-none appearance-none disabled:bg-gray-100"
                        onChange={handleDistrictChange}
                        value={districts.find(d => d.name === values.district)?.id || ""}
                    >
                        <option value="">{loadingDist ? "Loading..." : "Pilih Kecamatan"}</option>
                        {districts.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                </div>
            </div>
        </>
    );
}

interface CheckoutFormProps {
    onSubmit: (data: any) => void;
    isSubmitting: boolean;
    items: any[];
    total: number;
    onBack: () => void;
}

export default function CheckoutForm({ onSubmit, isSubmitting, items, total, onBack }: CheckoutFormProps) {
    const [shipToDifferentAddress, setShipToDifferentAddress] = useState(false);
    const [createAccount, setCreateAccount] = useState(false);

    // KTP State
    const [ktpPreview, setKtpPreview] = useState<string | null>(null);
    const [ktpUrl, setKtpUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

    // Billing State
    const [billing, setBilling] = useState({
        firstName: "",
        lastName: "",
        company: "",
        country: "Indonesia",
        province: "",
        city: "",
        district: "",
        address: "",
        apartment: "",
        postcode: "",
        phone: "",
        email: ""
    });

    // Shipping State
    const [shipping, setShipping] = useState({
        firstName: "",
        lastName: "",
        company: "",
        country: "Indonesia",
        province: "",
        city: "",
        district: "",
        address: "",
        apartment: "",
        postcode: ""
    });

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Create local preview
        const objectUrl = URL.createObjectURL(file);
        setKtpPreview(objectUrl);
        setIsUploading(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (data.success) {
                setKtpUrl(data.url);
            } else {
                alert("Upload failed: " + data.error);
                setKtpPreview(null);
            }
        } catch (err) {
            console.error("Upload failed");
            alert("Gagal mengupload KTP. Silakan coba lagi.");
            setKtpPreview(null);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Specific Validation for KTP
        if (!ktpUrl && !isUploading) {
            alert("Wajib upload Foto KTP dan tunggu hingga selesai.");
            const ktpSection = document.getElementById("ktp-upload-section");
            ktpSection?.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        if (isUploading) {
            alert("Sedang mengupload KTP, harap tunggu...");
            return;
        }

        if (!selectedPaymentMethod) {
            alert("Pilih metode pembayaran terlebih dahulu.");
            return;
        }

        const checkoutData = {
            billing,
            shipping: shipToDifferentAddress ? shipping : billing,
            createAccount,
            ktpImage: (window as any).ktpUrl || ktpUrl || null,
            paymentMethod: selectedPaymentMethod // Pass selected method
        };

        onSubmit(checkoutData);
    };

    return (
        <div className="bg-white p-4 md:p-8 rounded-lg shadow-sm border border-gray-200">
            <h1 className="text-3xl font-bold text-[#b48d5e] mb-8 text-center font-serif">Checkout</h1>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* --- LEFT COLUMN: BILLING & DETAILS --- */}
                <div>
                    <h2 className="text-xl font-bold mb-6 text-[#1e3a8a] border-b pb-2">Billing Details</h2>

                    {/* Names */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">First Name *</label>
                            <input required type="text" className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:border-[#b48d5e] outline-none"
                                value={billing.firstName} onChange={e => setBilling({ ...billing, firstName: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Last Name *</label>
                            <input required type="text" className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:border-[#b48d5e] outline-none"
                                value={billing.lastName} onChange={e => setBilling({ ...billing, lastName: e.target.value })} />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-xs font-bold text-gray-700 mb-1">Company Name (optional)</label>
                        <input type="text" className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:border-[#b48d5e] outline-none"
                            value={billing.company} onChange={e => setBilling({ ...billing, company: e.target.value })} />
                    </div>

                    <div className="mb-4">
                        <label className="block text-xs font-bold text-gray-700 mb-1">Country / Region *</label>
                        <div className="w-full border border-gray-300 px-3 py-2 rounded text-sm bg-gray-50 text-gray-600 font-bold">Indonesia</div>
                    </div>

                    {/* Reusable Dynamic Region Selector for Billing */}
                    <RegionSelector
                        required={true}
                        values={{ province: billing.province, city: billing.city, district: billing.district }}
                        onChange={(field, val) => setBilling(prev => ({ ...prev, [field]: val }))}
                    />

                    <div className="mb-4">
                        <label className="block text-xs font-bold text-gray-700 mb-1">Street address *</label>
                        <input required placeholder="House number and street name" type="text" className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:border-[#b48d5e] outline-none mb-2"
                            value={billing.address} onChange={e => setBilling({ ...billing, address: e.target.value })} />
                        <input placeholder="Apartment, suite, unit, etc. (optional)" type="text" className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:border-[#b48d5e] outline-none"
                            value={billing.apartment} onChange={e => setBilling({ ...billing, apartment: e.target.value })} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Postcode / ZIP *</label>
                            <input required type="number" className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:border-[#b48d5e] outline-none"
                                value={billing.postcode} onChange={e => setBilling({ ...billing, postcode: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Phone *</label>
                            <input required type="tel" className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:border-[#b48d5e] outline-none"
                                value={billing.phone} onChange={e => setBilling({ ...billing, phone: e.target.value })} />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>
                        <input required type="email" className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:border-[#b48d5e] outline-none"
                            value={billing.email} onChange={e => setBilling({ ...billing, email: e.target.value })} />
                    </div>

                    {/* KTP Upload Section - Moved here as part of user details */}
                    <div id="ktp-upload-section" className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <label className="block text-sm font-bold text-[#1e3a8a] mb-2">Upload Foto KTP (Wajib)</label>
                        <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:bg-white transition cursor-pointer relative bg-white">
                            <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileUpload} />

                            {ktpPreview ? (
                                <div className="flex flex-col items-center">
                                    <img src={ktpPreview} alt="KTP Preview" className="h-32 object-contain mb-2 rounded border border-gray-200" />
                                    {isUploading ? (
                                        <span className="text-xs text-blue-500 font-bold flex items-center animate-pulse">
                                            <Loader2 size={12} className="mr-1 animate-spin" /> Mengupload...
                                        </span>
                                    ) : (
                                        <span className="text-xs text-green-600 font-bold flex items-center">
                                            <CheckCircle size={12} className="mr-1" /> Sukses Terupload
                                        </span>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center text-blue-400">
                                    <Upload size={32} className="mb-2" />
                                    <span className="text-xs font-bold">Klik atau Geser Foto KTP ke sini</span>
                                    <span className="text-[10px] text-gray-400 mt-1">JPEG, PNG (Max 2MB)</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Checkboxes */}
                    <div className="mb-6 space-y-3">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 text-[#b48d5e] rounded border-gray-300 focus:ring-[#b48d5e]"
                                checked={createAccount} onChange={e => setCreateAccount(e.target.checked)} />
                            <span className="text-sm font-bold text-gray-700">Create an account?</span>
                        </label>

                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 text-[#b48d5e] rounded border-gray-300 focus:ring-[#b48d5e]"
                                checked={shipToDifferentAddress} onChange={e => setShipToDifferentAddress(e.target.checked)} />
                            <span className="text-sm font-bold text-gray-700">Ship to a different address?</span>
                        </label>
                    </div>

                    {/* Shipping Form */}
                    {shipToDifferentAddress && (
                        <div className="mt-8 border-t pt-6 animate-fade-in">
                            <h2 className="text-xl font-bold mb-6 text-[#1e3a8a]">Shipping Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">First Name *</label>
                                    <input required={shipToDifferentAddress} type="text" className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:border-[#b48d5e] outline-none"
                                        value={shipping.firstName} onChange={e => setShipping({ ...shipping, firstName: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Last Name *</label>
                                    <input required={shipToDifferentAddress} type="text" className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:border-[#b48d5e] outline-none"
                                        value={shipping.lastName} onChange={e => setShipping({ ...shipping, lastName: e.target.value })} />
                                </div>
                            </div>

                            <RegionSelector
                                required={shipToDifferentAddress}
                                values={{ province: shipping.province, city: shipping.city, district: shipping.district }}
                                onChange={(field, val) => setShipping(prev => ({ ...prev, [field]: val }))}
                            />

                            <div className="mb-4">
                                <label className="block text-xs font-bold text-gray-700 mb-1">Street address *</label>
                                <input required={shipToDifferentAddress} placeholder="House number and street name" type="text" className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:border-[#b48d5e] outline-none"
                                    value={shipping.address} onChange={e => setShipping({ ...shipping, address: e.target.value })} />
                            </div>
                        </div>
                    )}
                </div>

                {/* --- RIGHT COLUMN: ORDER SUMMARY & PAYMENT --- */}
                <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 h-fit">
                    <h2 className="text-xl font-bold mb-6 text-[#1e3a8a]">Your Order</h2>

                    {/* Order List */}
                    <div className="space-y-4 mb-6 border-b border-gray-200 pb-4">
                        <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                            <span>Product</span>
                            <span>Subtotal</span>
                        </div>
                        {items?.map((item: any) => (
                            <div key={item.id} className="flex justify-between text-sm text-gray-700">
                                <span>{item.name} <span className="font-bold text-gray-500">x {item.quantity}</span></span>
                                <span className="font-semibold">Rp {(item.price * item.quantity).toLocaleString("id-ID")}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between font-bold text-gray-800 text-lg mb-6">
                        <span>Total</span>
                        <span className="text-[#b48d5e]">Rp {total.toLocaleString("id-ID")}</span>
                    </div>

                    {/* Shipping Options (Visual Match) */}
                    <div className="mb-6">
                        <h3 className="font-bold text-sm text-gray-700 mb-3">Shipping</h3>
                        <div className="space-y-2 text-sm">
                            <label className="flex items-center space-x-2">
                                <input type="radio" name="shipping_opt" checked className="text-[#b48d5e] focus:ring-[#b48d5e]" readOnly />
                                <span>JNE Reg: <span className="font-bold">Rp 0 (Free Promo)</span></span>
                            </label>
                        </div>
                    </div>


                    {/* Payment Method Selection */}
                    <div className="">
                        <h2 className="text-lg font-bold mb-4 text-[#1e3a8a]">Metode Pembayaran</h2>

                        <div className="grid grid-cols-1 gap-3">
                            {/* BNI */}
                            <label className={`border rounded-lg p-3 flex items-center cursor-pointer transition ${selectedPaymentMethod === 'BNI' ? 'border-[#b48d5e] bg-white ring-1 ring-[#b48d5e]' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                                <input type="radio" name="payment_method" value="BNI" className="hidden"
                                    checked={selectedPaymentMethod === 'BNI'} onChange={() => setSelectedPaymentMethod('BNI')} />
                                <div className="w-4 h-4 rounded-full border border-gray-400 mr-3 flex items-center justify-center">
                                    {selectedPaymentMethod === 'BNI' && <div className="w-2.5 h-2.5 rounded-full bg-[#b48d5e]" />}
                                </div>
                                <img src="/images/banks/bni.png" alt="BNI" className="h-5 w-auto object-contain mr-auto" />
                                <span className="text-xs font-bold text-gray-700">Virtual Account BNI</span>
                            </label>

                            {/* PERMATA */}
                            <label className={`border rounded-lg p-3 flex items-center cursor-pointer transition ${selectedPaymentMethod === 'PERMATA' ? 'border-[#b48d5e] bg-white ring-1 ring-[#b48d5e]' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                                <input type="radio" name="payment_method" value="PERMATA" className="hidden"
                                    checked={selectedPaymentMethod === 'PERMATA'} onChange={() => setSelectedPaymentMethod('PERMATA')} />
                                <div className="w-4 h-4 rounded-full border border-gray-400 mr-3 flex items-center justify-center">
                                    {selectedPaymentMethod === 'PERMATA' && <div className="w-2.5 h-2.5 rounded-full bg-[#b48d5e]" />}
                                </div>
                                <img src="/images/banks/permata.png" alt="PERMATA" className="h-7 w-auto object-contain mr-auto" />
                                <span className="text-xs font-bold text-gray-700">Virtual Account Permata</span>
                            </label>

                            {/* BRI */}
                            <label className={`border rounded-lg p-3 flex items-center cursor-pointer transition ${selectedPaymentMethod === 'BRI' ? 'border-[#b48d5e] bg-white ring-1 ring-[#b48d5e]' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                                <input type="radio" name="payment_method" value="BRI" className="hidden"
                                    checked={selectedPaymentMethod === 'BRI'} onChange={() => setSelectedPaymentMethod('BRI')} />
                                <div className="w-4 h-4 rounded-full border border-gray-400 mr-3 flex items-center justify-center">
                                    {selectedPaymentMethod === 'BRI' && <div className="w-2.5 h-2.5 rounded-full bg-[#b48d5e]" />}
                                </div>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/BANK_BRI_logo.svg/2560px-BANK_BRI_logo.svg.png" alt="BRI" className="h-5 w-auto object-contain mr-auto" />
                                <span className="text-xs font-bold text-gray-700">Virtual Account BRI</span>
                            </label>

                            {/* MANDIRI */}
                            <label className={`border rounded-lg p-3 flex items-center cursor-pointer transition ${selectedPaymentMethod === 'MANDIRI' ? 'border-[#b48d5e] bg-white ring-1 ring-[#b48d5e]' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                                <input type="radio" name="payment_method" value="MANDIRI" className="hidden"
                                    checked={selectedPaymentMethod === 'MANDIRI'} onChange={() => setSelectedPaymentMethod('MANDIRI')} />
                                <div className="w-4 h-4 rounded-full border border-gray-400 mr-3 flex items-center justify-center">
                                    {selectedPaymentMethod === 'MANDIRI' && <div className="w-2.5 h-2.5 rounded-full bg-[#b48d5e]" />}
                                </div>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Bank_Mandiri_logo_2016.svg/2560px-Bank_Mandiri_logo_2016.svg.png" alt="MANDIRI" className="h-7 w-auto object-contain mr-auto" />
                                <span className="text-xs font-bold text-gray-700">Virtual Account Mandiri</span>
                            </label>

                            {/* CIMB */}
                            <label className={`border rounded-lg p-3 flex items-center cursor-pointer transition ${selectedPaymentMethod === 'CIMB' ? 'border-[#b48d5e] bg-white ring-1 ring-[#b48d5e]' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                                <input type="radio" name="payment_method" value="CIMB" className="hidden"
                                    checked={selectedPaymentMethod === 'CIMB'} onChange={() => setSelectedPaymentMethod('CIMB')} />
                                <div className="w-4 h-4 rounded-full border border-gray-400 mr-3 flex items-center justify-center">
                                    {selectedPaymentMethod === 'CIMB' && <div className="w-2.5 h-2.5 rounded-full bg-[#b48d5e]" />}
                                </div>
                                <img src="/images/banks/cimb.png" alt="CIMB Niaga" className="h-5 w-auto object-contain mr-auto" />
                                <span className="text-xs font-bold text-gray-700">Virtual Account CIMB Niaga</span>
                            </label>

                            {/* BSI */}
                            <label className={`border rounded-lg p-3 flex items-center cursor-pointer transition ${selectedPaymentMethod === 'BSI' ? 'border-[#b48d5e] bg-white ring-1 ring-[#b48d5e]' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                                <input type="radio" name="payment_method" value="BSI" className="hidden"
                                    checked={selectedPaymentMethod === 'BSI'} onChange={() => setSelectedPaymentMethod('BSI')} />
                                <div className="w-4 h-4 rounded-full border border-gray-400 mr-3 flex items-center justify-center">
                                    {selectedPaymentMethod === 'BSI' && <div className="w-2.5 h-2.5 rounded-full bg-[#b48d5e]" />}
                                </div>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Bank_Syariah_Indonesia.svg/2560px-Bank_Syariah_Indonesia.svg.png" alt="BSI" className="h-7 w-auto object-contain mr-auto" />
                                <span className="text-xs font-bold text-gray-700">Virtual Account BSI</span>
                            </label>
                        </div>
                    </div>

                    <button type="submit" disabled={isUploading || isSubmitting}
                        className="w-full bg-[#1e3a8a] text-white font-bold py-4 rounded-lg mt-8 hover:bg-[#152c6e] transition shadow-lg flex items-center justify-center">
                        {isSubmitting ? (
                            <>
                                <Loader2 size={18} className="mr-2 animate-spin" />
                                Processing Order...
                            </>
                        ) : (
                            "PLACE ORDER"
                        )}
                    </button>

                    <button type="button" onClick={onBack} className="w-full text-gray-500 text-sm mt-4 hover:underline">
                        Return to Cart
                    </button>

                </div>
            </form>
        </div>
    );
}
