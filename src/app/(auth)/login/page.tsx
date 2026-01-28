"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Check, Loader2 } from "lucide-react";
import Image from "next/image";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const registered = searchParams.get('registered');

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isCaptchaChecked, setIsCaptchaChecked] = useState(false);
    const [isCaptchaLoading, setIsCaptchaLoading] = useState(false);

    const handleCaptchaClick = () => {
        if (isCaptchaChecked || isCaptchaLoading) return;
        setIsCaptchaLoading(true);
        // Simulate network delay for realism
        setTimeout(() => {
            setIsCaptchaLoading(false);
            setIsCaptchaChecked(true);
        }, 1000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isCaptchaChecked) {
            setError("Silakan verifikasi bahwa Anda bukan robot.");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                if (data.redirectUrl) {
                    router.push(data.redirectUrl);
                    router.refresh();
                } else {
                    router.push("/");
                    router.refresh();
                }
            } else {
                setError(data.error || "Login gagal");
            }
        } catch (err) {
            console.error(err);
            setError("Terjadi kesalahan jaringan");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {registered && (
                <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm text-center font-medium mb-6 border border-green-200">
                    Akun berhasil dibuat! Silakan login.
                </div>
            )}

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center font-medium mb-6 border border-red-100">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
                <div className="space-y-1">
                    <label className="block text-sm font-bold text-[#3d5d97]">Email</label>
                    <div className="relative">
                        <input
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="w-full border border-gray-300 rounded px-4 py-3 text-gray-700 focus:ring-1 focus:ring-[#bf9a53] focus:border-[#bf9a53] outline-none transition-all placeholder:text-gray-300 text-sm"
                            placeholder="Masukan email Anda"
                        />
                        <div className="absolute right-3 top-3 text-[#bf9a53]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                        </div>
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-bold text-[#3d5d97]">Kata Sandi</label>
                    <div className="relative">
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            required
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            className="w-full border border-gray-300 rounded px-4 py-3 text-gray-700 focus:ring-1 focus:ring-[#bf9a53] focus:border-[#bf9a53] outline-none transition-all placeholder:text-gray-300 text-sm"
                            placeholder="Masukan kata sandi Anda"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-[#bf9a53] hover:text-[#9e7f43]"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#bf9a53] focus:ring-[#bf9a53]" />
                        <span className="text-gray-500">Ingat Saya</span>
                    </label>
                    <Link href="/forgot-password" className="text-gray-500 underline decoration-gray-400 hover:text-[#bf9a53]">
                        Lupa Password?
                    </Link>
                </div>

                <div className="flex items-center justify-between mt-2">
                    <div className="text-[#3d5d97] font-bold text-sm">Atau</div>
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
                </div>

                <div className="pt-2 flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading || !isCaptchaChecked}
                        className="bg-[#bf9a53] hover:bg-[#a68545] text-white font-bold py-3 px-10 rounded-lg shadow-md transition-all uppercase tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed w-40"
                    >
                        {isLoading ? "Memproses..." : "LOG IN"}
                    </button>
                </div>

            </form>
        </>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-start pt-10 px-4">
            {/* HEADER LOGOS */}
            <div className="w-full max-w-5xl flex justify-between items-center mb-8 px-4">
                <Link href="/">
                    <Image src="/images/logoweb.jpg" alt="Logam Mulia" width={200} height={60} className="h-12 w-auto object-contain" />
                </Link>
                <div className="flex items-center gap-2">
                    <Image src="/images/logo1.webp" alt="Antam" width={100} height={40} className="h-10 w-auto object-contain" />
                </div>
            </div>

            {/* MAIN CARD */}
            <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row min-h-[500px]">

                {/* LEFT SIDE (Register CTA) - Or Top on Mobile */}
                <div className="md:w-1/3 bg-white p-8 md:p-12 flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r border-gray-100">
                    <div className="mb-6">
                        {/* Decorative Icon like a user add icon could go here */}
                    </div>
                    <Link href="/register">
                        <button className="bg-[#bf9a53] hover:bg-[#a68545] text-white font-bold py-3 px-12 rounded-lg shadow-md transition-all uppercase tracking-wider text-sm">
                            Daftar
                        </button>
                    </Link>

                </div>

                {/* RIGHT SIDE (Login Form) */}
                <div className="md:w-2/3 p-8 md:p-12">
                    <h2 className="text-3xl font-serif text-[#bf9a53] font-bold text-center mb-8">Login Form</h2>

                    <Suspense fallback={<div className="text-center py-4">Loading...</div>}>
                        <LoginForm />
                    </Suspense>
                </div>
            </div>

            <div className="mt-12 mb-8">
                <Link href="/" className="text-[#bf9a53] font-bold underline hover:text-[#a68545] text-sm tracking-wide">
                    Kembali ke Halaman Utama
                </Link>
            </div>
        </div>
    );
}
