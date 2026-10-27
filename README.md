# ☕ BrewLite — Cashless Coffee Ordering Platform

> **Ứng dụng đặt cà phê trực tuyến không dùng tiền mặt**  
> Đồ án môn **Công nghệ Phần mềm** — Học kỳ 1, Năm học 2026–2027

[![CI Status](https://img.shields.io/badge/CI-Passed%20(6%2F6)-success?style=for-the-badge&logo=github-actions)](https://github.com/Longcodepro/Project_SE_Assignment01_HK1_2026_2027/actions)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2016-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/Backend-NestJS%2012-E0234E?style=for-the-badge&logo=nestjs)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%2016-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma%207-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Docker](https://img.shields.io/badge/Deployment-Docker%20Compose-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)

---

## 📌 1. Giới thiệu dự án

**BrewLite** là nền tảng đặt cà phê và đồ uống khép kín dành cho khách hàng hiện đại. Toàn bộ chu trình từ xem menu, tùy chọn sản phẩm (kích cỡ size, topping), quản lý giỏ hàng, đặt hàng, thanh toán điện tử (Ví/Thẻ) đến theo dõi lịch sử đơn hàng đều được tự động hóa đồng bộ giữa Web và API Backend.

### 👥 Nhóm phát triển

| Thành viên | Vai trò phụ trách | GitHub |
|---|---|---|
| **Nguyễn Thành Long** | Backend Developer, Scrum Master, DevOps | [@Longcodepro](https://github.com/Longcodepro) |
| **Trần Vĩnh Tài** | Frontend Developer, UI/UX Designer | [@TaiTran263](https://github.com/TaiTran263) |

---

## 🏗️ 2. Kiến trúc hệ thống & Luồng dữ liệu

```text
 ┌────────────────────────┐              ┌───────────────────────────┐
 │   Khách hàng (Web/App)  │              │     Triển khai Vercel     │
 │   Desktop & Điện thoại │ <──────────> │   Next.js 16 (Port 4001)  │
 └────────────────────────┘              └─────────────┬─────────────┘
                                                       │ HTTPS Tunnel
                                                       ▼
 ┌───────────────────────────────────────────────────────────────────┐
 │                     Môi trường Docker Container                   │
 │                                                                   │
 │   ┌───────────────────────┐            ┌──────────────────────┐   │
 │   │   Cloudflare Tunnel   │ ─────────> │   Backend NestJS 12  │   │
 │   │   (Đường hầm HTTPS)   │            │   (Cổng 4000)        │   │
 │   └───────────────────────┘            └──────────┬───────────┘   │
 │                                                   │ Prisma ORM    │
 │                                                   ▼               │
 │                                        ┌──────────────────────┐   │
 │                                        │   PostgreSQL 16 DB   │   │
 │                                        │   (Cổng 4002)        │   │
 │                                        └──────────────────────┘   │
 └───────────────────────────────────────────────────────────────────┘
```

---

## ⚡ 3. Hướng dẫn chạy hệ thống (Quick Start)

### Yêu cầu môi trường
- Đã cài đặt [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/).
- Nếu chạy trực tiếp trên máy không qua Docker: yêu cầu [Node.js 22+](https://nodejs.org/) và PostgreSQL 16.

---

### 🚀 Cách 1: Khởi động 1-chạm bằng Docker Compose (Khuyên dùng)

Đây là cách chạy chuẩn nhất để kiểm thử toàn bộ hệ thống (Frontend + Backend + Database) chỉ bằng 1 lệnh duy nhất:

```bash
# 1. Sao chép cấu hình môi trường
cp .env.example .env

# 2. Khởi động toàn bộ các dịch vụ và hiển thị log trực tiếp ra màn hình
docker compose up --build
```

> 💡 **Tính năng nổi bật khi chạy lệnh này:**
> - Hệ thống tự động biên dịch container, chạy Prisma Migration tạo bảng và nạp dữ liệu mẫu (Seed) vào cơ sở dữ liệu.
> - **Live HTTP Request Logging**: Mọi thao tác click chuột trên web (đăng nhập, xem món, đặt hàng, thanh toán) đều được in trực tiếp ra màn hình terminal kèm method, URL, status code và thời gian phản hồi (ms).

#### Tiện ích quản lý:
```bash
# Nếu chạy ngầm (-d), theo dõi log backend bất kỳ lúc nào bằng script:
bash scripts/logs.sh

# Dừng hệ thống:
docker compose down

# Dừng và xóa toàn bộ dữ liệu database để chạy lại từ đầu:
docker compose down -v
```

---

### 🌐 Cách 2: Chạy Demo Online (Vercel + Cloudflare Tunnel)

Phù hợp cho việc trình diễn demo từ xa hoặc mở trang web trên điện thoại thật mà không cần mở cổng modem mạng:

1. **Khởi động Backend và Database:**
   ```bash
   docker compose up -d backend db
   ```

2. **Khởi tạo đường hầm HTTPS ra ngoài Internet:**
   ```bash
   bash scripts/start-tunnel.sh
   ```
   Hệ thống sẽ cấp một địa chỉ HTTPS công khai (ví dụ: `https://brewlite-demo.trycloudflare.com`).

3. **Kết nối:** Dán đường link trên vào biến môi trường `NEXT_PUBLIC_API_URL` trên Vercel để trải nghiệm web thật tại bất cứ đâu.

---

### 💻 Cách 3: Chạy thủ công từng phần (Dành cho Developer)

#### Chạy Backend:
```bash
cd backend
npm ci
npx prisma migrate deploy && npx prisma db seed
PORT=4000 npm run start:dev
```

#### Chạy Frontend:
```bash
cd frontend
npm ci
NEXT_PUBLIC_API_URL=http://localhost:4000 npx next dev -p 3000
```

---

## 🌐 4. Bảng tra cứu cổng & Địa chỉ dịch vụ

| Dịch vụ | Địa chỉ truy cập | Mô tả chức năng |
|---|---|---|
| **Frontend Web** | [http://localhost:4001](http://localhost:4001) | Giao diện đặt cà phê cho khách hàng |
| **Backend REST API** | [http://localhost:4000](http://localhost:4000) | Máy chủ API NestJS |
| **Swagger UI Docs** | [http://localhost:4000/docs](http://localhost:4000/docs) | Tài liệu kiểm thử API tương tác trực quan |
| **PostgreSQL Database** | `localhost:4002` | Cơ sở dữ liệu quan hệ (`brewlite_db`) |

---

## 🧪 5. Dữ liệu mẫu kiểm thử Demo

Hệ thống đã chuẩn bị sẵn các kịch bản kiểm thử nhanh để giảng viên và người đánh giá tiện theo dõi:

### 1. Tài khoản đăng nhập mẫu:
- **Email:** `long@test.com`
- **Mật khẩu:** `matkhau123`  
*(Trên modal Đăng nhập có sẵn nút bấm **"⚡ Dùng tài khoản mẫu kiểm thử"** để tự động điền nhanh).*

### 2. Kịch bản thanh toán mô phỏng (Mock Gateway):
- **Thẻ ngân hàng (`CARD`):**
  - Số thẻ có đuôi khác `0000` (ví dụ: `9704000000001234`) ➔ **Thanh toán thành công** (chuyển trạng thái đơn sang `PAID`).
  - Số thẻ có đuôi `0000` (ví dụ: `9704000000000000`) ➔ **Thanh toán thất bại** (mô phỏng thẻ bị từ chối, đơn chuyển sang `PAYMENT_FAILED` và cho phép thử lại).
- **Ví điện tử (`WALLET`):**
  - Đơn hàng $\le$ 500.000đ ➔ **Thành công**.
  - Đơn hàng > 500.000đ ➔ **Báo lỗi vượt hạn mức ví**.
- **Tích điểm thành viên:** Mỗi 1.000đ giá trị thanh toán thành công tự động tích lũy 1 điểm loyalty vào tài khoản khách hàng.

---

## 📊 6. Danh mục API RESTful

Đặc tả chi tiết schema request/response được chuẩn hóa tại [`docs/API-CONTRACT.md`](docs/API-CONTRACT.md) và tài liệu Swagger UI tại `http://localhost:4000/docs`:

| Method | Endpoint | Xác thực | Mô tả chức năng |
|:---:|---|:---:|---|
| `GET` | `/` | Public | Health-check hệ thống |
| `GET` | `/products` | Public | Lấy danh mục sản phẩm, giá gốc và hình ảnh |
| `POST` | `/auth/register` | Public | Đăng ký tài khoản (băm mật khẩu `bcryptjs`) |
| `POST` | `/auth/login` | Public | Đăng nhập hệ thống, cấp mã thông báo JWT |
| `POST` | `/orders` | Bearer Token | Tạo đơn hàng mới (`PENDING`), tính tiền tự động trên server, hỗ trợ header `Idempotency-Key` |
| `GET` | `/orders/me` | Bearer Token | Lấy danh sách lịch sử đơn hàng của người dùng hiện tại |
| `POST` | `/payments` | Bearer Token | Thanh toán mô phỏng (Ví/Thẻ), khóa lạc quan `version`, tích điểm thành viên |

### 🔒 Các quy tắc nghiệp vụ cốt lõi:
1. **Server-side Pricing:** Client tuyệt đối không gửi giá tiền. Server tự động tính tổng tiền theo công thức:
   $$\text{Tổng tiền} = \sum (\text{Số lượng} \times (\text{Giá gốc} + \text{Phụ thu size} + \text{Giá topping}))$$
   - Size: S (+0đ), M (+5.000đ), L (+10.000đ).
   - Topping: Trân châu (+8.000đ), Kem cheese (+10.000đ), Thạch cafe (+6.000đ).
2. **Order State Machine:** Đơn hàng chỉ được chuyển từ `PENDING ➔ PAID | PAYMENT_FAILED`, cho phép thử lại `PAYMENT_FAILED ➔ PAID`, chặn mọi bước chuyển trạng thái sai.
3. **Idempotency (`Idempotency-Key`):** Ngăn chặn việc gửi trùng đơn hàng hoặc trừ tiền lặp lại khi mạng lag, trả về kết quả cũ kèm header `X-Cache: HIT`.
4. **Optimistic Locking (`version`):** Ngăn chặn tranh chấp cập nhật đồng thời (Race Condition) bằng mã lỗi `409 Conflict`.

---

## 🛠️ 7. Kiểm tra chất lượng mã nguồn & CI

Quy trình tự động hóa GitHub Actions CI sẽ tự động kích hoạt mỗi khi có Pull Request và chạy kiểm tra **6/6 tiêu chí**:

```bash
# Kiểm tra phía Backend:
cd backend
npm run lint          # Kiểm tra type và coding convention bằng oxlint (0 warning, 0 error)
npm run build         # Biên dịch mã nguồn NestJS & Prisma Client
npm test              # Chạy 64 bài unit test với Vitest (100% passed)

# Kiểm tra phía Frontend:
cd frontend
npm run lint          # Kiểm tra chuẩn React 19 / Next.js 16 với ESLint
npm run build         # Biên dịch tĩnh toàn bộ 8 trang web với Next.js Turbopack
```

---

## 📁 8. Cấu trúc thư mục dự án

```text
Project_SE_Assignment01_HK1_2026_2027/
├── backend/                  # NestJS API & Prisma ORM
│   ├── prisma/               # Database schema, migrations SQL và seed dữ liệu
│   ├── src/                  # Controllers, Services, Middleware HTTP logger, Guards
│   └── postman/              # Postman collection & environment test API
├── frontend/                 # Ứng dụng Next.js 16 App Router
│   └── src/
│       ├── app/              # Trang giao diện: /, /cart, /checkout, /orders
│       ├── components/       # Components: Navbar, AuthModal, ProductDetailModal
│       ├── services/         # Axios API Client kết nối Backend
│       └── store/            # Quản lý trạng thái Zustand: useCartStore, useAuthStore
├── scripts/                  # Bộ script tiện ích tự động hóa
│   ├── logs.sh               # Stream log Backend theo thời gian thực
│   └── start-tunnel.sh       # Khởi tạo Cloudflare Tunnel HTTPS phục vụ demo
├── docs/                     # Tài liệu thiết kế & báo cáo tiến độ
│   ├── API-CONTRACT.md       # Hợp đồng giao tiếp API
│   ├── RETROSPECTIVE.md      # Biên bản họp Retrospective 3 Sprint
│   ├── TienDoCongViec.tex    # File LaTeX báo cáo tiến độ đồ án
│   ├── TienDoCongViec.pdf    # Báo cáo tiến độ hoàn chỉnh (14 trang A4)
│   └── TONG-KET-TIEN-DO.md   # Báo cáo tổng kết tiến độ đồ án
├── .github/workflows/        # CI/CD Workflows (ci.yml, cd.yml)
└── docker-compose.yml        # Khởi động toàn bộ hệ thống bằng Docker
```

---

## 📄 9. Bản quyền & Giấy phép

Đồ án được thực hiện phục vụ học tập và nghiên cứu môn **Công nghệ Phần mềm** tại trường Đại học. Mọi quyền được bảo lưu bởi nhóm phát triển.
