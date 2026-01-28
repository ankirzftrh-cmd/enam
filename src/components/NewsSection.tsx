"use client";

import Image from "next/image";
import { Link } from "lucide-react"; // Just using lucide for illustration if needed, but simple HTML is fine

const NEWS_ITEMS = [
    {
        id: 1,
        title: "Setahun Berlalu, Tabungan Emas Sobat Mulia Sampai Mana?",
        date: "30 Dec 2025",
        image: "/images/11.jpg",
        type: "NEWS"
    },
    {
        id: 2,
        title: "Tabungan Emas: Bantu Siapkan Budget Liburan Akhir Tahun",
        date: "26 Dec 2025",
        image: "/images/22.jpg",
        type: "NEWS"
    },
    {
        id: 3,
        title: "Harga Emas Naik Turun Sepanjang Tahun, Apa Artinya Buat Kita?",
        date: "24 Dec 2025",
        image: "/images/33.jpg",
        type: "NEWS"
    }
];

export default function NewsSection() {
    return (
        <section className="bg-white py-16">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                    <h2 className="text-[#b48d5e] font-serif text-2xl font-bold mb-2">Berita dan Promo</h2>
                    <p className="text-gray-500 text-xs">Semua informasi terkini, kegiatan, promo dan penawaran menarik lainnya dari ANTAM Logam Mulia.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {NEWS_ITEMS.map((item) => (
                        <div key={item.id} className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-100 flex flex-col items-start cursor-pointer">
                            <div className="relative w-full h-60 overflow-hidden">
                                <div className="absolute top-4 left-4 bg-[#b48d5e] text-white text-[9px] font-bold px-2 py-1 uppercase z-10">
                                    {item.type}
                                </div>
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                            </div>
                            <div className="p-5 flex flex-col bg-white">
                                <h3 className="text-[#b48d5e] font-bold text-sm mb-3 leading-relaxed group-hover:text-[#96754a] transition-colors">
                                    {item.title}
                                </h3>
                                <div className="mt-4 flex items-center text-[10px] text-gray-400 font-medium">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    {item.date}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <button className="bg-[#1e3a8a] text-white font-bold py-3 px-8 rounded-sm text-xs uppercase tracking-wider hover:bg-[#152e72] transition-colors shadow-md">
                        LIHAT SEMUA BERITA
                    </button>
                </div>
            </div>
        </section>
    );
}
