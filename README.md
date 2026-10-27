# BrewLite

Ứng dụng đặt cà phê không dùng tiền mặt — Đồ án môn **Công nghệ phần mềm** (Học kỳ 1, Năm học 2026–2027).

---

## 1. Giới thiệu dự án

**BrewLite** cung cấp giải pháp đặt đồ uống trực tuyến nhanh chóng, tiện lợi và hiện đại cho chuỗi cửa hàng cà phê. Toàn bộ quy trình từ xem menu, tùy chọn sản phẩm (size, topping), quản lý giỏ hàng, đặt đơn, thanh toán không tiền mặt (Ví điện tử / Thẻ ngân hàng) đến tra cứu lịch sử đơn hàng đều được thiết kế khép kín và tự động hóa.

### Thành viên nhóm phát triển

| Thành viên | Vai trò | GitHub |
|---|---|---|
| **Nguyễn Thành Long** | Backend Developer, Scrum Master | [`Longcodepro`](https://github.com/Longcodepro) |
| **Trần Vĩnh Tài** | Frontend Developer | [`TaiTran263`](https://github.com/TaiTran263) |

### Công nghệ sử dụng

- **Frontend:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack), [Tailwind CSS](https://tailwindcss.com/), [Zustand](https://github.com/pmndrs/zustand) (state management & local persistence), [Axios](https://axios-http.com/).
- **Backend:** [NestJS 12](https://nestjs.com/) (ESM, TypeScript), [Prisma 7](https://www.prisma.io/) ORM, [PostgreSQL 16](https://www.postgresql.org/).
- **Xác thực & Bảo mật:** JSON Web Token (`@nestjs/jwt`), `bcryptjs`, Khóa lạc quan (Optimistic Locking), Chống gửi trùng (`Idempotency-Key`).
- **DevOps & Tooling:** Docker & Docker Compose, GitHub Actions (CI/CD), Vitest (backend testing), Oxlint & ESLint.

---

## 2. Cấu trúc thư mục

```text
Project_SE_Assignment01_HK1_2026_2027/
├── backend/                  # Mã nguồn NestJS API & Prisma ORM
│   ├── prisma/               # Schema dữ liệu, migrations SQL và seed mẫu
│   ├── src/
│   │   ├── auth/             # Module xác thực JWT, đăng ký & đăng nhập
│   │   ├── common/           # Tiện ích chung, xử lý Idempotency, validation
│   │   ├── orders/           # Quản lý đơn hàng, tính giá server, state machine
│   │   ├── payments/         # Thanh toán Ví/Thẻ, tích điểm, khóa lạc quan
│   │   └── products/         # Danh mục món, hiển thị menu
│   └── postman/              # Postman collection & environment test API
├── frontend/                 # Mã nguồn giao diện Next.js
│   └── src/
│       ├── app/              # Trang Next.js App Router (menu, cart, checkout, orders)
│       ├── components/       # Component dùng chung (Navbar, Modal, ...)
│       ├── services/         # Axios API Client gọi sang Backend
│       └── store/            # Quản lý trạng thái giỏ hàng (Zustand)
├── docs/                     # Tài liệu thiết kế & báo cáo tiến độ
│   ├── API-CONTRACT.md       # Đặc tả hợp đồng giao tiếp API Frontend - Backend
│   ├── HUONG-DAN-LAM-ISSUE.md # Quy trình Agile/Scrum, Git workflow & Definition of Done
│   └── TienDoCongViec.tex    # Báo cáo tiến độ đồ án (LaTeX XeLaTeX)
├── .github/                  # GitHub Actions CI workflow & Issue/PR Templates
└── docker-compose.yml        # Cấu hình container chạy toàn bộ hệ thống
```

---

## 3. Cài đặt và chạy dự án

### Yêu cầu tiên quyết
- Cài đặt sẵn [Docker](https://docs.docker.com/get-docker/) và [Docker Compose](https://docs.docker.com/compose/).
- Nếu chạy trực tiếp trên máy không dùng Docker: yêu cầu [Node.js 22+](https://nodejs.org/) và máy chủ PostgreSQL 16.

### Cách 1: Chạy toàn bộ hệ thống bằng Docker Compose (Khuyên dùng)

1. **Chuẩn bị biến môi trường:**
   ```bash
   cp .env.example .env
   ```
   *(File `.env` mặc định đã có cấu hình sẵn sàng cho môi trường phát triển local).*

2. **Khởi động các dịch vụ:**
   ```bash
   docker compose up --build
   ```
   - Lệnh này sẽ khởi động toàn bộ hệ thống và hiển thị trực tiếp log ra terminal (bao gồm log HTTP request của Backend như `[HTTP] GET /products 200 - 15ms`).
   - Khi chạy lần đầu, container Backend sẽ tự động chạy Prisma Migration và nạp dữ liệu mẫu (Seed) vào cơ sở dữ liệu.
   - Nếu bạn khởi động ngầm (`docker compose up -d`), bạn có thể theo dõi log backend bất kỳ lúc nào bằng lệnh:
     ```bash
     bash scripts/logs.sh
     # hoặc: docker compose logs -f backend
     ```

3. **Địa chỉ các dịch vụ:**
   | Service | Địa chỉ | Ghi chú |
   |---|---|---|
   | **Frontend** | [http://localhost:4001](http://localhost:4001) | Giao diện web khách hàng |
   | **Backend API** | [http://localhost:4000](http://localhost:4000) | REST API NestJS |
   | **Swagger UI** | [http://localhost:4000/docs](http://localhost:4000/docs) | Tài liệu trực quan và test API |
   | **PostgreSQL** | `localhost:4002` | Database (`brewlite_db`) |

4. **Dừng hệ thống:**
   ```bash
   docker compose down
   # Hoặc xóa cả volume dữ liệu để chạy lại từ đầu:
   docker compose down -v
   ```

---

### Cách 2: Chạy cục bộ từng dịch vụ (Dành cho Developer)

#### Chạy Backend:
```bash
cd backend
npm ci

# Thiết lập database (nếu chạy Postgres cục bộ):
npx prisma migrate deploy
npx prisma db seed

# Chạy backend ở chế độ watch:
PORT=4000 npm run start:dev
```

#### Chạy Frontend:
```bash
cd frontend
npm ci

# Chạy Next.js dev server ở cổng 4001:
NEXT_PUBLIC_API_URL=http://localhost:4000 npm run dev -- -p 4001
```

---

## 4. Kiểm thử và Kiểm tra chất lượng (CI Checks)

Trước khi tạo commit và mở Pull Request, toàn bộ mã nguồn phải vượt qua các bài kiểm tra tự động tương đương với quy trình GitHub Actions CI:

### Backend
```bash
cd backend
npm run lint          # Kiểm tra code style & type bằng oxlint
npm run build         # Biên dịch NestJS và sinh Prisma Client
npm test              # Chạy 64 unit test cases với Vitest
```

### Frontend
```bash
cd frontend
npm run lint          # Kiểm tra mã nguồn với ESLint
npm run build         # Kiểm tra biên dịch Next.js (Turbopack)
```

---

## 5. Danh sách API Backend

Chi tiết từng tham số request, response mẫu và mã lỗi được chuẩn hóa tại [`docs/API-CONTRACT.md`](docs/API-CONTRACT.md) và Swagger UI tại [`http://localhost:4000/docs`](http://localhost:4000/docs).

| Phương thức | Endpoint | Yêu cầu xác thực | Chức năng |
|---|---|---|---|
| `GET` | `/` | Không | Health-check backend (`Hello World!`) |
| `GET` | `/products` | Không | Danh sách sản phẩm menu, giá gốc, hình ảnh |
| `POST` | `/auth/register` | Không | Đăng ký tài khoản mới (băm mật khẩu `bcryptjs`) |
| `POST` | `/auth/login` | Không | Đăng nhập hệ thống, cấp `accessToken` (JWT) |
| `POST` | `/orders` | `Bearer Token` | Tạo đơn hàng mới (`PENDING`), tính tổng tiền trên server, hỗ trợ header `Idempotency-Key` |
| `GET` | `/orders/me` | `Bearer Token` | Xem lịch sử đơn hàng của tài khoản đang đăng nhập |
| `POST` | `/payments` | `Bearer Token` | Thanh toán không tiền mặt (Ví/Thẻ), chuyển trạng thái đơn hàng, khóa lạc quan `version`, tích điểm |

### Quy tắc nghiệp vụ cốt lõi

1. **Bảo mật giá (Server-side Pricing):** Client tuyệt đối không gửi giá tiền lên. Server tự tính tổng tiền dựa trên công thức:
   $$\text{Tổng tiền} = \sum (\text{Số lượng} \times (\text{Giá gốc} + \text{Phụ thu size} + \text{Giá topping}))$$
   - Size: S (+0đ), M (+5.000đ), L (+10.000đ).
   - Topping: Trân châu (8.000đ), Kem cheese (10.000đ), Thạch cafe (6.000đ).
2. **Order State Machine:** Vòng đời đơn hàng tuân thủ trạng thái:
   - `PENDING` ➔ `PAID` (Thành công)
   - `PENDING` ➔ `PAYMENT_FAILED` (Thất bại)
   - `PAYMENT_FAILED` ➔ `PAID` (Cho phép khách hàng thử thanh toán lại)
   - Đơn đã `PAID` không được chuyển sang bất kỳ trạng thái nào khác.
3. **Mô phỏng Cổng thanh toán (Mock Gateway):**
   - Thẻ ngân hàng (`CARD`): Bắt buộc số thẻ; thẻ có 4 chữ số tận cùng là `0000` sẽ bị từ chối giao dịch.
   - Ví điện tử (`WALLET`): Từ chối các đơn hàng có giá trị vượt quá 500.000đ.
4. **Khóa lạc quan (Optimistic Locking):** Đơn hàng có trường `version`. Mỗi lần thanh toán hoặc cập nhật đơn đều kiểm tra và tăng `version` nhằm ngăn chặn xung đột thanh toán đồng thời (Race Condition).
5. **Chống gửi trùng (Idempotency):** Hỗ trợ header tùy chọn `Idempotency-Key` cho cả `POST /orders` và `POST /payments`, trả về kết quả cũ kèm `X-Cache: HIT` nếu gửi lặp lại yêu cầu.
6. **Chương trình khách hàng thân thiết (Loyalty):** Tích lũy 1 điểm cho mỗi 1.000đ giá trị thanh toán thành công.

---

## 6. Kịch bản Demo End-to-End

Quy trình trải nghiệm hoàn chỉnh của khách hàng:

1. **Xem thực đơn:** Khách hàng truy cập trang chủ [http://localhost:4001](http://localhost:4001), duyệt danh sách các món cà phê và trà được tải từ API `/products`.
2. **Tùy chọn món:** Bấm vào một món để mở modal chi tiết: chọn kích cỡ ly (S, M, L) và các món kèm (trân châu, kem cheese, thạch cafe). Giá tổng cập nhật theo thời gian thực.
3. **Quản lý giỏ hàng:** Thêm món vào giỏ hàng. Tại trang `/cart`, người dùng có thể điều chỉnh số lượng ly hoặc xóa món. Dữ liệu giỏ hàng được tự động đồng bộ qua `localStorage`.
4. **Đặt đơn hàng:** Bấm nút thanh toán, hệ thống gửi dữ liệu giỏ hàng lên `POST /orders`. Backend xác thực và tạo đơn ở trạng thái `PENDING`.
5. **Thanh toán không tiền mặt:** Tại trang `/checkout`, người dùng chọn hình thức thanh toán Ví điện tử (`WALLET`) hoặc Thẻ tín dụng/ghi nợ (`CARD`). Hệ thống gọi `POST /payments` để hoàn tất giao dịch.
6. **Xác nhận & Tích điểm:** Màn hình `/order-success` hiển thị thông báo thành công cùng số điểm loyalty tích lũy được.
7. **Lịch sử đơn hàng:** Khách hàng vào trang `/orders` để tra cứu lại toàn bộ danh sách các đơn đã đặt và theo dõi trạng thái đơn hàng.
