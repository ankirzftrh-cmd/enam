"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Building2 } from "lucide-react";

export default function Footer() {
    return (
        <div className="flex flex-col">
            {/* 1. PRE-FOOTER / INFO SECTION (White Background) */}
            <div className="bg-white py-12 border-b border-gray-100">
                <div className="container mx-auto px-8 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                        {/* COL 1: Alamat Butik */}
                        <div className="flex flex-col items-start">
                            <div className="flex items-center gap-2 mb-4">
                                <MapPin className="text-[#d4af37]" size={20} />
                                <h3 className="text-[#d4af37] font-bold text-base uppercase tracking-wider">Alamat Butik Emas LM</h3>
                            </div>
                            <h4 className="text-[#002c5f] font-bold text-sm mb-2">BELM - Pengiriman Ekspedisi, Pulogadung Jakarta</h4>
                            <p className="text-gray-500 text-xs leading-relaxed mb-4">
                                Gedung Graha Dipta. Jalan Pemuda, No.1 Jatinegara Kaum, Pulo Gadung, Jakarta 13250
                            </p>
                            <div className="space-y-1.5 text-xs text-gray-500">
                                <div className="flex items-center"><Phone size={12} className="mr-2 text-[#d4af37]" /> 0804-1-888-888</div>
                                <div className="flex items-center"><Mail size={12} className="mr-2 text-[#d4af37]" /> info@logammulia.com</div>
                            </div>
                        </div>

                        {/* COL 2: Alamat Kantor */}
                        <div className="flex flex-col items-start">
                            <div className="flex items-center gap-2 mb-4">
                                <Building2 className="text-[#d4af37]" size={20} />
                                <h3 className="text-[#d4af37] font-bold text-base uppercase tracking-wider">Alamat Kantor</h3>
                            </div>
                            <h4 className="text-[#002c5f] font-bold text-sm mb-2">PT ANTAM Tbk<br />Unit Bisnis Pengolahan dan Pemurnian Logam Mulia</h4>
                            <p className="text-gray-500 text-xs leading-relaxed mb-4">
                                Gedung Graha Dipta. Jalan Pemuda, No.1 Jatinegara Kaum, Pulo Gadung, Jakarta 13250
                            </p>
                            <div className="space-y-1.5 text-xs text-gray-500">
                                <div className="flex items-center"><Phone size={12} className="mr-2 text-[#d4af37]" /> (021) 29980900</div>
                                <div className="flex items-center"><Mail size={12} className="mr-2 text-[#d4af37]" /> infolm@antam.com</div>
                            </div>
                        </div>

                        {/* COL 3: Berlangganan */}
                        <div className="flex flex-col items-start">
                            <h3 className="text-[#002c5f] font-bold text-base mb-2">Berlangganan buletin logammulia.com</h3>
                            <p className="text-gray-400 text-xs mb-4">Dapatkan informasi terkini seputar promo, harga emas, dan berita terbaru.</p>
                            <div className="w-full">
                                <input
                                    type="email"
                                    placeholder="Masukan email Anda"
                                    className="w-full border border-gray-300 px-4 py-3 text-xs rounded-sm focus:outline-none focus:border-[#b48d5e] text-black bg-white mb-3"
                                />
                                <button className="w-full bg-[#b48d5e] text-white font-bold px-6 py-3 text-xs rounded-sm hover:bg-[#a37d50] transition-colors uppercase tracking-wider shadow-sm">
                                    Berlangganan
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* 2. MAIN FOOTER (Deep Blue with Gold Top Border) */}
            <footer className="bg-[#002c5f] text-white border-t-4 border-[#d4af37]">
                <div className="container mx-auto px-8 py-10 max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-sm">

                        {/* COL 1: Produk dan Layanan (Span 4) */}
                        <div className="md:col-span-4">
                            <h4 className="text-[#d4af37] font-bold text-base mb-4 uppercase tracking-wider">Produk dan Layanan</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <ul className="space-y-2 text-sm text-white font-medium">
                                    <li><Link href="#" className="hover:text-[#d4af37] transition-colors">Pemurnian</Link></li>
                                    <li><Link href="#" className="hover:text-[#d4af37] transition-colors">Halaman Utama</Link></li>
                                    <li><Link href="#" className="hover:text-[#d4af37] transition-colors">Produk Custom</Link></li>
                                    <li><Link href="#" className="hover:text-[#d4af37] transition-colors">Beli Emas</Link></li>
                                    <li><Link href="#" className="hover:text-[#d4af37] transition-colors">Brankas</Link></li>
                                </ul>
                                <ul className="space-y-2 text-sm text-white font-medium">
                                    <li><Link href="#" className="hover:text-[#d4af37] transition-colors">Pengujian dan Analisis</Link></li>
                                    <li><Link href="#" className="hover:text-[#d4af37] transition-colors">Produk Lain</Link></li>
                                    <li><Link href="#" className="hover:text-[#d4af37] transition-colors">Layanan</Link></li>
                                    <li><Link href="#" className="hover:text-[#d4af37] transition-colors">Buyback Emas</Link></li>
                                </ul>
                            </div>
                        </div>

                        {/* COL 2: Informasi (Span 2) */}
                        <div className="md:col-span-2">
                            <h4 className="text-[#d4af37] font-bold text-base mb-4 uppercase tracking-wider">Informasi</h4>
                            <ul className="space-y-2 text-sm text-white font-medium">
                                <li><Link href="#" className="hover:text-[#d4af37] transition-colors">Akun Saya</Link></li>
                                <li><Link href="#" className="hover:text-[#d4af37] transition-colors">Lokasi Butik Emas LM</Link></li>
                                <li><Link href="#" className="hover:text-[#d4af37] transition-colors">Profil Logam Mulia</Link></li>
                                <li><Link href="#" className="hover:text-[#d4af37] transition-colors">Berita dan Promo</Link></li>
                                <li><Link href="#" className="hover:text-[#d4af37] transition-colors">Syarat dan Ketentuan</Link></li>
                                <li><Link href="#" className="hover:text-[#d4af37] transition-colors">Kebijakan Privasi</Link></li>
                            </ul>
                        </div>

                        {/* COL 3: Bantuan (Span 2) */}
                        <div className="md:col-span-2">
                            <h4 className="text-[#d4af37] font-bold text-base mb-4 uppercase tracking-wider">Bantuan</h4>
                            <ul className="space-y-2 text-sm text-white font-medium">
                                <li><Link href="#" className="hover:text-[#d4af37] transition-colors">Hubungi Kami</Link></li>
                                <li><Link href="#" className="hover:text-[#d4af37] transition-colors">FAQ</Link></li>
                            </ul>
                        </div>

                        {/* COL 4: Right Section (Span 4) - Akreditasi, Keamanan, Logos */}
                        <div className="md:col-span-4 flex flex-col items-start md:items-end text-right">

                            {/* Akreditasi */}
                            <div className="mb-6 w-full flex flex-col items-end">
                                <h4 className="text-[#d4af37] font-bold text-base mb-3 uppercase tracking-wider text-right">Akreditasi</h4>
                                <div className="flex gap-3 items-center justify-end">
                                    <Image src="/images/logolbma.webp" alt="LBMA" width={70} height={35} className="h-8 w-auto object-contain brightness-0 invert opacity-90 hover:opacity-100" />
                                    <Image src="/images/logokan.webp" alt="KAN" width={70} height={35} className="h-8 w-auto object-contain brightness-0 invert opacity-90 hover:opacity-100" />
                                    <Image src="/images/logocert.webp" alt="Cert" width={70} height={35} className="h-8 w-auto object-contain brightness-0 invert opacity-90 hover:opacity-100" />
                                </div>
                            </div>

                            {/* Keamanan */}
                            <div className="mb-8 w-full flex flex-col items-end">
                                <h4 className="text-[#d4af37] font-bold text-base mb-3 uppercase tracking-wider text-right">Keamanan</h4>
                                <div className="flex justify-end">
                                    <Image src="/images/logossl.webp" alt="SSL" width={90} height={35} className="h-8 w-auto object-contain brightness-0 invert opacity-90 hover:opacity-100" />
                                </div>
                            </div>

                            {/* Brand Logos */}
                            <div className="mt-auto flex items-center justify-end gap-5 w-full border-t border-white/10 pt-6">
                                <Link href="/">
                                    <Image src="/images/logoweb.png" alt="Logam Mulia" width={160} height={60} className="h-14 w-auto object-contain brightness-0 invert" />
                                </Link>
                                <div className="h-12 w-[1px] bg-white/20"></div>
                                <Link href="/">
                                    <Image src="/images/logo1.png" alt="Antam" width={120} height={50} className="h-10 w-auto object-contain brightness-0 invert" />
                                </Link>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Copyright Strip */}
                <div className="bg-[#00224d] py-6 border-t border-[#003366]">
                    <div className="container mx-auto px-6 text-center">
                        <p className="text-[11px] text-white/50 tracking-wide font-sans">
                            &copy; 2026 Logam Mulia. All Rights Reserved. Kebijakan Privasi | Syarat & Ketentuan
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
