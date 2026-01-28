"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images, name }: { images: string[], name: string }) {
    const [selectedImage, setSelectedImage] = useState(images[0] || "/placeholder.jpg");

    // Ensure we have valid images
    const validImages = images.filter(Boolean).length > 0 ? images.filter(Boolean) : ["/placeholder.jpg"];

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="w-full bg-gray-50 rounded-lg aspect-square relative flex items-center justify-center p-8 border border-gray-100">
                {selectedImage ? (
                    <Image src={selectedImage} alt={name} fill className="object-contain" priority />
                ) : (
                    <span className="text-gray-300">No Image</span>
                )}
            </div>

            {/* Thumbnails (Bottom) */}
            <div className="flex flex-row gap-4 overflow-x-auto pb-2">
                {validImages.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelectedImage(img)}
                        className={`w-20 h-20 flex-shrink-0 border-2 rounded-lg relative overflow-hidden transition ${selectedImage === img ? 'border-[#b48d5e]' : 'border-transparent hover:border-gray-300'}`}
                    >
                        <Image src={img!} alt="Thumbnail" fill className="object-cover" />
                    </button>
                ))}
            </div>
        </div>
    );
}
