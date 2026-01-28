import { MapPin, Phone, Clock } from 'lucide-react';

const BOUTIQUES = [
    {
        city: "Jakarta (Gedung Antam)",
        address: "Gedung Aneka Tambang, Jl. Letjen T.B. Simatupang No.1, RT.10/RW.4, Tanjung Barat, Jagakarsa, Jakarta Selatan 12530",
        phone: "(021) 7891234",
        hours: "Senin - Jumat: 08.00 - 15.00 WIB",
        mapUrl: "https://goo.gl/maps/example1"
    },
    {
        city: "Jakarta (Pulo Gadung)",
        address: "Jl. Pemuda, Jl. Kayu Putih Raya No.1, Pulo Gadung, Jakarta Timur 13210",
        phone: "(021) 4757108",
        hours: "Senin - Jumat: 08.30 - 15.30 WIB",
        mapUrl: "https://goo.gl/maps/example2"
    },
    {
        city: "Surabaya (Darmo)",
        address: "Jl. Raya Darmo No.12, Dr. Soetomo, Tegalsari, Surabaya, Jawa Timur 60264",
        phone: "(031) 5678901",
        hours: "Senin - Sabtu: 09.00 - 16.00 WIB",
        mapUrl: "https://goo.gl/maps/example3"
    },
    {
        city: "Bandung",
        address: "Jl. Ir. H. Juanda No.153, Lb. Siliwangi, Coblong, Kota Bandung, Jawa Barat 40132",
        phone: "(022) 2501234",
        hours: "Senin - Jumat: 08.00 - 15.00 WIB",
        mapUrl: "https://goo.gl/maps/example4"
    },
    {
        city: "Medan",
        address: "Komp. Centre Point, Jl. Timor, Gang Buntu, Medan Timur, Medan City, North Sumatra 20231",
        phone: "(061) 80501234",
        hours: "Senin - Sabtu: 09.00 - 16.00 WIB",
        mapUrl: "https://goo.gl/maps/example5"
    },
    {
        city: "Makassar",
        address: "Jl. Sam Ratulangi No.68, Maricaya Baru, Kec. Makassar, Kota Makassar, Sulawesi Selatan 90141",
        phone: "(0411) 876543",
        hours: "Senin - Jumat: 08.30 - 15.30 WIB",
        mapUrl: "https://goo.gl/maps/example6"
    },
];

export default function LokasiButikPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-secondary mb-4">Lokasi Butik Emas Antam</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Kunjungi butik resmi Logam Mulia Antam terdekat di kota Anda untuk layanan pembelian dan buyback yang aman dan terpercaya.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {BOUTIQUES.map((boutique, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 border-t-4 border-secondary">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-bold text-xl text-primary">{boutique.city}</h3>
                                <div className="bg-gray-100 p-2 rounded-full text-secondary">
                                    <MapPin size={24} />
                                </div>
                            </div>

                            <div className="space-y-4 text-sm text-gray-600">
                                <div className="flex items-start">
                                    <MapPin size={16} className="mr-2 mt-1 flex-shrink-0 text-secondary" />
                                    <span>{boutique.address}</span>
                                </div>
                                <div className="flex items-center">
                                    <Phone size={16} className="mr-2 flex-shrink-0 text-secondary" />
                                    <span>{boutique.phone}</span>
                                </div>
                                <div className="flex items-center">
                                    <Clock size={16} className="mr-2 flex-shrink-0 text-secondary" />
                                    <span>{boutique.hours}</span>
                                </div>
                            </div>

                            <a
                                href={boutique.mapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full mt-6 bg-secondary text-white text-center py-2.5 rounded hover:bg-[#0b2d5e] transition-colors font-bold text-sm"
                            >
                                Lihat di Google Maps
                            </a>
                        </div>
                    ))}
                </div>

                <div className="mt-16 bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                    <h2 className="text-2xl font-serif font-bold text-secondary mb-4">Layanan Pelanggan</h2>
                    <p className="text-gray-600 mb-6">
                        Butuh bantuan lebih lanjut? Hubungi layanan pelanggan kami atau kirim pesan melalui WhatsApp.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition-colors">
                            WhatsApp Kami
                        </button>
                        <button className="bg-gray-200 text-gray-800 px-8 py-3 rounded-full font-bold hover:bg-gray-300 transition-colors">
                            Email Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
