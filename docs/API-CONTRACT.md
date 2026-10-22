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
{ "id": "ord_123", "status": "PENDING", "total": 64000 }
```

400 khi dữ liệu không hợp lệ:

```json
{ "statusCode": 400, "message": ["items must not be empty"], "error": "Bad Request" }
```

Trạng thái đơn: `PENDING` → `PAID` | `PAYMENT_FAILED`.
