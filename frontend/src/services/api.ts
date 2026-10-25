import axios from "axios";
import { Product } from "@/types";

const API_URL=process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
export const apiService={
    getProducts :async (): Promise<Product[]>=>{
        try{
            const response = await axios.get(`${API_URL}/products`);
            return response.data;
        }catch(error){
            console.error("lỗi khi lấy danh sách sản phẩm!")
            throw error;
        }
    },
    
};