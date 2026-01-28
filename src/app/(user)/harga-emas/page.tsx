/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { MapPin, ChevronRight, ChevronDown, Minus, Home } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const formatPrice = (price: number) => price.toLocaleString('id-ID');

const SECTIONS = [
    {
        title: "Emas Batangan",
        headers: ["Berat", "Harga Dasar", "Harga (+Pajak PPh 0.25%)"],
        items: [
            { weight: "0.5 gr", price: 1445000, taxPrice: 1448613 },
            { weight: "1 gr", price: 2790000, taxPrice: 2796975 },
            { weight: "2 gr", price: 5520000, taxPrice: 5533800 },
            { weight: "3 gr", price: 8255000, taxPrice: 8275638 },
            { weight: "5 gr", price: 13725000, taxPrice: 13759313 },
            { weight: "10 gr", price: 27395000, taxPrice: 27463488 },
            { weight: "25 gr", price: 68352000, taxPrice: 68532905 },
            { weight: "50 gr", price: 136645000, taxPrice: 136986613 },
            { weight: "100 gr", price: 273212000, taxPrice: 273895030 },
            { weight: "250 gr", price: 682765000, taxPrice: 684471913 },
            { weight: "500 gr", price: 1365320000, taxPrice: 1368733300 },
            { weight: "1000 gr", price: 2730600000, taxPrice: 2737426500 },
        ]
    },
    {
        title: "Emas Batangan Gift Series",
        headers: ["Berat", "Harga Dasar", "Harga (+Pajak PPh 0.25%)"],
        items: [
            { weight: "0.5 gr", price: 1515000, taxPrice: 1518788 },
            { weight: "1 gr", price: 2940000, taxPrice: 2947350 },
        ]
    },
    {
        title: "Emas Batangan Selamat Idul Fitri",
        headers: ["Berat", "Harga Dasar", "Harga (+Pajak PPh 0.25%)"],
        items: [
            { weight: "5 gr", price: 14560000, taxPrice: 14596400 },
        ]
    },
    {
        title: "Emas Batangan Batik Seri III",
        headers: ["Berat", "Harga Dasar", "Harga (+Pajak PPh 0.25%)"],
        items: [
            { weight: "10 gr", price: 28400000, taxPrice: 28471000 },
            { weight: "20 gr", price: 56000000, taxPrice: 56140000 },
        ]
    },
    {
        title: "Perak Murni",
        headers: ["Berat", "Harga Dasar", "Harga Sudah Termasuk PPN 11%"],
        items: [
            { weight: "250 gr", price: 14787500, taxPrice: 16414125 },
            { weight: "500 gr", price: 28775000, taxPrice: 31940250 },
        ]
    },
    {
        title: "Perak Heritage",
        headers: ["Berat", "Harga Dasar", "Harga Sudah Termasuk PPN 11%"],
        items: [
            { weight: "31.1 gr", price: 2337635, taxPrice: 2594775 },
            { weight: "186.6 gr", price: 12904126, taxPrice: 14323580 },
        ]
    },
    {
        title: "Liontin Batik Seri III",
        headers: ["Berat", "Harga Dasar", "Harga Sudah Termasuk PPN 1.65%", "Harga Sudah Termasuk PPN 1.1% + PPh 22 0.25%"],
        items: [
            { weight: "8 gr", price: 17275456, taxPrice: 17560501, taxPrice2: 17508675 },
        ]
    }
];

