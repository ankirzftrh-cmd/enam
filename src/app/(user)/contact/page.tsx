import { MapPin, Clock, Building2 } from 'lucide-react';

export const metadata = {
    title: 'Hubungi Kami | Logam Mulia',
    description: 'Lokasi Butik Emas LM di seluruh Indonesia',
};

// Data Source (Phone/Email removed as per request)
const LOCATIONS = [
    {
        city: "Jakarta (Gedung Antam)",
        address: "Gedung Aneka Tambang, Jl. Letjen T.B. Simatupang No.1, RT.10/RW.4, Tanjung Barat, Jagakarsa, Jakarta Selatan 12530",
        hours: "Senin - Jumat: 08.00 - 15.00 WIB",
        mapUrl: "https://goo.gl/maps/example1"
    },
    {
        city: "Jakarta (Pulo Gadung)",
        address: "Jl. Pemuda, Jl. Kayu Putih Raya No.1, Pulo Gadung, Jakarta Timur 13210",
        hours: "Senin - Jumat: 08.30 - 15.30 WIB",
        mapUrl: "https://goo.gl/maps/example2"
    },
    {
        city: "Bandung",
        address: "Jl. Ir. H. Juanda No.153, Lb. Siliwangi, Coblong, Kota Bandung, Jawa Barat 40132",
        hours: "Senin - Jumat: 08.00 - 15.00 WIB",
        mapUrl: "https://goo.gl/maps/example4"
    },
    {
        city: "Surabaya (Darmo)",
        address: "Jl. Raya Darmo No.12, Dr. Soetomo, Tegalsari, Surabaya, Jawa Timur 60264",
        hours: "Senin - Sabtu: 09.00 - 16.00 WIB",
        mapUrl: "https://goo.gl/maps/example3"
    },
    {
        city: "Surabaya (Pakuwon)",
        address: "Pakuwon Mall, Lantai G, Jl. Puncak Indah Lontar No.2, Surabaya",
        hours: "Senin - Minggu: 10.00 - 21.00 WIB",
        mapUrl: "#"
    },
    {
        city: "Yogyakarta",
        address: "Jl. Laksda Adisucipto No.26, Demangan, Kec. Gondokusuman, Kota Yogyakarta",
        hours: "Senin - Jumat: 08.30 - 15.30 WIB",
        mapUrl: "#"
    },
    {
        city: "Semarang",
        address: "Jl. Pemuda No.80, Sekayu, Kec. Semarang Tengah, Kota Semarang",
        hours: "Senin - Jumat: 08.30 - 15.30 WIB",
        mapUrl: "#"
    },
    {
        city: "Medan",
        address: "Komp. Centre Point, Jl. Timor, Gang Buntu, Medan Timur, Medan City, North Sumatra 20231",
        hours: "Senin - Sabtu: 09.00 - 16.00 WIB",
        mapUrl: "https://goo.gl/maps/example5"
    },
    {
        city: "Makassar",
        address: "Jl. Sam Ratulangi No.68, Maricaya Baru, Kec. Makassar, Kota Makassar, Sulawesi Selatan 90141",
        hours: "Senin - Jumat: 08.30 - 15.30 WIB",
        mapUrl: "https://goo.gl/maps/example6"
    },
    {
        city: "Balikpapan",
        address: "Jl. Jenderal Sudirman No.18, Damai, Balikpapan Kota, Kota Balikpapan",
        hours: "Senin - Jumat: 08.30 - 15.30 WIB",
        mapUrl: "#"
    },
    {
        city: "Bali (Denpasar)",
        address: "Jl. Cok Agung Tresna No.65, Sumerta Kelod, Denpasar Tim., Kota Denpasar",
        hours: "Senin - Jumat: 08.30 - 15.30 WIB",
        mapUrl: "#"
    }
];

export default function ContactPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-[#b48d5e] font-serif mb-8 border-b border-gray-200 pb-4">
                Hubungi Kami
            </h1>

            {/* Head Office Section */}
            <div className="mb-12">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Building2 className="text-[#b48d5e]" />
                    Kantor Pusat
                </h2>
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8">
                    <div className="flex-1">
                        <h3 className="font-bold text-lg text-[#1e3a8a] mb-2">Unit Bisnis Pengolahan dan Pemurnian Logam Mulia</h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                            Jl. Raya Bekasi Timur Km.18, Pulogadung<br />
                            Jakarta Timur 13250<br />
                            Indonesia
                        </p>
                        {/* Head Office usually keeps contact info? User said "di setiap butik itu tidak ada". 
                            I will assume Head Office MIGHT have it, or safe to remove too. 
                            Let's keep it minimal as per instruction "halaman itu semua lokasi ada... beda nya no tlp dan email di setiap butik tidak ada"
                            I will just show address for Head Office too to be consistent strictly matching "contact us" listing typically finding locations.
                         */}
                    </div>
                </div>
            </div>

            {/* Boutiques List */}
            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <MapPin className="text-[#b48d5e]" />
                    Lokasi Butik Emas LM
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {LOCATIONS.map((loc, idx) => (
                        <div key={idx} className="bg-white rounded-lg shadow-sm hover:shadow-md transition border border-gray-100 p-6 flex flex-col">
                            <h3 className="font-bold text-[#b48d5e] text-lg mb-3 border-b border-gray-100 pb-2">
                                {loc.city}
                            </h3>

                            <div className="space-y-3 text-sm text-gray-600 flex-1">
                                <p className="leading-relaxed">
                                    {loc.address}
                                </p>
                                <div className="flex items-start gap-2 pt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                                    <Clock size={14} className="mt-0.5" />
                                    <span>{loc.hours}</span>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-50 text-center">
                                <a
                                    href={loc.mapUrl}
                                    target="_blank"
                                    className="text-xs font-bold text-[#1e3a8a] uppercase tracking-wider hover:text-[#b48d5e] transition"
                                >
                                    Lihat di Peta
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Help Callout */}
            <div className="mt-16 text-center bg-[#1e3a8a] text-white rounded-xl p-8">
                <h3 className="text-2xl font-serif font-bold mb-4">Butuh Bantuan?</h3>
                <p className="opacity-90 max-w-2xl mx-auto text-sm">
                    Jika Anda memiliki pertanyaan seputar produk atau layanan kami, silakan hubungi Call Center atau melalui WhatsApp resmi kami.
                </p>
                {/* No specific contact details added here to respect "no tlp/email" request broadly, or user meant SPECIFICALLY on boutiques. 
                    Usually a contact page HAS a contact form or generalized call center. I'll leave it as a layout block.
                 */}
            </div>
        </div>
    );
}
