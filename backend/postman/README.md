# KỊCH BẢN KIỂM THỬ TỰ ĐỘNG POSTMAN (ASSIGNMENT 1 - MVP)

> **Dự án:** BrewLite - Ứng dụng đặt cà phê không dùng tiền mặt (Assignment 1)  
> **Bộ sưu tập Postman:** `backend/postman/BrewLite.postman_collection.json`  
> **Môi trường Postman:** `backend/postman/BrewLite.local.postman_environment.json`  
> **Phạm vi kiểm thử:** Tinh gọn tuyệt đối, chỉ bao gồm đúng luồng nghiệp vụ MVP của khách hàng và các yêu cầu cốt lõi của đề bài.

---

## 1. CÁC BIẾN MÔI TRƯỜNG DÙNG CHUNG (ENVIRONMENT)

File môi trường chỉ gồm đúng 5 biến tối thiểu:
1. `{{baseUrl}}`: Địa chỉ máy chủ backend (`http://localhost:4000`).
2. `{{customerEmail}}`: Tự động sinh ngẫu nhiên email (`khach_<timestamp>@example.com`) ở pre-request script để không bao giờ bị trùng lặp.
3. `{{customerPassword}}`: Mật khẩu tài khoản khách hàng (`matkhau123`).
4. `{{customerToken}}`: Tự động lưu chuỗi JWT token sau khi đăng nhập thành công.
5. `{{createdOrderId}}`: Lưu lại ID đơn hàng vừa tạo để mang sang bước thanh toán.

---

## 2. BẢNG 8 KỊCH BẢN KIỂM THỬ MVP (TEST MATRIX)

| STT | Tên kịch bản kiểm thử | Endpoint & Method | Trạng thái kỳ vọng | Tiêu chí chấp nhận (Assertion Checks) |
|---|---|---|---|---|
| **01** | Xem Menu Sản phẩm | `GET /products` | `200 OK` | Lấy danh sách đồ uống thành công, mảng không rỗng |
| **02** | Đăng ký tài khoản khách hàng | `POST /auth/register` | `201 Created` | Tạo user thành công, bảo mật không rò rỉ `passwordHash` |
| **03** | Đăng nhập lấy Token | `POST /auth/login` | `200 OK` | Đăng nhập thành công, tự động lưu `customerToken` |
| **04** | Đặt đơn hàng mới | `POST /orders` | `201 Created` | Server tự tính tổng tiền, trạng thái đơn ban đầu là `PENDING` |
| **05** | Chống gửi trùng Idempotency-Key | `POST /orders` | `201 Created` | Gửi kèm header `Idempotency-Key` thành công (Task 10b) |
| **06** | Thanh toán Ví & Tích điểm | `POST /payments` | `201 Created` | Đơn chuyển sang `PAID`, khách được tích điểm loyalty (Task 10d) |
| **07** | Chặn thanh toán lại đơn đã PAID | `POST /payments` | `409 Conflict` | Máy trạng thái (FSM) chặn không cho thanh toán 2 lần (Task 10a) |
| **08** | Xem Lịch sử đơn hàng | `GET /orders/me` | `200 OK` | Lấy danh sách lịch sử, xác nhận đơn vừa đặt đã xuất hiện |

---

## 3. CÁCH THỰC THI KIỂM THỬ

### 3.1. Chạy tự động qua Newman CLI
```bash
cd backend
npm run postman
```
*Kết quả kỳ vọng: 8/8 requests executed, 15/15 assertions passed (100% xanh lá).*

### 3.2. Chạy trên giao diện Postman Desktop
1. Bấm **Import** ➔ Nạp 2 file:
   - `backend/postman/BrewLite.postman_collection.json`
   - `backend/postman/BrewLite.local.postman_environment.json`
2. Chọn Environment: **`BrewLite - Local (Assignment 1)`**.
3. Bấm vào Collection chọn **Run collection** để chạy tự động toàn bộ luồng, hoặc bấm test từng request bằng nút **Send**.
