# API Contract

Base URL: `http://localhost:4000`. Mọi thay đổi phải báo người kia trước khi sửa.

## GET /products

200 OK

```json
[
  {
    "id": 1,
    "name": "Cà phê sữa",
    "price": 29000,
    "imageUrl": "https://example.com/ca-phe-sua.jpg"
  }
]
```

`price`: số nguyên, đơn vị VND (size S). Size/topping thêm ở Task 4.

## POST /orders

Cần header `Authorization: Bearer <accessToken>`, thiếu hoặc sai token trả 401. Đơn được gắn với người dùng trong token.

Request

```json
{
  "items": [
    { "productId": 1, "quantity": 2, "size": "M", "toppings": ["tran-chau"] }
  ]
}
```

201 Created

```json
{ "id": "ord_123", "status": "PENDING", "total": 84000 }
```

`total` do server tính: Σ `quantity × (giá sản phẩm + phụ thu size + giá topping)`. Phụ thu size: S +0, M +5.000, L +10.000. Topping: `tran-chau` 8.000, `kem-cheese` 10.000, `thach-cafe` 6.000. Ví dụ trên: 2 × (29.000 + 5.000 + 8.000) = 84.000. Client không gửi giá; trường lạ bị từ chối (400).

400 khi dữ liệu không hợp lệ (giỏ rỗng, `quantity` ngoài 1–99, `size`/`toppings` lạ, `productId` không tồn tại):

```json
{ "statusCode": 400, "message": ["items must not be empty"], "error": "Bad Request" }
```

Trạng thái đơn: `PENDING` → `PAID` | `PAYMENT_FAILED`.

## POST /auth/register

Request

```json
{ "email": "long@test.com", "password": "matkhau123", "name": "Long" }
```

`email` được chuẩn hóa chữ thường. `password` 6–72 ký tự. `name` không bắt buộc.

201 Created

```json
{ "id": 1, "email": "long@test.com", "name": "Long" }
```

400 khi email/mật khẩu không hợp lệ. 409 khi email đã đăng ký.

## POST /auth/login

Request

```json
{ "email": "long@test.com", "password": "matkhau123" }
```

200 OK

```json
{ "accessToken": "eyJhbGciOi..." }
```

401 khi sai email hoặc mật khẩu (cùng một thông báo cho cả hai trường hợp). Token hết hạn sau `JWT_EXPIRES_IN` (mặc định 1 ngày); gửi lên bằng header `Authorization: Bearer <accessToken>`.