export default function GoldPricePage() {
    const [simulationBudget, setSimulationBudget] = useState("");

    return (
        <div className="bg-white pb-20">
            {/* Breadcrumb Section (Grey Bar) */}
            <div className="bg-gray-100 py-3 border-b border-gray-200">
                <div className="container mx-auto px-4 md:px-8 flex items-center text-xs text-gray-500">
                    <Link href="/" className="hover:text-primary"><Home size={14} /></Link>
                    <ChevronRight size={14} className="mx-2" />
                    <span className="font-bold text-[#b48d5e]">Harga Emas Hari Ini</span>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-8 py-10 text-gray-800 font-sans">

                {/* Header Banner */}
                <div className="w-full h-48 relative rounded-2xl overflow-hidden mb-8 shadow-lg">
                    <Image
                        src="/gold-banner.png"
                        alt="Gold Banner"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white drop-shadow-md tracking-widest uppercase">
                            HARGA EMAS
                        </h2>
                    </div>
                </div>

                {/* Location Bar: Exact Blue Block */}
                <div className="bg-[#1e3a8a] text-white rounded-md p-4 flex flex-col md:flex-row justify-between items-center mb-10 shadow-sm min-h-[70px]">
                    <div className="flex items-center mb-4 md:mb-0">
                        <span className="font-bold text-[#fceeb5] mr-6 text-sm tracking-wide">Lokasi Butik</span>
                    </div>
                    <div className="flex-1 flex items-center justify-center text-sm font-bold tracking-wide">
                        <MapPin className="mr-2" size={18} />
                        BFI M - Graha Dipta (Pengambilan di Butik) Pulo Gadung
                    </div>
                    <button className="border border-white rounded-full px-6 py-2 text-xs font-bold hover:bg-white/10 transition uppercase tracking-wider">
                        Cek Alamat Butik
                    </button>
                </div>

                {/* Header Title */}
                <div className="mb-8">
                    <h1 className="text-[28px] font-bold text-[#1e3a8a] mb-2 font-serif">Harga Emas Hari Ini, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</h1>
                    <p className="text-[#666666] text-sm font-medium">Harga di-update setiap hari pkl. 08.30 WIB</p>
                </div>

                {/* Tables Section */}
                <div className="mb-16 space-y-12">
                    {/* 1. GOLD GROUP (Indices 0-3) */}
                    <div className="border-b border-gray-100 pb-4">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b-2 border-gray-100">
                                        {SECTIONS[0].headers.map((h, i) => (
                                            <th key={i} className={`py-4 px-4 font-bold text-gray-500 ${i === 0 ? 'text-left' : 'text-right'}`}>
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {SECTIONS.slice(0, 4).map((section, idx) => (
                                        <>
                                            {/* Section Title Row */}
                                            <tr key={`gold-title-${idx}`}>
                                                <td colSpan={3} className="py-6 px-4 font-bold text-[#b48d5e] text-base pt-10">
                                                    {section.title}
                                                </td>
                                            </tr>
                                            {/* Data Rows */}
                                            {section.items.map((item, i) => (
                                                <tr key={`gold-item-${idx}-${i}`} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                                    <td className="py-4 px-4 font-medium text-gray-600">{item.weight}</td>
                                                    <td className="py-4 px-4 text-right font-medium text-gray-600">{formatPrice(item.price)}</td>
                                                    <td className="py-4 px-4 text-right font-medium text-gray-600">{formatPrice(item.taxPrice)}</td>
                                                </tr>
                                            ))}
                                        </>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 2. SILVER GROUP (Indices 4-5) */}
                    <div className="border-b border-gray-100 pb-4">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b-2 border-gray-100">
                                        {SECTIONS[4].headers.map((h, i) => (
                                            <th key={i} className={`py-4 px-4 font-bold text-gray-500 ${i === 0 ? 'text-left' : 'text-right'}`}>
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {SECTIONS.slice(4, 6).map((section, idx) => (
                                        <>
                                            <tr key={`silver-title-${idx}`}>
                                                <td colSpan={3} className="py-6 px-4 font-bold text-[#b48d5e] text-base pt-10">
                                                    {section.title}
                                                </td>
                                            </tr>
                                            {section.items.map((item, i) => (
                                                <tr key={`silver-item-${idx}-${i}`} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                                    <td className="py-4 px-4 font-medium text-gray-600">{item.weight}</td>
                                                    <td className="py-4 px-4 text-right font-medium text-gray-600">{formatPrice(item.price)}</td>
                                                    <td className="py-4 px-4 text-right font-medium text-gray-600">{formatPrice(item.taxPrice)}</td>
                                                </tr>
                                            ))}
                                        </>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 3. LIONTIN GROUP (Index 6) */}
                    <div className="border-b border-gray-100 pb-4">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b-2 border-gray-100">
                                        {SECTIONS[6].headers.map((h, i) => (
                                            <th key={i} className={`py-4 px-4 font-bold text-gray-500 ${i === 0 ? 'text-left' : 'text-right'}`}>
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {SECTIONS.slice(6, 7).map((section, idx) => (
                                        <>
                                            <tr key={`liontin-title-${idx}`}>
                                                <td colSpan={4} className="py-6 px-4 font-bold text-[#b48d5e] text-base pt-10">
                                                    {section.title}
                                                </td>
                                            </tr>
                                            {section.items.map((item, i) => (
                                                <tr key={`liontin-item-${idx}-${i}`} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                                    <td className="py-4 px-4 font-medium text-gray-600">{item.weight}</td>
                                                    <td className="py-4 px-4 text-right font-medium text-gray-600">{formatPrice(item.price)}</td>
                                                    <td className="py-4 px-4 text-right font-medium text-gray-600">{formatPrice(item.taxPrice)}</td>
                                                    {
                                                        (item as any).taxPrice2 && (
                                                            <td className="py-4 px-4 text-right font-medium text-gray-600">{formatPrice((item as any).taxPrice2)}</td>
                                                        )
                                                    }
                                                </tr>
                                            ))}
                                        </>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Simulation Section: Updated to match Screenshot 2 */}
                <div className="bg-[#1e3a8a] rounded-lg shadow-xl mb-12 overflow-hidden">
                    {/* Top Toolbar */}
                    <div className="flex justify-center gap-4 py-6 border-b border-blue-800/30">
                        <button className="bg-[#b48d5e] text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#a37d50] transition shadow-md">
                            Beli Emas
                        </button>
                        <button className="bg-[#b48d5e] text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#a37d50] transition shadow-md">
                            Simulasi Buyback
                        </button>
                    </div>

                    {/* Content Box */}
                    <div className="p-8 md:p-10 text-white">
                        <div className="flex flex-col md:flex-row gap-12 items-end">
                            {/* Title & Desc */}
                            <div className="flex-1">
                                <h3 className="text-[#b48d5e] font-bold text-lg mb-2">Simulasi Pembelian Emas</h3>
                                <p className="text-sm leading-relaxed opacity-90 text-gray-200">
                                    Berapa anggaran yang anda miliki? Silakan masukkan anggaran, kami bantu untuk menghitung berapa emas batangan Antam yang dapat dimiliki.
                                </p>
                            </div>

                            {/* Input Area */}
                            <div className="flex-1 w-full flex gap-0">
                                <div className="flex-1">
                                    <label className="block text-[10px] font-bold uppercase mb-2 tracking-widest text-[#b48d5e]">Anggaran Anda</label>
                                    <input
                                        type="text"
                                        placeholder="masukan anggaran anda"
                                        className="w-full h-12 px-4 text-gray-800 text-sm focus:outline-none placeholder:text-gray-300 placeholder:text-xs bg-white rounded-l-md"
                                        value={simulationBudget}
                                        onChange={(e) => setSimulationBudget(e.target.value)}
                                    />
                                </div>
                                <button className="h-12 mt-auto px-8 bg-[#b48d5e] text-white font-bold text-sm hover:bg-[#a37d50] transition-colors rounded-r-md uppercase tracking-wider">
                                    Hitung
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info & CertiEye Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start mb-12">
                    {/* Left Text */}
                    <div className="pt-4">
                        <h3 className="text-[#b48d5e] text-3xl font-serif font-bold mb-6 leading-tight">
                            Pelayanan terbaik di logammulia.com
                        </h3>
                        <p className="text-gray-500 text-sm leading-7 mb-6 text-justify">
                            Hanya di logammulia.com Anda mendapatkan emas batangan ANTAM LM yang asli dengan kemurnian 999.9. Produk kami memberikan keamanan dan ketenangan pikiran dalam berinvestasi. Nikmatin kenyamanan berbelanja emas tanpa meninggalkan rumah. logammulia.com menawarkan layanan pengiriman ekspedisi yang cepat dan aman langsung ke alamat Anda, menjadikan investasi emas lebih praktis.
                        </p>
                        <Link href="#" className="flex items-center text-[#1e3a8a] font-bold text-xs uppercase tracking-wider hover:underline group">
                            Selengkapnya <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Right CertiEye Card (Header + Body Style) */}
                    <div className="rounded-xl overflow-hidden shadow-lg border border-gray-100">
                        {/* Gold Header */}
                        <div className="bg-[#b48d5e] p-4 flex justify-between items-center text-white">
                            <h3 className="font-bold text-base">Teknologi CertiEye</h3>
                            <Minus size={20} className="cursor-pointer opacity-80 hover:opacity-100" />
                        </div>

                        {/* White Body */}
                        <div className="bg-white p-6 relative">
                            <div className="relative z-10 w-[65%]">
                                <p className="text-xs text-gray-500 leading-relaxed mb-4">
                                    Setiap produk emas ANTAM LM dihasilkan melalui fasilitas <i>gold refinery</i> (pemurnian emas) yang telah terakreditasi LBMA (London Bullion Market Association) untuk menjamin kualitas dan kemurnian produk emas logam mulia.
                                </p>
                                <p className="text-xs text-gray-500 leading-relaxed mb-4">
                                    Dilengkapi dengan teknologi CertiEye untuk meningkatkan keamanan produk dengan sertifikat yang menyatu dengan kemasan (khusus pecahan 0.5 gram hingga 100 gram).
                                </p>
                                <p className="text-xs text-gray-400 leading-relaxed italic">
                                    Pastikan kemasan dalam kondisi baik untuk memastikan keaslian produk.
                                </p>
                            </div>

                            {/* Circle Image Effect */}
                            <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br from-[#0088cc] to-[#005580] rounded-full border-4 border-white shadow-xl flex items-center justify-center">
                                {/* Placeholder for App Image */}
                                <div className="text-center text-white">
                                    <div className="text-[8px] font-bold uppercase mb-1">Scan Code</div>
                                    <div className="w-12 h-12 bg-white mx-auto rounded-sm flex items-center justify-center text-black text-[6px]">QR</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Accordions */}
                <div className="space-y-4">
                    <div className="bg-[#1e3a8a] text-white px-6 py-4 rounded-md flex justify-between items-center cursor-pointer hover:bg-blue-900 transition-colors shadow-md">
                        <span className="font-bold text-sm">Petunjuk Pembelian Emas</span>
                        <ChevronDown size={20} />
                    </div>

                    <div className="bg-[#1e3a8a] text-white px-6 py-4 rounded-md flex justify-between items-center cursor-pointer hover:bg-blue-900 transition-colors shadow-md">
                        <span className="font-bold text-sm">Pembelian Cepat</span>
                        <ChevronDown size={20} />
                    </div>
                </div>

            </div>
        </div>
    );
}
