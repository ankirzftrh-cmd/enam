import { getProducts } from "@/lib/products";
import ProductListClient from "@/components/ProductListClient";

export default async function EmasBatanganPage() {
    // Fetch products. 
    // In a real app we might filter strictly for 'Emas Batangan' here.
    // Assuming 'Emas Batangan' is a known category or we fetch all and let client (or map) handle.
    // For now, let's fetch all and filter for ones that are likely bars (usually just categorized 'Emas Batangan' or 'Gold Bar')
    const allProducts = await getProducts();

    // Filter logic: Match category "Emas Batangan" OR generic items if specific category not set
    const products = allProducts.filter(p =>
        p.category.name === "Emas Batangan" || p.category.name === "Gold Bar"
    );

    return <ProductListClient products={products} title="Beli Emas Batangan" bannerImage="/images/bgemasbatangan.jpg" />;
}
