"use client";

import Image from "next/image";

export default function ServicesSection() {
    return (
        <section className="bg-aliceblue py-20 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-[#f8faff] z-0"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-16">

                    {/* Left: Text Content */}
                    <div className="w-full md:w-5/12">
                        <h3 className="text-[#b48d5e] font-serif text-3xl mb-6 relative inline-block font-bold">
                            Layanan
                        </h3>
                        <p className="text-gray-500 text-sm mb-8 leading-relaxed text-justify font-light">
                            Dengan kompetensi kami di bidang pemurnian, <i className="font-serif">custom minting & casting</i>, jasa analisis yang berstandar internasional dengan teknologi terkini dan ramah lingkungan, serta didukung dengan sumber daya yang profesional, kami siap membantu memenuhi kebutuhan Anda.
                        </p>
                        <div className="flex flex-wrap items-center gap-8">
                            <button className="bg-[#b48d5e] text-white font-bold py-3 px-8 rounded-sm text-xs uppercase tracking-wider hover:bg-[#a37d50] transition-colors shadow-lg">
                                LEBIH LENGKAP
                            </button>
                            <button className="text-[#1e3a8a] font-bold text-xs uppercase tracking-wider hover:underline transition-all">
                                MINTA PENAWARAN
                            </button>
                        </div>
                    </div>

                    {/* Right: Images Composition (Refined Grid) */}
                    <div className="w-full md:w-7/12 relative">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Top Left: Machine */}
                            <div className="h-[220px] relative rounded-lg overflow-hidden shadow-md group">
                                <Image
                                    src="/images/img-layanan-1.jpg"
                                    alt="Layanan Pemurnian"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                            {/* Top Right: Pouring Gold */}
                            <div className="h-[220px] relative rounded-lg overflow-hidden shadow-md group">
                                <Image
                                    src="/images/img-layanan-2.jpg"
                                    alt="Casting"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                            {/* Bottom: Coins (Spanning Full) */}
                            <div className="col-span-2 h-[200px] relative rounded-lg overflow-hidden shadow-md group">
                                <Image
                                    src="/images/img-layanan-3.jpg"
                                    alt="Custom Coins"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
