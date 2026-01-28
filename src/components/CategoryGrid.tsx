import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const CATEGORIES = [
    { name: "Emas Imlek", image: "/images/emasimlek.jpg", slug: "emas-imlek" },
    { name: "Emas Idul Fitri", image: "/images/emasidulfitri.jpg", slug: "emas-idul-fitri" },
    { name: "Perak Indonesian Heritage", image: "/images/perakindonesianheritage.jpg", slug: "perak-indonesian-heritage" },
    { name: "Emas Batangan Batik", image: "/images/emasbatanganbatik.jpg", slug: "emas-batangan-batik" },
    { name: "Liontin Batik", image: "/images/liontinbatik.jpg", slug: "liontin-batik" },
    { name: "Produk Industri", image: "/images/produkindustri.jpg", slug: "produk-industri" },
    { name: "Perak Murni 99.95%", image: "/images/perakmurni.jpg", slug: "perak-murni" },
    { name: "Produk Klasik", image: "/images/produkklasik.jpg", slug: "produk-klasik" },
];

export default function CategoryGrid() {
    return (
        <section className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {CATEGORIES.map((cat) => (
                    <Link
                        key={cat.name}
                        href={`/produk/${cat.slug}`}
                        className="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                    >
                        <div className="relative aspect-square overflow-hidden bg-gray-100">
                            <Image
                                src={cat.image}
                                alt={cat.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            {/* Corner Overlay (Blue Triangle effect simulation if needed, but image likely has it) */}
                        </div>
                        <div className="p-4 text-center">
                            <h3 className="text-[#1e3a8a] font-bold text-sm md:text-base mb-2 font-serif group-hover:text-[#b48d5e] transition-colors">{cat.name}</h3>
                            <div className="text-[#b48d5e] text-[10px] font-bold uppercase tracking-widest flex items-center justify-center">
                                Selengkapnya <ChevronRight size={12} className="ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
