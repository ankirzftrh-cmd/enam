"use client";

import { Youtube, Instagram, Facebook, Twitter, Phone } from "lucide-react";
import Image from "next/image";

export default function SocialsSection() {
    return (
        <section className="bg-white py-16">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-2xl font-serif text-[#b48d5e] font-bold mb-2">Logam Mulia Youtube</h2>
                <a href="#" className="text-sm text-[#b48d5e] underline mb-12 block hover:text-[#96754a]">Kunjungi ANTAM Logam Mulia Youtube Channel</a>

                {/* Social Media Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                    {/* Instagram */}
                    <div className="bg-white p-8 border border-gray-100 rounded-lg shadow-sm hover:shadow-lg transition-shadow flex flex-col items-center">
                        <div className="flex justify-center mb-4">
                            {/* Using Lucide icons, but standard brand icons might be better if available. For now using colored lucide. */}
                            <Instagram className="text-pink-600 w-10 h-10" />
                        </div>
                        <h4 className="font-bold text-[#b48d5e] text-sm mb-2">@antamlogammulia</h4>
                        <p className="text-[10px] text-gray-500 leading-tight px-4">Ikuti akun Instagram resmi kami untuk mendapatkan berita terbaru setiap harinya.</p>
                    </div>

                    {/* Facebook */}
                    <div className="bg-white p-8 border border-gray-100 rounded-lg shadow-sm hover:shadow-lg transition-shadow flex flex-col items-center">
                        <div className="flex justify-center mb-4"><Facebook className="text-blue-600 w-10 h-10" /></div>
                        <h4 className="font-bold text-[#b48d5e] text-sm mb-2">@LM.ANTAM</h4>
                        <p className="text-[10px] text-gray-500 leading-tight px-4">Ikuti akun Facebook resmi kami untuk mendapatkan berita terbaru setiap harinya.</p>
                    </div>

                    {/* Twitter */}
                    <div className="bg-white p-8 border border-gray-100 rounded-lg shadow-sm hover:shadow-lg transition-shadow flex flex-col items-center">
                        <div className="flex justify-center mb-4"><Twitter className="text-blue-400 w-10 h-10" /></div>
                        <h4 className="font-bold text-[#b48d5e] text-sm mb-2">@logammuliaantam</h4>
                        <p className="text-[10px] text-gray-500 leading-tight px-4">Ikuti akun Twitter resmi kami untuk mendapatkan berita terbaru setiap harinya.</p>
                    </div>

                    {/* TikTok */}
                    <div className="bg-white p-8 border border-gray-100 rounded-lg shadow-sm hover:shadow-lg transition-shadow flex flex-col items-center">
                        <div className="flex justify-center mb-4">
                            {/* Lucide doesn't have TikTok, using a placeholder circle or generic Video icon */}
                            <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-xs">Tik</div>
                        </div>
                        <h4 className="font-bold text-[#b48d5e] text-sm mb-2">@antamlogammulia</h4>
                        <p className="text-[10px] text-gray-500 leading-tight px-4">Ikuti akun TikTok resmi kami untuk mendapatkan berita terbaru setiap harinya.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
