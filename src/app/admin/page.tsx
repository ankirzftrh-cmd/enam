import AdminDashboard from "@/components/AdminDashboard";
import { getProducts, getAllCategories } from "@/lib/products";

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
    const products = await getProducts();
    const categories = await getAllCategories();
    return <AdminDashboard initialProducts={products} allCategories={categories} />;
}
