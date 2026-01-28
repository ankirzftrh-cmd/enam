export const CATEGORIES = [
    { label: "Emas Batangan", slug: "emas-batangan", dbValue: "Emas Batangan" },
    { label: "Emas Imlek", slug: "emas-imlek", dbValue: "Emas Imlek" },
    { label: "Emas Idul Fitri", slug: "emas-idul-fitri", dbValue: "Emas Idul Fitri" },
    { label: "Perak Indonesian Heritage", slug: "perak", dbValue: "Perak" }, // "Perak" or "Perak Indonesian Heritage"? Map says "Perak".
    { label: "Liontin Batik", slug: "liontin-batik", dbValue: "Liontin Batik" },
    { label: "Gift Series", slug: "gift-series", dbValue: "Gift Series" },
    { label: "Produk Lain", slug: "produk-lain", dbValue: "Produk Lain" }
];

export const CATEGORY_MAP: Record<string, string> = CATEGORIES.reduce((acc, cat) => {
    acc[cat.slug] = cat.dbValue;
    return acc;
}, {} as Record<string, string>);

export const DB_CATEGORIES = CATEGORIES.map(c => c.dbValue);
