"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Check, Loader2, User, Mail, Smartphone, CreditCard, Calendar, MapPin, Lock } from "lucide-react";
import Image from "next/image";

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");

    // Captcha State
    const [isCaptchaChecked, setIsCaptchaChecked] = useState(false);
    const [isCaptchaLoading, setIsCaptchaLoading] = useState(false);

    // Agreement State
    const [agreements, setAgreements] = useState({
        terms: false,
        news: false,
        all: false
    });

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        nik: "",
        npwp: "",
        birthPlace: "",
        birthDate: "",
        password: "",
        confirmPassword: ""
    });

    const [useNikAsNpwp, setUseNikAsNpwp] = useState(false);

    const handleNikAsNpwpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setUseNikAsNpwp(checked);
        if (checked) {
            setFormData(prev => ({ ...prev, npwp: prev.nik }));
        } else {
            setFormData(prev => ({ ...prev, npwp: "" }));
        }
    };

    // Keep NPWP synced if checked
    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => {
            const newData = { ...prev, [field]: value };
            if (field === 'nik' && useNikAsNpwp) {
                newData.npwp = value;
            }
            return newData;
        });
    };

    const handleCaptchaClick = () => {
        if (isCaptchaChecked || isCaptchaLoading) return;
        setIsCaptchaLoading(true);
        setTimeout(() => {
            setIsCaptchaLoading(false);
            setIsCaptchaChecked(true);
        }, 1000);
    };

    const handleAgreementChange = (field: keyof typeof agreements) => {
        if (field === 'all') {
            const newValue = !agreements.all;
            setAgreements({ terms: newValue, news: newValue, all: newValue });
        } else {
            setAgreements(prev => {
                const newAgreements = { ...prev, [field]: !prev[field] };
                // Check if both individual boxes are checked to toggle 'all'
                if (newAgreements.terms && newAgreements.news) {
                    newAgreements.all = true;
                } else {
                    newAgreements.all = false;
                }
                return newAgreements;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Basic Validation
        if (formData.password !== formData.confirmPassword) {
            setError("Konfirmasi password tidak cocok");
            return;
        }

        if (!isCaptchaChecked) {
            setError("Silakan verifikasi captcha");
            return;
        }

        if (!agreements.terms) {
            setError("Anda harus menyetujui Syarat & Ketentuan");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phoneNumber: formData.phoneNumber,
                    nik: formData.nik,
                    npwp: formData.npwp,
                    birthPlace: formData.birthPlace,
                    birthDate: formData.birthDate,
                    password: formData.password
                })
            });

            const data = await res.json();

            if (res.ok) {
                router.push("/login?registered=true");
            } else {
                setError(data.error || "Registrasi gagal");
            }
        } catch (err) {
            console.error(err);
            setError("Terjadi kesalahan jaringan");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start py-10 px-4 font-sans">
            {/* HEADER LOGOS */}
            <div className="w-full max-w-5xl flex justify-between items-center mb-8 px-4">
                <Link href="/">
                    <Image src="/images/logoweb.jpg" alt="Logam Mulia" width={200} height={60} className="h-12 w-auto object-contain" />
                </Link>
                <div className="flex items-center gap-2">
                    <Image src="/images/logo1.webp" alt="Antam" width={100} height={40} className="h-10 w-auto object-contain" />
                </div>
            </div>

            <div className="w-full max-w-4xl bg-white rounded-xl shadow-xl overflow-hidden p-8 md:p-12 border border-gray-100">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-serif text-[#bf9a53] font-bold mb-2">Registration Form</h2>
                    <p className="text-gray-400 text-sm">Registration Form</p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-sm">
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* ROW 1: Name & Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-[#3d5d97] mb-1">
                                Nama Lengkap (Sesuai KTP, NPWP dan Rekening Bank) <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text" required
                                    className="w-full border border-gray-300 rounded px-4 py-2.5 outline-none focus:border-[#bf9a53] focus:ring-1 focus:ring-[#bf9a53] transition-all text-sm"
                                    placeholder="Pastikan Penulisan Lengkap sesuai KTP"
                                    value={formData.name}
                                    onChange={e => handleInputChange('name', e.target.value)}
                                />
                                <User size={18} className="absolute right-3 top-3 text-[#bf9a53]" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-[#3d5d97] mb-1">
                                Nomor Handphone <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="tel" required
                                    className="w-full border border-gray-300 rounded px-4 py-2.5 outline-none focus:border-[#bf9a53] focus:ring-1 focus:ring-[#bf9a53] transition-all text-sm"
                                    placeholder="Nomor handphone Anda"
                                    value={formData.phoneNumber}
                                    onChange={e => handleInputChange('phoneNumber', e.target.value)}
                                />
                                <Smartphone size={18} className="absolute right-3 top-3 text-[#bf9a53]" />
                            </div>
                        </div>
                    </div>

                    {/* ROW 2: Email & KTP */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-[#3d5d97] mb-1">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="email" required
                                    className="w-full border border-gray-300 rounded px-4 py-2.5 outline-none focus:border-[#bf9a53] focus:ring-1 focus:ring-[#bf9a53] transition-all text-sm"
                                    placeholder="Masukan email Anda"
                                    value={formData.email}
                                    onChange={e => handleInputChange('email', e.target.value)}
                                />
                                <Mail size={18} className="absolute right-3 top-3 text-[#bf9a53]" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-[#3d5d97] mb-1">
                                Nomor KTP milik Anda Sendiri <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text" required maxLength={16}
                                    className="w-full border border-gray-300 rounded px-4 py-2.5 outline-none focus:border-[#bf9a53] focus:ring-1 focus:ring-[#bf9a53] transition-all text-sm"
                                    placeholder="Nomor KTP Anda harus lengkap dan benar"
                                    value={formData.nik}
                                    onChange={e => handleInputChange('nik', e.target.value)}
                                />
                                <CreditCard size={18} className="absolute right-3 top-3 text-[#bf9a53]" />
                            </div>
                        </div>
                    </div>

                    {/* ROW 3: Birth Place & Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-[#3d5d97] mb-1">
                                Tempat Lahir <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text" required
                                    className="w-full border border-gray-300 rounded px-4 py-2.5 outline-none focus:border-[#bf9a53] focus:ring-1 focus:ring-[#bf9a53] transition-all text-sm"
                                    placeholder="Tempat Lahir Anda"
                                    value={formData.birthPlace}
                                    onChange={e => handleInputChange('birthPlace', e.target.value)}
                                />
                                <MapPin size={18} className="absolute right-3 top-3 text-[#bf9a53]" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-[#3d5d97] mb-1">
                                Tanggal Lahir <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="date" required
                                    className="w-full border border-gray-300 rounded px-4 py-2.5 outline-none focus:border-[#bf9a53] focus:ring-1 focus:ring-[#bf9a53] transition-all text-sm text-gray-600"
                                    value={formData.birthDate}
                                    onChange={e => handleInputChange('birthDate', e.target.value)}
                                />
                                {/* Date input usually has own icon, adding one might overlap or look weird, relying on browser native or custom css if needed. Keeping it simple. */}
                            </div>
                        </div>
                    </div>

                    {/* ROW 4: NPWP */}
                    <div>
                        <label className="block text-sm font-bold text-[#3d5d97] mb-1">
                            Nomor NPWP (Tidak perlu di isi jika Anda tidak memiliki NPWP pribadi)
                        </label>
                        <div className="flex items-center mb-2">
                            <input
                                id="nikAsNpwp"
                                type="checkbox"
                                checked={useNikAsNpwp}
                                onChange={handleNikAsNpwpChange}
                                className="h-4 w-4 text-[#bf9a53] focus:ring-[#bf9a53] border-gray-300 rounded"
                            />
                            <label htmlFor="nikAsNpwp" className="ml-2 block text-sm text-[#3d5d97] font-bold">
                                NIK sebagai NPWP
                            </label>
                        </div>
                        <div className="relative max-w-md">
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded px-4 py-2.5 outline-none focus:border-[#bf9a53] focus:ring-1 focus:ring-[#bf9a53] transition-all text-sm disabled:bg-gray-100 disabled:text-gray-500"
                                placeholder="Nomor NPWP milik Anda Sendiri"
                                value={formData.npwp}
                                onChange={e => handleInputChange('npwp', e.target.value)}
                                disabled={useNikAsNpwp}
                            />
                            <CreditCard size={18} className="absolute right-3 top-3 text-[#bf9a53]" />
                        </div>
                    </div>

                    {/* ROW 5: Passwords */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-[#3d5d97] mb-1">
                                Kata Sandi Baru <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"} required minLength={6}
                                    className="w-full border border-gray-300 rounded px-4 py-2.5 outline-none focus:border-[#bf9a53] focus:ring-1 focus:ring-[#bf9a53] transition-all text-sm"
                                    placeholder="Masukan kata sandi baru"
                                    value={formData.password}
                                    onChange={e => handleInputChange('password', e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-[#bf9a53] hover:text-[#9e7f43]"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-[#3d5d97] mb-1">
                                Konfirmasi Kata Sandi Baru <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"} required minLength={6}
                                    className="w-full border border-gray-300 rounded px-4 py-2.5 outline-none focus:border-[#bf9a53] focus:ring-1 focus:ring-[#bf9a53] transition-all text-sm"
                                    placeholder="Ulangi kata sandi baru"
                                    value={formData.confirmPassword}
                                    onChange={e => handleInputChange('confirmPassword', e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-3 text-[#bf9a53] hover:text-[#9e7f43]"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer - Login Link Centered */}
                    <div className="flex items-center justify-center my-6">
                        <div className="h-px bg-gray-200 w-full"></div>
                        <p className="px-4 text-xs text-gray-500 whitespace-nowrap">
                            Sudah punya akun? <Link href="/login" className="text-[#bf9a53] font-bold hover:underline">Masuk disini</Link>
                        </p>
                        <div className="h-px bg-gray-200 w-full"></div>
                    </div>

                    {/* Checkboxes */}
                    <div className="space-y-2 text-xs text-gray-600">
                        <div className="flex items-start">
                            <input id="terms" type="checkbox" checked={agreements.terms} onChange={() => handleAgreementChange('terms')} className="mt-0.5 h-4 w-4 text-[#bf9a53] focus:ring-[#bf9a53] border-gray-300 rounded" />
                            <label htmlFor="terms" className="ml-2">
                                Saya setuju dengan <span className="font-bold text-[#bf9a53]">Syarat & Ketentuan</span> dan <span className="font-bold text-[#bf9a53]">Kebijakan Privasi</span> yang disampaikan oleh ANTAM, dan dengan demikian saya menyetujui pemrosesan data pribadi saya untuk tujuan-tujuan tertentu sebagaimana dijelaskan dalam <span className="font-bold text-[#bf9a53]">Kebijakan Privasi</span>.
                            </label>
                        </div>
                        <div className="flex items-start">
                            <input id="news" type="checkbox" checked={agreements.news} onChange={() => handleAgreementChange('news')} className="mt-0.5 h-4 w-4 text-[#bf9a53] focus:ring-[#bf9a53] border-gray-300 rounded" />
                            <label htmlFor="news" className="ml-2">
                                Saya bersedia menerima informasi terkait produk, layanan, penawaran khusus, dan promosi dari ANTAM.
                            </label>
                        </div>
                        <div className="flex items-start">
                            <input id="all" type="checkbox" checked={agreements.all} onChange={() => handleAgreementChange('all')} className="mt-0.5 h-4 w-4 text-[#bf9a53] focus:ring-[#bf9a53] border-gray-300 rounded" />
                            <label htmlFor="all" className="ml-2 font-bold">
                                Saya menyetujui semua.
                            </label>
                        </div>
                    </div>

                    {/* Captcha & Submit */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
                        {/* FAKE RECAPTCHA */}
                        <div
                            className="w-[280px] h-[74px] bg-[#f9f9f9] border border-[#d3d3d3] rounded-[3px] shadow-sm flex items-center justify-between px-3 cursor-pointer hover:bg-gray-50 transition-colors select-none"
                            onClick={handleCaptchaClick}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-[24px] h-[24px] border-2 bg-white rounded-[2px] flex items-center justify-center transition-all ${isCaptchaChecked ? 'border-transparent' : 'border-[#c1c1c1]'}`}>
                                    {isCaptchaLoading ? (
                                        <Loader2 className="animate-spin text-blue-500" size={20} />
                                    ) : isCaptchaChecked ? (
                                        <Check className="text-green-600 font-bold" size={28} strokeWidth={4} />
                                    ) : null}
                                </div>
                                <span className="text-[14px] font-[400] text-black font-sans">Saya bukan robot</span>
                            </div>
                            <div className="flex flex-col items-center justify-center opacity-70 scale-90">
                                <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" width="32" height="32" alt="reCAPTCHA" />
                                <div className="text-[10px] text-[#555] mt-1 text-center leading-tight">reCAPTCHA<br /><span className="text-[8px]">Privasi - Persyaratan</span></div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-[#bf9a53] hover:bg-[#a68545] text-white font-bold py-4 px-8 rounded shadow-md transition-all uppercase tracking-wider text-sm flex-grow md:w-auto w-full disabled:opacity-50"
                        >
                            {isLoading ? "Memproses..." : "REGISTER NOW"}
                        </button>
                    </div>

                </form>
            </div>

            <div className="mt-12 mb-8">
                <Link href="/" className="text-[#bf9a53] font-bold underline hover:text-[#a68545] text-sm tracking-wide">
                    Kembali ke Halaman Utama
                </Link>
            </div>
        </div>
    );
}
