'use client';
import {useEffect , useState} from 'react';
import { Product } from '@/types';
import { apiService } from '@/services/api';
import {Coffee, Loader2, AlertCircle} from 'lucide-react';
import ProductCard from '@/components/ProductCard';

const MOCK_PRODUCTS: Product[]=[
 {
    id: 1,
    name: 'Cà phê sữa đá',
    price: 29000,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_R8kgnxD--AhSipSms0VWJY-z515pyQfuEcW8F-XZjw&s=10',
    stock: 50,
 },
 {
    id: 2,
    name: 'Bạc xỉu',
    price: 32000,
    imageUrl: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?w=500',
    stock: 40,
  },
  {
    id: 3,
    name: 'Cà phê đen đá',
    price: 25000,
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500',
    stock: 30,
  },
  {
    id: 4,
    name: 'Trà đào cam sả',
    price: 35000,
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500',
    stock: 25,
  },
];
export default function MenuPage(){
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError]=useState<string | null >(null);

  useEffect(()=>{
    async function fetchMenu(){
      try{
        setLoading(true);
        setError(null);
         
        //gọi API backend thật
        const data=await apiService.getProducts();
        setProducts(data);
      }catch (err){
        console.warn('Backend chưa bật hoặc gặp lỗi, sử dụng dữ liệu mẫu', err);
        setProducts(MOCK_PRODUCTS);
      }finally{
        setLoading(false);
      }
    }
    fetchMenu();
  },[]);  
  return(
    <div className="min-h-screen bg-amber-50/40 py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Tiêu đề trang Menu chuẩn Wireframe màn 1 */}
        <header className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-amber-100 rounded-full mb-3 text-amber-800">
            <Coffee className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-amber-950">Menu BrewLite</h1>
          <p className="text-amber-800/80 text-sm mt-1">Cà phê nguyên chất · Đặt nhanh không tiền mặt</p>
        </header>

        {/* TIÊU CHÍ 1: TRẠNG THÁI ĐANG TẢI (LOADING STATE) */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 text-amber-900">
            <Loader2 className="w-10 h-10 animate-spin text-amber-600 mb-3" />
            <p className="font-medium text-sm">Đang tải thực đơn hôm nay...</p>
          </div>
        )}

        {/* TIÊU CHÍ 2: TRẠNG THÁI EMPTY */}
        {!loading && !error && products.length === 0 && (
          <div className="bg-white border border-dashed border-amber-200 rounded-2xl p-12 text-center max-w-md mx-auto my-12">
            <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800">Quán tạm hết món!</h3>
             <p className="text-sm text-gray-500 mt-1">Hiện chưa có sản phẩm nào trong thực đơn.</p>
          </div>
        )}
        
        {/* TRẠNG THÁI LỖI KHI BACKEND CHƯA BẬT HOẶC RỚT MẠNG */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center max-w-md mx-auto my-12">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
            <p className="text-red-700 font-semibold">{error}</p>
            <p className="text-xs text-red-500 mt-1">Gợi ý: Kiểm tra xem Backend cổng 4000 đã bật chưa nhé.</p>
          </div>
        )}

        {/* 3. LƯỚI SẢN PHẨM (GRID VIEW) */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map((item) => (
              <ProductCard 
              key={item.id} 
              product={item} 
              onClick={() => console.log('Đã bấm chọn món:', item.name)}
            />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

