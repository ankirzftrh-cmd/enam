"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

// Define Cart Item Interface
export interface CartItem {
    id: number | string; // DB ID or Local ID
    productId: number;
    name: string;
    price: number;
    image?: string;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: any, quantity?: number) => Promise<void>;
    removeFromCart: (productId: number) => Promise<void>;
    mergeLocalCart: (userId: number) => Promise<void>;
    isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    // In a real app, use useSession() to get user ID
    // For Logic Demo, we mock or check local storage token
    const [userId, setUserId] = useState<number | null>(null);

    // 1. Initial Load
    useEffect(() => {
        // Check if user logged in (Mock Logic)
        // In real app: const { data: session } = useSession();
        // Here we simulate checking a stored user ID or assuming guest for now
        // Let's assume Guest by default unless we merge
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
            setUserId(parseInt(storedUserId));
            fetchRemoteCart(parseInt(storedUserId));
        } else {
            // Guest: Load from Local Storage
            const local = localStorage.getItem("cart");
            if (local) setItems(JSON.parse(local));
            setIsLoading(false);
        }
    }, []);

    const fetchRemoteCart = async (uid: number) => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/cart?userId=${uid}`);
            const data = await res.json();
            setItems(data.items || []);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const addToCart = async (product: any, quantity = 1) => {
        // Optimistic Update
        const newItem: CartItem = {
            id: Date.now(), // Temp ID
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        };

        const existingIdx = items.findIndex(i => i.productId === product.id);
        let newItems = [...items];

        if (existingIdx > -1) {
            newItems[existingIdx].quantity += quantity;
        } else {
            newItems.push(newItem);
        }
        setItems(newItems);

        // Persist
        if (userId) {
            // Server Sync
            await fetch("/api/cart", {
                method: "POST",
                body: JSON.stringify({ userId, productId: product.id, quantity, operation: 'add' })
            });
            fetchRemoteCart(userId); // Refresh for ID sync
        } else {
            // Local Storage
            localStorage.setItem("cart", JSON.stringify(newItems));
        }
    };

    const removeFromCart = async (productId: number) => {
        const newItems = items.filter(i => i.productId !== productId);
        setItems(newItems);

        if (userId) {
            // Server Remove (Implement DELETE api if needed, or update qty=0)
            // Skipping full delete implementation for brevity, assuming standard update
        } else {
            localStorage.setItem("cart", JSON.stringify(newItems));
        }
    };

    const mergeLocalCart = async (uid: number) => {
        // Logic: Send local items to server
        const local = localStorage.getItem("cart");
        if (local) {
            const localItems = JSON.parse(local);
            if (localItems.length > 0) {
                await fetch("/api/cart", {
                    method: "POST",
                    body: JSON.stringify({ userId: uid, items: localItems, operation: 'merge_local_storage' })
                });
                localStorage.removeItem("cart"); // Clear local
            }
        }
        setUserId(uid);
        fetchRemoteCart(uid);
    };

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, mergeLocalCart, isLoading }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within CartProvider");
    return context;
};
