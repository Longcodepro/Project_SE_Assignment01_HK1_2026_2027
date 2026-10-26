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

    createOrderAndPay: async (orderPayload: {
        items: {
            productId: string | number;
            size: string;
            quantity: number;
            toppings: string[]; 
        }[];
        paymentMethod: 'WALLET' | 'CARD'
    })=>
    {
        //1.gọi tạo đơn POST /order (endpoint order)
        const orderRes = await axios.post (`${API_URL}/orders`, {items: orderPayload.items});
        const orderId = orderRes.data.id;

        //2.gọi thanh toán POST /payment (endpoint payment)
        const paymentRes = await axios.post(`${API_URL}/payments`, {
            orderId,
            method: orderPayload.paymentMethod,
            idempotencyKey:`pay_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        });

        return{
            orderId,
            status: paymentRes.data.status, //'PAID' hoặc 'PAYMENT_FAILED'
            total: orderRes.data.total,
        };
    },
    
};