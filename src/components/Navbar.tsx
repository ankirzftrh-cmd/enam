"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Menu, X, Search, MapPin, ChevronDown, ChevronRight } from "lucide-react";
import Image from "next/image";
import { clsx } from "clsx";

const NAV_ITEMS = [
    { label: "Emas Batangan", href: "/products/emas-batangan" },
    {
        label: "Produk Tematik",
        href: "/products/produk-tematik",
        menuType: "grid",
        megaMenu: [
            { title: "Emas Imlek", slug: "emas-imlek", image: "/images/emasimlek.jpg" },
            { title: "Emas Idul Fitri", slug: "emas-idul-fitri", image: "/images/emasidulfitri.jpg" },
            { title: "Emas Batangan Batik", slug: "emas-batangan-batik", image: "/images/emasbatanganbatik.jpg" },
        ]
    },
    { label: "Gift Series", href: "/products/gift-series" },
    {
        label: "Produk Lain",
        href: "/products/produk-lain",
        menuType: "grid",
        megaMenu: [
            { title: "Emas Imlek", slug: "emas-imlek", image: "/images/emasimlek.jpg" },
            { title: "Emas Idul Fitri", slug: "emas-idul-fitri", image: "/images/emasidulfitri.jpg" },
            { title: "Perak Indonesian Heritage", slug: "perak-indonesian-heritage", image: "/images/perakindonesianheritage.jpg" },
            { title: "Emas Batangan Batik", slug: "emas-batangan-batik", image: "/images/emasbatanganbatik.jpg" },
            { title: "Liontin Batik", slug: "liontin-batik", image: "/images/liontinbatik.jpg" },
            { title: "Produk Industri", slug: "produk-industri", image: "/images/produkindustri.jpg" },
            { title: "Perak Murni 99.95%", slug: "perak-murni", image: "/images/perakmurni.jpg" },
            { title: "Produk Klasik", slug: "produk-klasik", image: "/images/produkklasik.jpg" },
        ]
    },
    {
        label: "Harga Emas",
        href: "/harga-emas",
        menuType: "list",
        megaMenu: [
            { title: "Harga Emas Hari Ini", slug: "harga-emas" },
            { title: "Grafik Harga Emas", slug: "harga-emas" },
        ]
    }
];

import { useSession } from "@/components/SessionProvider";
import { logoutAction } from "@/actions/auth";
import { useCart } from "@/context/CartContext";

