"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, MapPin, Navigation } from "lucide-react";
import { clsx } from "clsx";

const SLIDES = [
    { id: 1, mobile: "/images/slide1.jpg", desktop: "/images/slide1 V2.jpg", alt: "Banner 1" },
    { id: 2, mobile: "/images/slide2.jpg", desktop: "/images/slide2 V2.jpg", alt: "Banner 2" },
    { id: 3, mobile: "/images/slide3.jpg", desktop: "/images/slide3 V2.jpg", alt: "Banner 3" },
    { id: 4, mobile: "/images/slide4.jpg", desktop: "/images/slide4 V2.jpg", alt: "Banner 4" },
    { id: 5, mobile: "/images/slide5.jpg", desktop: "/images/slide5 V2.jpg", alt: "Banner 5" },
    { id: 6, mobile: "/images/slide6.jpg", desktop: "/images/slide6 V2.jpg", alt: "Banner 6" },
    { id: 7, mobile: "/images/slide7.jpg", desktop: "/images/slide7 V2.jpg", alt: "Banner 7" },
    { id: 8, mobile: "/images/slide8.jpg", desktop: "/images/slide8 V2.jpg", alt: "Banner 8" },
];

export default function HeroSlider() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

    return (
        <div className="relative w-full bg-[#1e3a8a] z-0">
            {/* =========== MOBILE LAYOUT =========== */}
            <div className="lg:hidden">
                {/* 1. HERO SLIDER - Full Width */}
                <div className="w-full h-[450px] relative overflow-hidden bg-gray-100">
                    {SLIDES.map((slide, index) => (
                        <div
                            key={slide.id}
                            className={clsx(
                                "absolute inset-0 transition-opacity duration-700 ease-in-out",
                                index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                            )}
                        >
                            <Image
                                src={slide.mobile}
                                alt={slide.alt}
                                fill
                                className="object-cover object-center"
                                priority={index === 0}
                            />
                        </div>
                    ))}

                    {/* Dots */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
                        {SLIDES.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentSlide(idx)}
                                className={clsx(
                                    "w-2 h-2 rounded-full transition-all",
                                    idx === currentSlide ? "bg-white w-5" : "bg-white/50"
                                )}
                            />
                        ))}
                    </div>
                </div>

                {/* 2. ACTION BUTTONS - 2 columns side by side */}
                <div className="bg-[#1e3a8a] px-4 py-6">
                    <div className="grid grid-cols-2 gap-3">
                        <button className="bg-[#c2985b] text-white font-bold py-3 px-4 rounded-3xl text-[11px] uppercase tracking-wider shadow-md flex justify-between items-center hover:brightness-110 transition-all border-t border-white/20">
                            <span>Beli Emas</span>
                            <ChevronRight size={16} />
                        </button>
                        <button className="bg-[#c2985b] text-white font-bold py-3 px-4 rounded-3xl text-[11px] uppercase tracking-wider shadow-md flex justify-between items-center hover:brightness-110 transition-all border-t border-white/20">
                            <span className="text-left">Simulasi Buyback</span>
                            <ChevronRight size={16} />
                        </button>
                    </div>

                    {/* Update Time */}
                    <div className="mt-4 flex items-center justify-center text-[10px] text-white/70 font-medium tracking-wide">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Perubahan terakhir: 27 Jan 2026 08:38:00
                    </div>
                </div>

                {/* 3. PRICE CARDS - 2 columns side by side */}
                <div className="grid grid-cols-2">
                    {/* EMAS */}
                    <div className="relative bg-gradient-to-br from-[#d4af37] to-[#B8860B] p-4 overflow-hidden min-h-[160px]">
                        {/* Texture Background */}
                        <div className="absolute inset-0 z-0 opacity-20 hover:opacity-30 transition-opacity mix-blend-overlay">
                            <Image src="/images/emas.jpg" alt="Gold Texture" fill className="object-cover" />
                        </div>

                        {/* Gold Bar Image - Right Side Angled */}
                        <div className="absolute -right-4 top-8 z-0 opacity-80 transform rotate-[15deg] scale-110">
                            <Image
                                src="/images/emas-batangan.png"
                                alt="Emas Batangan"
                                width={100}
                                height={120}
                                className="object-contain drop-shadow-xl"
                            />
                        </div>

                        <div className="relative z-10 text-white">
                            <h3 className="text-xl font-bold font-serif mb-0 leading-none drop-shadow-sm">Emas</h3>
                            <p className="text-[10px] text-white/90 mb-2 font-medium">Harga/gram</p>

                            <p className="text-[22px] font-bold mb-1 leading-tight drop-shadow-md tracking-tight">Rp2.916.000,00</p>

                            <div className="flex items-center gap-1 mb-4">
                                <span className="text-[10px] font-bold text-red-100 bg-black/10 px-1.5 py-0.5 rounded">▼ Rp-1.000</span>
                            </div>

                            <p className="text-[9px] text-white/80 mb-2 block font-medium">Harga Terakhir: Rp2.917.000,00</p>

                            <button className="text-[9px] font-bold tracking-widest flex items-center hover:underline opacity-90 uppercase mt-2">
                                LEBIH LENGKAP <ChevronRight size={10} className="ml-1" />
                            </button>
                        </div>
                    </div>

                    {/* PERAK */}
                    <div className="relative bg-gradient-to-br from-[#A0A0A0] to-[#757575] p-4 overflow-hidden min-h-[160px]">
                        {/* Texture Background */}
                        <div className="absolute inset-0 z-0 opacity-20 hover:opacity-30 transition-opacity mix-blend-overlay">
                            <Image src="/images/perak.jpg" alt="Silver Texture" fill className="object-cover" />
                        </div>

                        {/* Silver Bar Image - Right Side Angled */}
                        <div className="absolute -right-4 top-8 z-0 opacity-80 transform rotate-[15deg] scale-110">
                            <Image
                                src="/images/perak-batangan.png"
                                alt="Perak Batangan"
                                width={100}
                                height={120}
                                className="object-contain drop-shadow-xl"
                            />
                        </div>

                        <div className="relative z-10 text-white">
                            <h3 className="text-xl font-bold font-serif mb-0 leading-none drop-shadow-sm">Perak</h3>
                            <p className="text-[10px] text-white/90 mb-2 font-medium">Harga/gram</p>

                            <p className="text-[22px] font-bold mb-1 leading-tight drop-shadow-md tracking-tight">Rp66.750,00</p>

                            <div className="flex items-center gap-1 mb-4">
                                <span className="text-[10px] font-bold text-green-100 bg-black/10 px-1.5 py-0.5 rounded">▲ Rp1.150</span>
                            </div>

                            <p className="text-[9px] text-white/80 mb-2 block font-medium">Harga Terakhir: Rp65.600,00</p>

                            <button className="text-[9px] font-bold tracking-widest flex items-center hover:underline opacity-90 uppercase mt-2">
                                LEBIH LENGKAP <ChevronRight size={10} className="ml-1" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* 4. LOCATION BAR - Dark Blue Background */}
                <div className="bg-[#1e3a8a] px-5 py-6 border-t border-white/10">
                    <div className="flex items-start gap-3 mb-5">
                        <span className="text-white/60 text-xs font-medium whitespace-nowrap mt-0.5">Lokasi Anda</span>
                        <div className="flex items-start gap-2">
                            <Navigation size={14} className="text-[#c2985b] mt-0.5 flex-shrink-0" />
                            <span className="text-sm font-bold text-white leading-tight">BELM - Pengiriman Ekspedisi, Pulogadung Jakarta, Jakarta</span>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex-1 border border-white text-white font-bold py-3 px-4 rounded-full text-[11px] uppercase tracking-wider hover:bg-white hover:text-[#1e3a8a] transition-all text-center">
                            UBAH LOKASI
                        </button>
                        <button className="flex-1 border border-white text-white font-bold py-3 px-4 rounded-full text-[11px] uppercase tracking-wider hover:bg-white hover:text-[#1e3a8a] transition-all text-center">
                            ALAMAT
                        </button>
                    </div>
                </div>
            </div>      {/* =========== DESKTOP LAYOUT =========== */}
            <div className="hidden lg:block relative w-full bg-white z-0">
                {/* HERO SLIDER */}
                <div className="w-full relative aspect-[2.5/1] overflow-hidden bg-gray-100 group">
                    {SLIDES.map((slide, index) => (
                        <div
                            key={slide.id}
                            className={clsx(
                                "absolute inset-0 transition-opacity duration-700 ease-in-out",
                                index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                            )}
                        >
                            <Image
                                src={slide.desktop}
                                alt={slide.alt}
                                fill
                                className="object-cover object-center"
                                priority={index === 0}
                            />
                        </div>
                    ))}

                    {/* Arrows */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/30 text-white rounded-full flex items-center justify-center hover:bg-[#b48d5e] transition-colors z-20 backdrop-blur-sm"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/30 text-white rounded-full flex items-center justify-center hover:bg-[#b48d5e] transition-colors z-20 backdrop-blur-sm"
                    >
                        <ChevronRight size={24} />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-28 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
                        {SLIDES.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentSlide(idx)}
                                className={clsx(
                                    "w-2 h-2 rounded-full transition-all",
                                    idx === currentSlide ? "bg-[#b48d5e] w-6" : "bg-white/50 hover:bg-white"
                                )}
                            />
                        ))}
                    </div>
                </div>

                {/* PRICE INFO BAR - Desktop */}
                <div className="relative w-full -mt-20 z-30">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-4 shadow-2xl rounded-lg overflow-hidden h-[180px]">

                            {/* COL 1: ACTIONS */}
                            <div className="bg-[#1e3a8a] py-5 px-6 flex flex-col justify-center gap-3 h-full relative z-20">
                                <button className="w-full bg-gradient-to-r from-[#ce9f61] to-[#b48d5e] text-white font-bold py-2.5 px-4 rounded-sm text-xs uppercase tracking-wider shadow-lg flex justify-between items-center hover:brightness-110 transition-all border border-[#b48d5e]/50">
                                    <span>Beli Emas</span>
                                    <ChevronRight size={16} />
                                </button>
                                <button className="w-full bg-gradient-to-r from-[#ce9f61] to-[#b48d5e] text-white font-bold py-2.5 px-4 rounded-sm text-xs uppercase tracking-wider shadow-lg flex justify-between items-center hover:brightness-110 transition-all border border-[#b48d5e]/50">
                                    <span>Simulasi Buyback</span>
                                    <ChevronRight size={16} />
                                </button>
                                <div className="mt-1 flex items-center text-[10px] text-white/70 font-medium">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                                    Update: 24 Jan 2026 17:00
                                </div>
                            </div>

                            {/* COL 2: EMAS PRICE */}
                            <div className="relative flex flex-col justify-center px-6 py-4 border-r border-white/20 h-full overflow-hidden">
                                <div className="absolute inset-0 z-0">
                                    <Image src="/images/emas.jpg" alt="Gold Texture" fill className="object-cover" />
                                </div>
                                <div className="absolute inset-0 z-0 bg-[#C69C3A] opacity-95"></div>

                                <div className="relative z-10 flex flex-col items-start h-full justify-center text-white pl-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="bg-[#b48d5e] w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border border-white/50 shadow-sm">LM</div>
                                        <h3 className="text-lg font-bold tracking-wide drop-shadow-sm">Emas</h3>
                                    </div>
                                    <p className="text-[11px] font-medium text-white/90 mb-0.5">Harga/gram</p>
                                    <div className="flex flex-col mb-2">
                                        <span className="text-3xl font-bold tracking-wide text-white drop-shadow-md leading-none mb-1.5">Rp2.887.000,00</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold text-green-100 bg-white/20 px-1.5 py-0.5 rounded border border-white/20">▲ Rp7.000</span>
                                            <span className="text-[10px] text-white/90 font-medium">Last: Rp2.880.000</span>
                                        </div>
                                    </div>
                                    <button className="text-[10px] font-bold uppercase tracking-widest text-white hover:text-white/80 transition-colors flex items-center border-b border-white/30 pb-0.5">
                                        Lihat Detail <ChevronRight size={10} className="ml-1" />
                                    </button>
                                </div>
                            </div>

                            {/* COL 3: PERAK PRICE */}
                            <div className="relative flex flex-col justify-center px-6 py-4 h-full overflow-hidden">
                                <div className="absolute inset-0 z-0">
                                    <Image src="/images/perak.jpg" alt="Silver Texture" fill className="object-cover" />
                                </div>
                                <div className="absolute inset-0 z-0 bg-gray-500 opacity-95"></div>

                                <div className="relative z-10 flex flex-col items-start h-full justify-center text-white pl-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="bg-gray-400 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border border-white/50 shadow-sm">AG</div>
                                        <h3 className="text-lg font-bold tracking-wide drop-shadow-sm">Perak</h3>
                                    </div>
                                    <p className="text-[11px] font-medium text-white/90 mb-0.5">Harga/gram</p>
                                    <div className="flex flex-col mb-2">
                                        <span className="text-3xl font-bold tracking-wide text-white drop-shadow-md leading-none mb-1.5">Rp64.250,00</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold text-green-100 bg-white/20 px-1.5 py-0.5 rounded border border-white/20">▲ Rp3.650</span>
                                            <span className="text-[10px] text-white/90 font-medium">Last: Rp60.600</span>
                                        </div>
                                    </div>
                                    <button className="text-[10px] font-bold uppercase tracking-widest text-white hover:text-white/80 transition-colors flex items-center border-b border-white/30 pb-0.5">
                                        Lihat Detail <ChevronRight size={10} className="ml-1" />
                                    </button>
                                </div>
                            </div>

                            {/* COL 4: LOCATION */}
                            <div className="bg-[#1e3a8a] py-5 px-6 flex flex-col justify-center items-end text-right text-white border-l border-white/10 h-full relative z-20">
                                <div className="flex items-center justify-end gap-1.5 mb-2 opacity-90 text-[10px] font-bold uppercase tracking-widest text-[#b48d5e]">
                                    Lokasi Anda <MapPin size={12} className="text-[#b48d5e]" />
                                </div>
                                <h4 className="text-xs font-bold leading-relaxed mb-4 max-w-[180px]">
                                    BELM - Pengiriman Ekspedisi<br />Pulogadung Jakarta, Jakarta
                                </h4>
                                <div className="flex justify-end gap-2 w-full">
                                    <button className="border border-white/30 px-3 py-1.5 rounded-sm text-[9px] font-bold uppercase hover:bg-white hover:text-[#1e3a8a] transition-all tracking-widest">
                                        Ubah Lokasi
                                    </button>
                                    <button className="border border-white/30 px-3 py-1.5 rounded-sm text-[9px] font-bold uppercase hover:bg-white hover:text-[#1e3a8a] transition-all tracking-widest">
                                        Alamat
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
