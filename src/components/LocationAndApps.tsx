import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Download } from "lucide-react";

export default function LocationAndApps() {
    return (
        <section className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">

                {/* 1. LOKASI BUTIK */}
                <div className="relative group overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                    <div className="flex flex-col md:flex-row h-full">
                        {/* Text Side */}
                        <div className="w-full md:w-5/12 p-8 flex flex-col justify-center relative z-10 bg-white">
                            <div className="mb-6">
                                <span className="bg-[#FFCC00] text-[#1e3a8a] text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest inline-block mb-4 shadow-sm">
                                    LOKASI
                                </span>
                                <h3 className="text-2xl md:text-3xl font-bold text-[#1e3a8a] font-serif leading-tight">
                                    Butik Emas Logam Mulia
                                </h3>
                            </div>
                            <div className="w-20 h-1.5 bg-[#b48d5e] rounded-full mb-8"></div>
                            <Link href="/lokasi" className="text-[#1e3a8a] font-bold text-xs uppercase tracking-widest flex items-center group-hover:translate-x-2 transition-transform">
                                Temukan Lokasi <ChevronRight size={14} className="ml-2" />
                            </Link>
                        </div>

                        {/* Image Side */}
                        <div className="w-full md:w-7/12 h-[250px] md:h-auto relative">
                            {/* Gradient Mask to blend with white text area */}
                            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10"></div>
                            <Image
                                src="/images/butik-emas.jpeg"
                                alt="Butik Emas Logam Mulia"
                                fill
                                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                    </div>
                </div>

                {/* 2. BRANKAS / APP */}
                <div className="relative group overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                    <div className="flex flex-col md:flex-row h-full">
                        {/* Text Side */}
                        <div className="w-full md:w-6/12 p-8 flex flex-col justify-center relative z-10 bg-white">
                            <div className="mb-6">
                                <h4 className="text-[#b48d5e] font-bold text-[10px] uppercase tracking-widest mb-1">Aplikasi Emas Fisik Digital ANTAM</h4>
                                <h3 className="text-4xl md:text-5xl font-extrabold text-[#1e3a8a] font-sans tracking-tight leading-none mb-1">
                                    BRANKAS
                                </h3>
                                <p className="text-[#1e3a8a] text-[9px] font-bold tracking-[0.3em] uppercase opacity-80">BERENCANA AMAN KELOLA EMAS</p>
                            </div>

                            <div className="flex gap-3 mt-4">
                                <button className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-3 hover:bg-gray-800 transition shadow-md w-fit">
                                    <Download size={18} />
                                    <div className="text-left leading-none">
                                        <div className="text-[7px] uppercase font-medium mb-0.5">Download on</div>
                                        <div className="text-[10px] font-bold">App Store</div>
                                    </div>
                                </button>
                                <button className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-3 hover:bg-gray-800 transition shadow-md w-fit">
                                    <Download size={18} />
                                    <div className="text-left leading-none">
                                        <div className="text-[7px] uppercase font-medium mb-0.5">GET IT ON</div>
                                        <div className="text-[10px] font-bold">Google Play</div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Image Side */}
                        <div className="w-full md:w-6/12 h-[250px] md:h-auto relative">
                            {/* Gradient Mask */}
                            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10"></div>
                            <Image
                                src="/images/brankas-lm.jpeg"
                                alt="Aplikasi BRANKAS"
                                fill
                                className="object-cover object-left-top transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
