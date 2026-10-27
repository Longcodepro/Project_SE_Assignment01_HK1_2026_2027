<div align="center">

# ☕ BREWLITE
### 🚀 Ứng Dụng Đặt Cà Phê Mộc & Thanh Toán Không Tiền Mặt

[![Next.js 16](https://img.shields.io/badge/Next.js_16-App_Router-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![NestJS 12](https://img.shields.io/badge/NestJS_12-TypeScript_ESM-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Prisma 7](https://img.shields.io/badge/Prisma_7-Postgres_Adapter-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL 16](https://img.shields.io/badge/PostgreSQL_16-Database-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker Compose](https://img.shields.io/badge/Docker_Compose-Multi--Container-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Responsive-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

<p align="center">
  <b>Đồ án môn học:</b> Công nghệ Phần mềm (Software Engineering) — Assignment 1<br>
  <b>Học kỳ 1, Năm học 2026–2027 · Khoa Công nghệ Thông tin · Trường Đại học Sài Gòn (SGU)</b>
</p>

<p align="center">
  <a href="https://se-as1-brewlite.vercel.app">
    <img src="https://img.shields.io/badge/🌐_MỞ_WEB_TRỰC_TUYẾN-00C853?style=for-the-badge&logoColor=white" alt="Live Web">
  </a>
  <a href="https://brewlite-backend.onrender.com/docs">
    <img src="https://img.shields.io/badge/📖_SWAGGER_API_DOCS-FF6D00?style=for-the-badge&logoColor=white" alt="Swagger Docs">
  </a>
  <a href="#️-3-cẩm-nang-vận-hành-4-kịch-bản-triển-khai">
    <img src="https://img.shields.io/badge/🚀_HƯỚNG_DẪN_CHẠY-00B0FF?style=for-the-badge&logoColor=white" alt="Quickstart">
  </a>
</p>

---

### 🟢 BẢNG TRẠNG THÁI HỆ THỐNG TRỰC TUYẾN (LIVE 24/7)

| Thành Phần | Hạ Tầng Đám Mây | Trạng Thái | Địa Chỉ Trực Tiếp |
|:---|:---:|:---:|:---|
| 🌐 **Frontend Web** | Vercel Edge Network | ![Online](https://img.shields.io/badge/READY-00C853?style=flat-square&logo=vercel&logoColor=white) | [https://se-as1-brewlite.vercel.app](https://se-as1-brewlite.vercel.app) |
| 🚀 **Backend API** | Render.com (Singapore) | ![Live](https://img.shields.io/badge/ACTIVE-00B0FF?style=flat-square&logo=render&logoColor=white) | [https://brewlite-backend.onrender.com](https://brewlite-backend.onrender.com) |
| 📖 **Tài Liệu Swagger** | OpenAPI 3.0 Interactive | ![Docs](https://img.shields.io/badge/DOCS_200_OK-FF6D00?style=flat-square&logo=swagger&logoColor=white) | [https://brewlite-backend.onrender.com/docs](https://brewlite-backend.onrender.com/docs) |
| 🗄️ **Database Cloud** | Neon.tech (PostgreSQL 16) | ![Active](https://img.shields.io/badge/POOLER_ONLINE-7C4DFF?style=flat-square&logo=postgresql&logoColor=white) | `ap-southeast-1.aws.neon.tech` |
| 🛡️ **CI/CD Quality** | GitHub Actions | ![Passed](https://img.shields.io/badge/52_PRs_MERGED-304FFE?style=flat-square&logo=githubactions&logoColor=white) | [Longcodepro/.../pulls](https://github.com/Longcodepro/Project_SE_Assignment01_HK1_2026_2027/pulls?q=is%3Apr+is%3Amerged) |

</div>

---

## 📑 Mục Lục
- [✨ Tính Năng Công Nghệ Nổi Bật](#-1-tính-năng-công-nghệ-nổi-bật)
- [💻 Công Nghệ Sử Dụng (Tech Stack)](#-2-công-nghệ-sử-dụng-tech-stack)
- [📁 Cấu Trúc Thư Mục Dự Án](#-3-cấu-trúc-thư-mục-dự-án)
- [⚙️ Cẩm Nang Vận Hành (4 Kịch Bản)](#️-4-cẩm-nang-vận-hành-4-kịch-bản-triển-khai)
- [💡 Kho Kinh Nghiệm Thực Chiến & Khắc Phục Lỗi (Troubleshooting)](#-5-kho-kinh-nghiệm-thực-chiến--khắc-phục-lỗi-troubleshooting)
- [🎬 Kịch Bản Demo Nghiệm Thu 5 Bước](#-6-kịch-bản-demo-nghiệm-thu-5-bước)
- [👥 Đội Ngũ Thực Hiện & Tài Liệu Kèm Theo](#-7-đội-ngũ-thực-hiện--tài-liệu-kèm-theo)

---

## ✨ 1. Tính Năng Công Nghệ Nổi Bật

Hệ thống được thiết kế theo tiêu chuẩn công nghiệp với logic nghiệp vụ chặt chẽ:

| Biểu Tượng | Tính Năng | Mô Tả Kỹ Thuật |
|:---:|:---|:---|
| 🛒 | **Menu & Tùy Biến Đồ Uống** | Giao diện hiển thị danh mục món với hình ảnh SVG sắc nét. Modal tương tác cho phép chọn Kích cỡ (S: +0đ, M: +5.000đ, L: +10.000đ) và Topping (Trân châu: 8.000đ, Kem cheese: 10.000đ, Thạch cafe: 6.000đ). |
| 🧮 | **Tính Giá Độc Quyền Tại Server** | Client **tuyệt đối không gửi giá tiền**. Backend tự động tính tổng tiền: $\sum \text{quantity} \times (\text{giá gốc} + \text{phụ thu size} + \text{giá topping})$ nhằm loại bỏ hoàn toàn nguy cơ gian lận giá từ phía người dùng. |
| 🔐 | **Xác Thực JWT & Mã Hóa Bcrypt** | Đăng ký/Đăng nhập người dùng an toàn. Mật khẩu được băm (hash) bằng thư viện `bcryptjs` với salt rounds = 10. Cấp phát stateless JWT Bearer Token đính kèm tự động qua Axios Interceptors. |
| 🚦 | **Máy Trạng Thái Đơn Hàng (State Machine)** | Quản lý nghiêm ngặt chu trình đơn: `PENDING → PAID` hoặc `PENDING → PAYMENT_FAILED`. Đơn thanh toán thất bại được phép thanh toán lại (`PAYMENT_FAILED → PAID`). Đơn `PAID` là trạng thái cuối, chặn mọi hành vi can thiệp trái phép. |
| 🛡️ | **Chống Gửi Trùng Lặp (Idempotency)** | Header `Idempotency-Key` (tiêu chuẩn IETF) được gửi kèm trong `POST /orders` và `POST /payments`. Ngăn chặn hoàn toàn việc khách hàng bị trừ tiền 2 lần khi bấm nút liên tục hoặc mạng chập chờn. |
| 🔒 | **Khóa Lạc Quan (Optimistic Locking)** | Cột `version` trong bảng `Order` kiểm soát phiên giao dịch. Khi có 2 tiến trình đồng thời cập nhật một đơn hàng, hệ thống từ chối cập nhật xung đột và trả về mã lỗi `409 Conflict`. |
| 🎁 | **Tích Điểm Khách Hàng (Loyalty Rewards)** | Tự động cộng 1 điểm thưởng thành viên cho mỗi 1.000 VNĐ chi tiêu thành công ngay khi giao dịch thanh toán hoàn tất. |
| 📡 | **Cấu Hình Máy Chủ Động (Dynamic API Switcher)** | Nút icon **Server (cột sóng)** trên thanh menu cho phép đổi địa chỉ Backend API linh hoạt (lưu trong `localStorage`), hỗ trợ kiểm tra kết nối với nút **Ping test** tức thì. |
| 📝 | **Ghi Log HTTP Trực Quan (Realtime Console Logger)** | Middleware in log chi tiết từng request (`METHOD`, `URL`, `STATUS`, `RESPONSE_TIME`) ra terminal giúp việc theo dõi và gỡ lỗi cực kỳ trực quan. |

---

## 💻 2. Công Nghệ Sử Dụng (Tech Stack)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   BREWLITE TECH STACK                                  │
├─────────────────┬───────────────────────────────┬──────────────────────────────────────┤
│ PHÂN TẦNG       │ CÔNG NGHỆ CHÍNH               │ VAI TRÒ & ƯU ĐIỂM NỔI BẬT            │
├─────────────────┼───────────────────────────────┼──────────────────────────────────────┤
│ 🌐 Frontend     │ Next.js 16 (React 19)         │ App Router, Turbopack, SSR/SSG       │
│ 🎨 Giao diện    │ Tailwind CSS + Lucide Icons   │ Mobile-first Responsive, Dark Mode   │
│ 📦 Quản lý State│ Zustand                       │ Lưu giỏ hàng, đồng bộ localStorage   │
│ 🔌 Giao tiếp API│ Axios Interceptor             │ Tự động gắn Bearer Token và xử lý 429│
│ 🚀 Backend API  │ NestJS 12 (TypeScript ESM)    │ Dependency Injection, Module hóa cao │
│ 💎 ORM          │ Prisma 7 (@prisma/adapter-pg) │ Type-safe Client, Migration tự động  │
│ 🗄️ Database     │ PostgreSQL 16                 │ RDBMS chuẩn ACID, Connection Pooling │
│ 🐳 Container    │ Docker & Docker Compose       │ Đóng gói multi-stage cô lập môi trường│
│ ☁️ Cloud Deploy │ Vercel + Render + Neon.tech   │ 100% Cloud miễn phí, uptime 24/7     │
│ 🔄 CI/CD        │ GitHub Actions                │ Tự động Lint, Build, Test 52 PRs     │
└─────────────────┴───────────────────────────────┴──────────────────────────────────────┘
```

---

## 📁 3. Cấu Trúc Thư Mục Dự Án

```text
Project_SE_Assignment01_HK1_2026_2027/
├── 🌐 frontend/                     # Ứng dụng Next.js 16 (Client)
│   ├── src/app/                     # Next.js App Router (Menu, Giỏ hàng, Thanh toán, Đơn hàng)
│   ├── src/components/              # Navbar, AuthModal, ProductDetailModal, ServerConfigModal
│   ├── src/services/api.ts          # Axios client, cấu hình URL động, Ping test
│   ├── src/store/                   # Quản lý State bằng Zustand (useCartStore, useAuthStore)
│   └── Dockerfile                   # Đóng gói Frontend container (Node 22 Alpine)
│
├── 🚀 backend/                      # Máy chủ API NestJS 12 (Server)
│   ├── src/auth/                    # Module đăng ký, đăng nhập, JWT Guard, băm bcrypt
│   ├── src/orders/                  # Module tạo đơn, State Machine, Khóa lạc quan, tính giá
│   ├── src/payments/                # Module thanh toán Ví/Thẻ, chống gửi trùng, tích điểm
│   ├── src/products/                # Module danh mục sản phẩm, hình ảnh
│   ├── src/main.ts                  # Khởi chạy ứng dụng, HTTP Logger, CORS đa nguồn
│   ├── prisma/                      # Schema định nghĩa bảng và 7 bản migrations
│   └── Dockerfile                   # Đóng gói Backend container (Node 22 Alpine)
│
├── 📖 docs/                         # Thư mục tài liệu dự án tinh gọn
│   ├── HUONG-DAN-TRIEN-KHAI-VA-CHAY.md # Cẩm nang vận hành 4 kịch bản & kinh nghiệm gỡ lỗi
│   ├── NHAT-KY-COMMIT.md            # Toàn bộ lịch sử commit tiếng Việt có dấu
│   ├── NHAT-KY-TIEN-DO.md           # Tổng kết tiến độ 3 Sprint và danh sách 52 PRs
│   ├── TienDoCongViec.pdf           # Báo cáo tiến độ học thuật chính thức (XeLaTeX 14 trang)
│   └── TienDoCongViec.tex           # Mã nguồn LaTeX gốc
│
├── 📜 scripts/                      # Bộ công cụ tự động hóa
│   ├── logs.sh                      # Xem log HTTP request thời gian thực từ Docker
│   ├── start-tunnel.sh              # Khởi chạy Cloudflare Tunnel qua giao thức HTTP/2
│   └── studio-cloud.sh              # Mở Prisma Studio kết nối Database Cloud Neon
│
├── .github/workflows/               # CI/CD Workflows (Backend, Frontend, Docker, CD Image)
├── docker-compose.yml               # Cấu hình cụm dịch vụ cục bộ (Cổng 4000, 4001, 4002)
└── README.md                        # Cẩm nang toàn tập dự án
```

---

## ⚙️ 4. Cẩm Nang Vận Hành (4 Kịch Bản Triển Khai)

### 🔹 Kịch Bản 1: Chạy 1-Chạm Bằng Docker Compose (Chuẩn Chấm Thi / Offline)
*Phù hợp nhất khi chấm bài hoặc bảo vệ đồ án tại trường, độc lập hoàn toàn với Internet.*

```bash
# 1. Khởi động toàn bộ cụm Container (DB + Backend + Frontend)
docker compose up --build -d

# 2. Theo dõi log HTTP request thời gian thực
./scripts/logs.sh
# hoặc: npm run logs
```

**Bảng Cổng Truy Cập:**
- 🌐 **Frontend:** [http://localhost:4001](http://localhost:4001)
- 🚀 **Backend API:** [http://localhost:4000](http://localhost:4000)
- 📖 **Swagger UI:** [http://localhost:4000/docs](http://localhost:4000/docs)
- 🗄️ **PostgreSQL:** `localhost:4002` (user: `brewlite`, pass: `change_me`)
- 🛑 **Dừng dịch vụ:** `docker compose down -v`

---

### 🔹 Kịch Bản 2: Phát Triển Cục Bộ (Local Dev với Hot-Reload)
*Dành cho lập trình viên muốn sửa code và kiểm tra kết quả ngay lập tức.*

```bash
# 1. Bật database PostgreSQL chạy nền
docker compose up db -d

# 2. Chạy Backend (Terminal 1)
cd backend
npm install
npx prisma migrate dev
npm run start:dev

# 3. Chạy Frontend (Terminal 2)
cd frontend
npm install
npm run dev
```

---

### 🔹 Kịch Bản 3: Mô Hình Hybrid Tunnel (Laptop + Cloudflare Tunnel)
*Chạy hệ thống trên laptop, chia sẻ link HTTPS ra ngoài cho **điện thoại di động** hoặc máy tính khác cùng vào đặt món.*

```bash
# 1. Khởi động Docker local
docker compose up -d

# 2. Bật tunnel ra Internet (sử dụng giao thức HTTP/2 chống chặn cổng)
./scripts/start-tunnel.sh
```
Terminal sẽ in ra một đường link công khai dạng `https://xxxx.trycloudflare.com`.  
**Cách kết nối trên điện thoại:**
1. Mở web Vercel: [https://se-as1-brewlite.vercel.app](https://se-as1-brewlite.vercel.app).
2. Bấm nút **Server (icon cột sóng)** trên thanh menu.
3. Dán link Tunnel vào -> Bấm **Ping test** -> Bấm **Lưu cấu hình**. Mọi thao tác trên điện thoại sẽ gọi trực tiếp về máy tính của bạn!

---

### 🔹 Kịch Bản 4: Chạy 100% Trên Đám Mây (Production 24/7 Miễn Phí)
*Dành cho nộp bài trực tuyến để thầy cô bấm vào chấm bất kỳ lúc nào mà bạn **không cần mở máy tính**.*

- 🗄️ **Database:** PostgreSQL trên [Neon.tech](https://neon.tech) (Singapore).
- 🚀 **Backend:** Node Web Service trên [Render.com](https://render.com) (Singapore).
  - *Build Command:* `npm install --include=dev && npx prisma generate && npm run build`
  - *Start Command:* `npx prisma migrate deploy && npx prisma db seed && npm run start:prod`
  - *Environment Variables:* `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV=production`.
- 🌐 **Frontend:** Next.js trên [Vercel](https://vercel.com) (`se-as1-brewlite`).
  - *Environment Variable:* `NEXT_PUBLIC_API_URL=https://brewlite-backend.onrender.com`.
- 📊 **Quản lý dữ liệu:** Chạy `./scripts/studio-cloud.sh` để mở Prisma Studio tại `http://localhost:5555`.

---

## 💡 5. Kho Kinh Nghiệm Thực Chiến & Khắc Phục Lỗi (Troubleshooting)

> [!IMPORTANT]
> **1. Lỗi `sh: 1: nest: not found` khi build trên Render**  
> • **Nguyên nhân:** Biến `NODE_ENV=production` khiến lệnh `npm install` tự động bỏ qua các gói `devDependencies` (bao gồm `@nestjs/cli`), làm lệnh `nest build` thất bại.  
> • **Cách sửa:** Thêm cờ `--include=dev` trong Build Command:  
> `npm install --include=dev && npx prisma generate && npm run build`

> [!TIP]
> **2. Cơ chế Next.js đóng gói cứng biến `NEXT_PUBLIC_*` lúc build**  
> • **Nguyên nhân:** Next.js nhúng chết giá trị biến môi trường vào bundle JS tại thời điểm `next build`. Sửa biến trong Vercel Settings không tự cập nhật bản build cũ.  
> • **Cách sửa:** Phải vào tab **Deployments** trên Vercel bấm **Redeploy**.  
> • **Giải pháp kiến trúc:** Ứng dụng đã xây dựng nút **Server (cột sóng)** lưu vào `localStorage`, cho phép đổi server tức thì trên giao diện mà không cần chờ Redeploy.

> [!NOTE]
> **3. Render Free Tier tự "ngủ đông" (Cold Start sau 15 phút)**  
> • **Hiện tượng:** Sau 15 phút không có lượt truy cập, server miễn phí của Render sẽ tạm dừng. Lượt gọi đầu tiên sau khi ngủ sẽ mất khoảng 30–50 giây để khởi động lại.  
> • **Mẹo báo cáo:** Trước khi bước lên thuyết trình khoảng 1 phút, hãy mở trước link Swagger [https://brewlite-backend.onrender.com/docs](https://brewlite-backend.onrender.com/docs) một lần để đánh thức server dậy sẵn.

> [!WARNING]
> **4. Render yêu cầu thẻ thanh toán để xác minh danh tính**  
> • **Bản chất:** Chính sách chống tài khoản ảo đối với IP Việt Nam. Render chỉ thực hiện tạm giữ 1 USD (authorization hold) và **hoàn lại ngay lập tức**, hoàn toàn không thu phí của gói Free.

> [!TIP]
> **5. Cấu hình CORS mở rộng cho các tên miền Vercel Preview**  
> • Trong `backend/src/main.ts`, cấu hình CORS kiểm tra quy tắc `origin.endsWith('.vercel.app')`. Nhờ đó, mọi link preview sinh ra từ các Pull Request của Vercel đều tự động gọi được Backend mà không bị lỗi chặn Origin.

> [!NOTE]
> **6. Lỗi chữ tàng hình trong Dark Mode**  
> • Thêm lớp CSS tường minh `text-gray-900 placeholder:text-gray-400` cho toàn bộ các thẻ `<input>` trên nền sáng để tránh bị hệ điều hành ép màu chữ trắng khi người dùng bật Dark Mode.

---

## 🎬 6. Kịch Bản Demo Nghiệm Thu 5 Bước

- [x] **Bước 1 — Xem Menu & Kiểm Tra Swagger API:**
  - Mở web [https://se-as1-brewlite.vercel.app](https://se-as1-brewlite.vercel.app).
  - Kiểm tra danh mục 6 món nước hiển thị đầy đủ hình ảnh, tên và giá tiền.
  - Mở tab [Swagger UI](https://brewlite-backend.onrender.com/docs) kiểm tra endpoint `GET /products`.
- [x] **Bước 2 — Đăng Ký & Đăng Nhập:**
  - Bấm nút **Đăng nhập** -> Chuyển sang tab **Đăng ký**, tạo tài khoản mới.
  - Mật khẩu được băm bằng `bcryptjs`, lưu vào Database và cấp phát `accessToken` JWT.
- [x] **Bước 3 — Tùy Chọn Món & Giỏ Hàng:**
  - Bấm vào món "Bạc xỉu" (giá gốc 32.000đ) -> Chọn Size L (+10.000đ) và Topping "Kem cheese" (+10.000đ).
  - Kiểm tra giá tạm tính tự cập nhật chính xác: $32.000 + 10.000 + 10.000 = 52.000đ$.
  - Bấm **Thêm vào giỏ hàng**, dữ liệu được lưu bền vững qua `localStorage` (Zustand).
- [x] **Bước 4 — Đặt Hàng Với Giá Tính Tại Server:**
  - Vào Giỏ hàng -> Bấm **Tiến hành thanh toán**.
  - Backend nhận payload món, tự động tính tổng tiền và tạo đơn hàng với trạng thái `PENDING`.
- [x] **Bước 5 — Thanh Toán & Tích Điểm:**
  - Chọn phương thức thanh toán **Thẻ ngân hàng** hoặc **Ví điện tử**.
  - Bấm **Thanh toán ngay**: Hệ thống gửi kèm `Idempotency-Key` trong Header.
  - Đơn hàng chuyển sang trạng thái `PAID`.
  - Khách hàng được tích lũy 1 điểm Loyalty cho mỗi 1.000đ chi tiêu.
  - Chuyển sang trang **Lịch sử đơn hàng** để xem lại hóa đơn đã hoàn tất.

---

## 👥 7. Đội Ngũ Thực Hiện & Tài Liệu Kèm Theo

<div align="center">

| Kỹ Sư | Vai Trò | Trách Nhiệm Chính | GitHub |
|:---:|:---:|:---|:---:|
| **Nguyễn Thành Long** | **Backend Lead<br>Scrum Master<br>DevOps** | • Thiết kế kiến trúc Monorepo & Docker Compose<br>• Xây dựng toàn bộ REST API NestJS 12 & Prisma 7<br>• Hiện thực State Machine, Idempotency, Lock, Loyalty<br>• Thiết lập CI/CD GitHub Actions & Triển khai Cloud<br>• Soạn thảo báo cáo tiến độ XeLaTeX 14 trang | [@Longcodepro](https://github.com/Longcodepro) |
| **Trần Tấn Tài** | **Frontend Lead<br>UI/UX Designer** | • Phát triển ứng dụng Web Next.js 16 (App Router)<br>• Thiết kế giao diện Menu, Modal tùy biến món<br>• Quản trị giỏ hàng bằng Zustand Store<br>• Tối ưu hóa Mobile Responsive & Dark Mode<br>• Xây dựng Modal cấu hình Server động (Ping test) | [@TaiTran263](https://github.com/TaiTran263) |

</div>

### 📚 Tài liệu chi tiết trong thư mục `docs/`:
- 🎓 [**Báo Cáo Bài Tập 1: User Stories & Cấu Trúc Dự Án (XeLaTeX PDF)**](file:///home/long/Documents/University/HOCTAP/HK7/Sofware Engineering (SE)/DoAn/Project_SE_Assignment01_HK1_2026_2027/docs/BaoCao_BaiTap1.pdf): Bản báo cáo học thuật 12 trang A4 phân tích 13 User Stories, cấu trúc Monorepo và ưu thế vượt trội (kèm mã nguồn [`BaoCao_BaiTap1.tex`](file:///home/long/Documents/University/HOCTAP/HK7/Sofware Engineering (SE)/DoAn/Project_SE_Assignment01_HK1_2026_2027/docs/BaoCao_BaiTap1.tex)).
- 📈 [**Báo Cáo Tiến Độ Công Việc (XeLaTeX PDF)**](file:///home/long/Documents/University/HOCTAP/HK7/Sofware Engineering (SE)/DoAn/Project_SE_Assignment01_HK1_2026_2027/docs/TienDoCongViec.pdf): Bản báo cáo theo dõi tiến độ đồ án 14 trang A4 (kèm mã nguồn [`TienDoCongViec.tex`](file:///home/long/Documents/University/HOCTAP/HK7/Sofware Engineering (SE)/DoAn/Project_SE_Assignment01_HK1_2026_2027/docs/TienDoCongViec.tex)).
- 📖 [**Cẩm Nang Triển Khai & Vận Hành Chi Tiết**](file:///home/long/Documents/University/HOCTAP/HK7/Sofware Engineering (SE)/DoAn/Project_SE_Assignment01_HK1_2026_2027/docs/HUONG-DAN-TRIEN-KHAI-VA-CHAY.md): Bảng hợp đồng API Contract và hướng dẫn sâu về cấu hình 4 kịch bản.
- 📜 [**Nhật Ký Commit Toàn Diện**](file:///home/long/Documents/University/HOCTAP/HK7/Sofware Engineering (SE)/DoAn/Project_SE_Assignment01_HK1_2026_2027/docs/NHAT-KY-COMMIT.md): Tra cứu hơn 110 commits phân loại theo Sprint chuẩn Conventional Commits.
- 📊 [**Nhật Ký Tiến Độ & 52 Pull Requests**](file:///home/long/Documents/University/HOCTAP/HK7/Sofware Engineering (SE)/DoAn/Project_SE_Assignment01_HK1_2026_2027/docs/NHAT-KY-TIEN-DO.md): Bảng tổng hợp chi tiết 52 PRs và biên bản cải tiến Retrospective.

---

<div align="center">
  <sub>© 2026 BrewLite Engineering Team. Đồ án Công nghệ Phần mềm — Trường Đại học Sài Gòn (SGU).</sub>
</div>