// ... (Existing Imports)

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user } = useSession();
    const { items: cartItems } = useCart();

    return (
        <div className="fixed top-0 left-0 right-0 z-50 flex flex-col font-sans">
            {/* TOP BAR */}
            <div className="bg-gray-100 border-b border-gray-200 hidden md:block">
                <div className="container mx-auto px-6 py-1.5 flex justify-end items-center space-x-6 text-[10px] text-gray-500 uppercase tracking-widest font-medium">
                    <Link href="/lokasi-butik" className="hover:text-[#b48d5e] flex items-center transition-colors">
                        <MapPin size={12} className="mr-1" /> Lokasi Butik
                    </Link>
                    <Link href="#" className="hover:text-[#b48d5e] transition-colors">Verifikasi Produk</Link>
                    <Link href="#" className="hover:text-[#b48d5e] transition-colors">Lacak Pesanan</Link>

                    {user ? (
                        // LOGGED IN STATE
                        <div className="flex items-center gap-4">
                            <div className="flex items-center space-x-1 cursor-pointer text-[#1e3a8a] font-bold">
                                <span>HI, {user.name.toUpperCase()}</span>
                            </div>
                            <button
                                onClick={() => logoutAction()}
                                className="text-red-500 hover:text-red-700 font-bold"
                            >
                                KELUAR
                            </button>
                        </div>
                    ) : (
                        // GUEST STATE
                        <>
                            <div className="flex items-center space-x-1 cursor-pointer hover:text-[#b48d5e] transition-colors">
                                <span className="font-bold">ID</span> <ChevronDown size={10} />
                            </div>
                            <Link href="/login" className="font-bold text-[#b48d5e] hover:underline">MASUK / DAFTAR</Link>
                        </>
                    )}
                </div>
            </div>

            {/* MAIN NAVBAR */}
            <nav className="bg-white shadow-sm py-4 relative">
                <div className="container mx-auto px-6 flex justify-between items-center">
                    {/* Left: LOGO */}
                    <Link href="/" className="flex items-center group">
                        <Image
                            src="/images/logoweb.jpg"
                            alt="Logam Mulia"
                            width={220}
                            height={80}
                            className="h-10 md:h-14 w-auto object-contain"
                            priority
                        />
                    </Link>

                    {/* Desktop Navigation with RESTORED GRID CARDS & NEW POSITIONING */}
                    <div className="hidden lg:flex space-x-8 items-center h-full">
                        {NAV_ITEMS.map((item) => (
                            <div key={item.label} className="group relative h-full flex items-center">
                                {/* PARENT MENU ITEMS */}
                                <Link
                                    href={item.href}
                                    className="font-bold text-gray-600 hover:text-[#b48d5e] transition-colors text-[12px] uppercase tracking-wider flex items-center py-4"
                                >
                                    {item.label}
                                    {item.megaMenu && <ChevronDown size={14} className="ml-1 opacity-40 group-hover:opacity-100 bg-gray-100 rounded-full p-0.5" />}
                                </Link>

                                {/* DROPDOWN MENU (Centered Positioning) */}
                                {item.megaMenu && (
                                    <div className={clsx(
                                        "absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white shadow-xl rounded-lg border-t-2 border-[#b48d5e] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden transform",
                                        // Dynamic Width Constraint
                                        item.menuType === 'grid' && item.megaMenu.length > 4 ? "w-[700px]" : "w-max min-w-[300px]"
                                    )}>

                                        {/* GRID CARD CONTENT (Restored) */}
                                        {item.menuType === 'grid' ? (
                                            <div className={clsx(
                                                "grid gap-4 p-6",
                                                item.megaMenu.length > 4 ? "grid-cols-4" : "grid-cols-3"
                                            )}>
                                                {item.megaMenu.map((subItem) => (
                                                    <Link
                                                        key={subItem.title}
                                                        href={`/products/${subItem.slug}`}
                                                        className="block group/card text-center w-[160px]"
                                                    >
                                                        {/* Image Container (Blue/Yellow Cards) */}
                                                        <div className="relative aspect-square rounded-md overflow-hidden shadow-sm mb-3 border border-gray-100 group-hover/card:shadow-md transition-all bg-white">
                                                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                                            {(subItem as any).image ? (
                                                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                                <Image
                                                                    src={(subItem as any).image}
                                                                    alt={subItem.title}
                                                                    fill
                                                                    className="object-cover transition-transform duration-500 group-hover/card:scale-110"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full bg-[#1e3a8a] flex items-center justify-center text-white font-bold">
                                                                    LM
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Text Content */}
                                                        <div className="flex flex-col items-center">
                                                            <span className="font-bold text-xs text-[#1e3a8a] mb-1 group-hover/card:text-[#b48d5e] transition-colors text-center leading-tight">
                                                                {subItem.title}
                                                            </span>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        ) : (
                                            // LIST CONTENT (For 'Harga Emas' etc)
                                            <div className="flex flex-col min-w-[200px] p-4">
                                                {item.megaMenu.map((subItem) => (
                                                    <Link
                                                        key={subItem.title}
                                                        href={`/${subItem.slug}`}
                                                        className="block px-4 py-2 text-sm font-bold text-[#1e3a8a] hover:bg-gray-50 hover:text-[#b48d5e] rounded-sm transition-colors text-center"
                                                    >
                                                        {subItem.title}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Right: ICONS & BRAND */}
                    <div className="flex items-center space-x-6">
                        <button className="text-gray-500 hover:text-[#b48d5e] transition-colors">
                            <Search size={22} strokeWidth={1.5} />
                        </button>
                        <Link href="/cart" className="text-gray-500 hover:text-[#b48d5e] transition-colors relative">
                            <ShoppingCart size={22} strokeWidth={1.5} />
                            {cartItems && cartItems.length > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[9px] font-bold px-1 min-w-[16px] h-[16px] flex items-center justify-center rounded-full shadow-sm">
                                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                                </span>
                            )}
                        </Link>

                        {/* Antam Logo */}
                        <div className="hidden md:flex items-center pl-5 border-l border-gray-200">
                            <Image
                                src="/images/logo1.webp"
                                alt="Antam Logo"
                                width={120}
                                height={45}
                                className="h-10 w-auto object-contain hover:opacity-80 transition-opacity cursor-pointer"
                            />
                        </div>

                        {/* Mobile Toggle */}
                        <button
                            className="lg:hidden text-gray-600"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden bg-white absolute top-full left-0 w-full shadow-lg border-t border-gray-100 py-4 px-6 flex flex-col space-y-4 max-h-[80vh] overflow-y-auto">
                        {NAV_ITEMS.map((item) => (
                            <div key={item.label}>
                                <Link
                                    href={item.href}
                                    className="text-gray-700 font-bold text-sm uppercase hover:text-[#b48d5e] block py-2 border-b border-gray-50"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.label}
                                </Link>
                                {item.megaMenu && (
                                    <div className="pl-4 mt-2 grid grid-cols-2 gap-2">
                                        {item.megaMenu.map(subItem => (
                                            <Link
                                                key={subItem.title}
                                                href={`/products/${subItem.slug}`}
                                                className="text-gray-500 text-xs block py-1 hover:text-[#b48d5e]"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                {subItem.title}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        <div className="pt-4 border-t border-gray-100">
                            <Link href="/login" className="text-[#1e3a8a] font-bold text-sm uppercase block py-2">Masuk / Daftar</Link>
                        </div>
                    </div>
                )}
            </nav>
        </div>
    );
}
