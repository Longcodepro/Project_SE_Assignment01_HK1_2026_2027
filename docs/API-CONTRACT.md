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

Trạng thái đơn: `PENDING` → `PAID` | `PAYMENT_FAILED`. Đơn `PAYMENT_FAILED` được thanh toán lại (→ `PAID`). `PAID` là trạng thái cuối.

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

## POST /payments

Cần header `Authorization: Bearer <accessToken>`. Số tiền lấy từ đơn, client không gửi.

Request

```json
{ "orderId": "ord_123", "method": "CARD", "cardNumber": "4111111111111111" }
```

`method`: `WALLET` hoặc `CARD`. `cardNumber` (13–19 chữ số) bắt buộc khi `CARD`, không được lưu lại. Mô phỏng: thẻ có 4 số cuối `0000` bị từ chối; Ví từ chối khi đơn trên 500.000đ.

201 Created (cả khi thanh toán thất bại, xem `status`)

```json
{ "paymentId": 1, "orderId": "ord_123", "method": "CARD", "amount": 84000, "status": "PAID" }
```

Thất bại: `"status": "PAYMENT_FAILED"` kèm `"reason": "Thẻ bị từ chối"`. Gọi lại với cùng `orderId` để thử lại.

400 dữ liệu sai. 401 thiếu token. 404 đơn không tồn tại hoặc không phải của người dùng. 409 đơn đã `PAID` hoặc đang được xử lý bởi yêu cầu khác.

## GET /orders/me

Cần header `Authorization: Bearer <accessToken>`. Trả lịch sử đơn của người dùng đang đăng nhập, đơn mới nhất trước. Chưa có đơn thì trả `[]`.

200 OK

```json
[
  {
    "id": "ord_123",
    "status": "PAID",
    "total": 84000,
    "createdAt": "2026-10-26T03:40:26.834Z",
    "items": [
      {
        "productId": 1,
        "productName": "Cà phê sữa",
        "quantity": 2,
        "size": "M",
        "toppings": ["tran-chau"],
        "unitPrice": 42000
      }
    ]
  }
]
```

401 thiếu hoặc sai token.
