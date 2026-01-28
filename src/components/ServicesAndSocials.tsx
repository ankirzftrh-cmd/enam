import Image from "next/image";
import { Youtube, Instagram, Facebook, Twitter, Phone } from "lucide-react";

export default function ServicesAndSocials() {
    return (
        <div className="bg-gray-50">
            {/* Services Section */}
            <section className="container mx-auto px-6 py-20">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    {/* Left: Text Content */}
                    <div className="w-full md:w-5/12 order-2 md:order-1">
                        <h3 className="text-[#b48d5e] font-serif font-bold text-3xl mb-6">Layanan</h3>
                        <p className="text-gray-500 text-sm mb-8 leading-loose text-justify">
                            Dengan kompetensi kami di bidang pemurnian, <i>custom minting & casting</i>, jasa analisis yang berstandar internasional dengan teknologi terkini dan ramah lingkungan, serta didukung dengan sumber daya yang profesional, kami siap membantu memenuhi kebutuhan Anda.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button className="bg-[#b48d5e] text-white font-bold py-3 px-8 rounded-sm text-xs uppercase tracking-wider hover:bg-[#a37d50] transition-colors shadow-lg">
                                LEBIH LENGKAP
                            </button>
                            <button className="text-[#1e3a8a] font-bold py-3 px-8 rounded-sm text-xs uppercase tracking-wider border border-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white transition-colors">
                                MINTA PENAWARAN
                            </button>
                        </div>
                    </div>

                    {/* Right: Images Composition */}
                    <div className="w-full md:w-7/12 order-1 md:order-2 relative">
                        {/* Main Image */}
                        <div className="w-full h-[300px] md:h-[400px] relative rounded-lg overflow-hidden shadow-2xl">
                            <Image
                                src="/images/img-layanan-1.jpg"
                                alt="Layanan Logam Mulia"
                                fill
                                className="object-cover"
                            />
                        </div>
                        {/* Floating Small Image (Composition effect) */}
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 border-4 border-white rounded-lg overflow-hidden shadow-xl hidden md:block">
                            <Image
                                src="/images/img-layanan-3.jpg"
                                alt="Detail Layanan"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Socials & Youtube Section */}
            <section className="bg-white py-16">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-2xl font-serif text-primary font-bold mb-2">Logam Mulia Youtube</h2>
                    <a href="#" className="text-sm text-primary underline mb-12 block">Kunjungi ANTAM Logam Mulia Youtube Channel</a>

                    {/* Social Media Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                        <div className="bg-white p-6 border border-gray-100 rounded-lg shadow-sm">
                            <div className="flex justify-center mb-4"><Instagram className="text-pink-600" size={32} /></div>
                            <h4 className="font-bold text-secondary text-sm">@antamlogammulia</h4>
                            <p className="text-xs text-gray-500 mt-2">Ikuti akun Instagram resmi kami untuk mendapatkan berita terbaru.</p>
                        </div>
                        <div className="bg-white p-6 border border-gray-100 rounded-lg shadow-sm">
                            <div className="flex justify-center mb-4"><Facebook className="text-blue-600" size={32} /></div>
                            <h4 className="font-bold text-secondary text-sm">@LM.ANTAM</h4>
                            <p className="text-xs text-gray-500 mt-2">Ikuti akun Facebook resmi kami untuk mendapatkan berita terbaru.</p>
                        </div>
                        <div className="bg-white p-6 border border-gray-100 rounded-lg shadow-sm">
                            <div className="flex justify-center mb-4"><Twitter className="text-blue-400" size={32} /></div>
                            <h4 className="font-bold text-secondary text-sm">@logammuliaantam</h4>
                            <p className="text-xs text-gray-500 mt-2">Ikuti akun Twitter resmi kami untuk mendapatkan berita terbaru.</p>
                        </div>
                        <div className="bg-white p-6 border border-gray-100 rounded-lg shadow-sm">
                            <div className="flex justify-center mb-4"><Phone className="text-black" size={32} /></div>
                            <h4 className="font-bold text-secondary text-sm">@antamlogammulia</h4>
                            <p className="text-xs text-gray-500 mt-2">Ikuti akun TikTok resmi kami untuk mendapatkan berita terbaru.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="bg-white pb-16 pt-8 border-t border-gray-100">
                <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between max-w-4xl">
                    <div className="mb-6 md:mb-0">
                        <h3 className="text-secondary font-bold text-lg">Berlangganan buletin logammulia.com</h3>
                        <p className="text-gray-500 text-xs">Semua informasi terkini, kegiatan, promo dan penawaran menarik lainnya.</p>
                    </div>
                    <div className="flex w-full md:w-auto">
                        <input type="email" placeholder="Masukan email Anda" className="border border-gray-300 px-4 py-2 text-sm rounded-l-md w-full md:w-64 focus:outline-none focus:border-primary" />
                        <button className="bg-primary text-white font-bold px-6 py-2 text-sm rounded-r-md hover:bg-primary-dark transition-colors">
                            Berlangganan
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
