import { prisma } from "@/lib/prisma";
import HeroSlider from "@/components/HeroSlider";
import LocationAndApps from "@/components/LocationAndApps";
import ServicesSection from "@/components/ServicesSection";
import NewsSection from "@/components/NewsSection";
import SocialsSection from "@/components/SocialsSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HomeProductTabs from "@/components/HomeProductTabs";

// Revalidate every 60 seconds
export const revalidate = 60;

function formatRupiah(amount: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

export default async function HomePage() {
    // 1. Fetch Categories (Top 8 for Grid)
    const categories = await prisma.category.findMany({
        where: {
            name: {
                in: [
                    "Emas Imlek", "Emas Idul Fitri", "Perak Indonesian Heritage",
                    "Emas Batangan Batik", "Liontin Batik", "Produk Industri",
                    "Gift Series", "Perak Murni 99.95%", "Produk Klasik", "Bezel Seri 2",
                    "Emas Batangan"
                ]
            }
        },
        orderBy: { name: 'asc' }
    });

    // 2a. Fetch "Best Seller" Products (with isBestSeller = true)
    // We want to pass THESE to the tabs if they exist.
    const bestSellerProducts = await prisma.product.findMany({
        where: {
            isBestSeller: true,
            stockStatus: { not: "EMPTY" }
        },
        orderBy: { createdAt: 'desc' },
        take: 30, // Limit reasonable amount for client side filtering
        include: { category: true }
    });

    // 2b. Fallback: Fetch "Newest" if no best sellers defined yet
    const bestProducts = await prisma.product.findMany({
        where: { stockStatus: { not: "EMPTY" } },
        orderBy: { createdAt: 'desc' },
        take: 30,
        include: { category: true }
    });

    // 3. Fetch "Emas Batangan" Products
    const goldBarProducts = await prisma.product.findMany({
        where: {
            category: {
                OR: [
                    { name: { contains: "Emas Batangan" } },
                    { name: { contains: "Gold Bar" } }
                ]
            },
            stockStatus: { not: "EMPTY" }
        },
        take: 4,
        orderBy: { price: 'asc' }
    });

    return (
        <div className="pb-0 bg-white">
            {/* 1. HERO SLIDER */}
            <HeroSlider />


            {/* 2. REFACTORED: TABBED BEST SELLER SECTION */}
            {/* Replaces the old "Category Grid" and "Produk Terbaik" list */}
            <HomeProductTabs
                categories={categories}
                initialProducts={bestSellerProducts.length > 0 ? bestSellerProducts : bestProducts}
            />

            {/* 4. SECTION: EMAS BATANGAN REMOVED */}

            {/* 5. LOCATIONS & APPS */}
            <LocationAndApps />

            {/* 6. SERVICES */}
            <ServicesSection />

            {/* 7. NEWS */}
            <NewsSection />

            {/* 8. SOCIALS */}
            <SocialsSection />

            {/* 9. WHY CHOOSE US */}
            <WhyChooseUs />
        </div>
    );
}
