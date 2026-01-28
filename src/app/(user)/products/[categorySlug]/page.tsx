import { prisma } from "@/lib/prisma";
import PurchaseGoldView from "@/components/PurchaseGoldView";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params }: { params: Promise<{ categorySlug: string }> }) {
    const { categorySlug } = await params;
    const decodedSlug = decodeURIComponent(categorySlug);

    // Fetch Category to get ID and Name
    const category = await prisma.category.findUnique({
        where: { slug: decodedSlug },
        include: { products: true }
    });

    if (!category) {
        return notFound();
    }

    const products = category.products;


    // Map specific backgrounds if available, else default to the same gold bar background for consistency
    const bannerImage = "/images/bgemasbatangan.jpg";

    return (
        <div className="bg-white">
            {/* Banner Section - Clean Image Only for ALL Categories */}
            <div className="relative w-full h-[300px] mb-8 overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={bannerImage}
                        alt="Background"
                        className="w-full h-full object-cover object-center"
                    />
                    {/* No Overlay, No Text as requested for all categories */}
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Unified Layout: Always use PurchaseGoldView */}
                <PurchaseGoldView
                    products={products as any}
                    categoryName={category.name}
                    description={`Dapatkan produk ${category.name} dengan jaminan keaslian dan kemurnian terpercaya.`}
                />
            </div>
        </div>
    );
}
