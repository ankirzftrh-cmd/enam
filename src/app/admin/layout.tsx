"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Users, LogOut, Menu } from "lucide-react";
import { clsx } from "clsx";
import { useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const navItems = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Products", href: "/admin/products", icon: Package },
        { name: "Users", href: "/admin/users", icon: Users },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <aside
                className={clsx(
                    "bg-secondary-dark text-white fixed h-full z-20 transition-all duration-300",
                    isSidebarOpen ? "w-64" : "w-16 hover:w-64 group" // Hover to expand if collapsed
                )}
            >
                <div className="p-4 flex items-center justify-between border-b border-white/10">
                    <span className={clsx("font-bold text-xl font-serif", !isSidebarOpen && "hidden group-hover:block")}>
                        Admin Panel
                    </span>
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-white/10 rounded">
                        <Menu size={20} />
                    </button>
                </div>

                <nav className="mt-8 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={clsx(
                                    "flex items-center px-4 py-3 text-gray-300 hover:bg-secondary hover:text-white transition-colors",
                                    isActive && "bg-secondary text-white border-l-4 border-primary"
                                )}
                            >
                                <item.icon size={20} />
                                <span className={clsx("ml-3 transition-opacity", !isSidebarOpen && "hidden group-hover:block")}>
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-4 left-0 w-full px-4">
                    <button
                        onClick={async () => {
                            await fetch('/api/auth/logout', { method: 'POST' });
                            window.location.href = '/login';
                        }}
                        className="flex items-center w-full px-4 py-2 text-red-300 hover:bg-red-900/30 rounded transition-colors"
                    >
                        <LogOut size={20} />
                        <span className={clsx("ml-3", !isSidebarOpen && "hidden group-hover:block")}>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={clsx("flex-1 p-8 transition-all duration-300", isSidebarOpen ? "ml-64" : "ml-16")}>
                {children}
            </main>
        </div>
    );
}
