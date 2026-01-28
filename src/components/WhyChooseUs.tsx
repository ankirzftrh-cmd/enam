import { ShieldCheck, Award, Lock, Truck } from "lucide-react";

const BENEFITS = [
    {
        icon: <Award className="text-[#b48d5e]" size={48} />, // Gold color
        title: "Akreditasi LBMA",
        description: "Sertifikat Responsible Gold dari LBMA memastikan Logam Mulia mendapatkan bahan dari sumber yang terbebas dari penambangan ilegal, pencucian uang, terorisme, pelanggaran hak asasi manusia dan perdagangan manusia."
    },
    {
        icon: <ShieldCheck className="text-[#b48d5e]" size={48} />,
        title: "Emas 99.99%",
        description: "Emas batangan ANTAM LM memberikan jaminan kadar produk dan kemurnian 99.99%."
    },
    {
        icon: <Lock className="text-[#b48d5e]" size={48} />,
        title: "Layanan BRANKAS",
        description: "Simpan emas di Brankas LM. Cara cerdas berinvestasi emas tanpa risiko hilang, dengan harga beli emas yang lebih murah."
    },
    {
        icon: <Truck className="text-[#b48d5e]" size={48} />,
        title: "Transaksi Aman",
        description: "Keamanan website dilengkapi dengan enkripsi SSL. Metode pembayaran menggunakan virtual account bank untuk mempermudah konsumen tanpa perlu konfirmasi."
    }
];

export default function WhyChooseUs() {
    return (
        <section className="bg-white py-20 border-t border-gray-100">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <h2 className="text-3xl font-serif font-bold text-[#b48d5e] mb-6">Kenapa Belanja di LogamMulia.com?</h2>
                    <p className="text-gray-500 text-sm leading-7">
                        Hanya di logammulia.com Anda mendapatkan emas batangan ANTAM LM yang asli dengan kemurnian 999.9. Produk kami memberikan keamanan dan ketenangan pikiran dalam berinvestasi. Nikmati kenyamanan berbelanja emas tanpa meninggalkan rumah. logammulia.com menawarkan layanan pengiriman yang cepat dan aman langsung ke alamat Anda, menjadikan investasi emas lebih praktis.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {BENEFITS.map((benefit, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-xl transition-all duration-300 flex flex-col items-center">
                            <div className="mb-6 flex justify-center">
                                <div className="p-4 bg-[#f8f5f2] rounded-full"> {/* Light gold bg for icon */}
                                    {benefit.icon}
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-[#b48d5e] mb-4 text-center">{benefit.title}</h3>
                            <p className="text-[11px] text-gray-500 text-center leading-relaxed">
                                {benefit.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
