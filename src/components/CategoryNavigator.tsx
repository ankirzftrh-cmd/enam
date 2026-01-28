"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

// Data based on the user's screenshot
const CATEGORIES = [
    { title: "Emas Imlek", slug: "emas-imlek", image: "/cat-imlek.png" }, // Using placeholders
    { title: "Emas Idul Fitri", slug: "emas-idul-fitri", image: "/cat-idul-fitri.png" },
    { title: "Perak Indonesian Heritage", slug: "perak", image: "/cat-perak.png" },
    { title: "Emas Batangan Batik", slug: "emas-batangan", image: "/cat-batik.png" },
    { title: "Liontin Batik", slug: "liontin-batik", image: "/cat-liontin.png" },
    { title: "Produk Industri", slug: "produk-lain", image: "/cat-industry.png" },
    { title: "Perak Murni", slug: "perak", image: "/cat-silver-pure.png" },
    { title: "Produk Klasik", slug: "produk-lain", image: "/cat-classic.png" },
    { title: "Emas Bezel", slug: "produk-lain", image: "/cat-bezel.png" },
];

export default function CategoryNavigator() {
    return (
        <section className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {CATEGORIES.map((cat, idx) => (
                    <Link
                        key={idx}
                        href={`/${cat.slug}`}
                        className="group relative bg-secondary rounded-lg overflow-hidden h-48 flex flex-col justify-between p-6 transition-transform hover:-translate-y-1 hover:shadow-xl"
                    >
                        {/* Decorative Circle/Image Placement */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>

                        {/* Title */}
                        <h3 className="text-white font-bold text-lg uppercase tracking-wider relative z-10 leading-tight">
                            {cat.title}
                        </h3>

                        {/* Link Text */}
                        <div className="text-[#C69C6D] text-xs font-bold uppercase tracking-widest flex items-center relative z-10 mt-auto group-hover:text-white transition-colors">
                            Selengkapnya <ChevronRight size={14} className="ml-1" />
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
