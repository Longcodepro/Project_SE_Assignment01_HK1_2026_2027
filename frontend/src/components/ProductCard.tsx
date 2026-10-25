import { Product } from "@/types";

interface ProductCardProps{
    product: Product;
    onClick? :()=>void
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
    return(
        <div
            onClick={onClick}
            className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition border border-amber-100/80 flex items-center gap-4 cursor-pointer group"
            >
                {/* Ảnh món nước */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                src={product.imageUrl}
                alt={product.name}
                className="w-24 h-24 rounded-xl object-cover bg-amber-50 flex-shrink-0 group-hover:scale-105 transition"
                />

                {/* Thông tin món */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-base truncate group-hover:text-amber-800 transition">
                        {product.name}
                    </h3>
                    <p className="text-amber-700 font-extrabold text-lg mt-1">
                        {product.price.toLocaleString('vi-VN')}đ
                    </p>
                    <span className="inline-block mt-2 text-xs font-semibold text-amber-800 bg-amber-100/60 px-2.5 py-0.5 rounded-full">
                        Size S tiêu chuẩn
                    </span>
                </div>
            </div>
    );
}