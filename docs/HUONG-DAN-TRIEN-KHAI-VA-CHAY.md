# Cẩm Nang Triển Khai & Vận Hành BrewLite (Mọi Trường Hợp)

> **Mục đích tài liệu:** Lưu trữ toàn bộ hướng dẫn vận hành, kịch bản triển khai và kinh nghiệm thực chiến đúc kết qua 3 Sprint đồ án Công nghệ phần mềm (Assignment 1, HK1 2026-2027). Đảm bảo bất kỳ ai khi đọc lại tài liệu này đều có thể tự tay chạy và triển khai hệ thống thành công ngay lập tức.

---

## 1. Tổng Quan Kiến Trúc Hệ Thống

BrewLite là ứng dụng đặt cà phê trực tuyến không tiền mặt, bao gồm 3 thành phần chính:

```
[ Frontend: Next.js 16 (Zustand + Axios) ]
                    │
                    ▼ (REST API / JSON / JWT)
[ Backend: NestJS 12 (Prisma 7 + Swagger + Logger) ]
                    │
                    ▼ (TCP / Connection Pooling)
[ Database: PostgreSQL 16 ]
```

- **Quy tắc nghiệp vụ cốt lõi:**
  - **Bảo mật:** Mật khẩu mã hóa bằng `bcryptjs`. Xác thực người dùng qua JWT Bearer Token (`/auth/login`, `/auth/register`).
  - **Tính giá tập trung tại Server:** Client không gửi giá; Server tự tính tổng tiền dựa trên công thức: $\sum \text{quantity} \times (\text{giá gốc} + \text{phụ thu size} + \text{giá topping})$.
  - **Bảng giá:** Size S (+0đ), Size M (+5.000đ), Size L (+10.000đ). Topping: Trân châu (8.000đ), Kem cheese (10.000đ), Thạch cafe (6.000đ).
  - **State Machine đơn hàng:** `PENDING → PAID | PAYMENT_FAILED`. Đơn thanh toán thất bại được phép thanh toán lại (`PAYMENT_FAILED → PAID`). Trạng thái cuối là `PAID`.
  - **Chống gửi trùng (Idempotency):** Header `Idempotency-Key` ở `POST /orders` và `POST /payments` ngăn chặn việc thanh toán hoặc tạo đơn trùng lặp khi mạng chập chờn.
  - **Khóa lạc quan (Optimistic Locking):** Cột `version` trong bảng `Order` chống xung đột cập nhật đồng thời.
  - **Tích điểm Loyalty:** Thanh toán thành công tích 1 điểm cho mỗi 1.000 VNĐ.

---

## 2. Kịch Bản 1: Chạy 100% Local Bằng Docker Compose (Chuẩn Chấm Offline)

Đây là cách chạy ổn định nhất, độc lập hoàn toàn với internet bên ngoài, phù hợp khi bảo vệ đồ án hoặc chấm bài trực tiếp tại phòng lab trường.

### 2.1. Yêu cầu môi trường
- Máy đã cài **Docker** và **Docker Compose** (phiên bản v2 trở lên).

### 2.2. Câu lệnh thực thi (1 chạm)
Mở terminal tại thư mục gốc của dự án:

```bash
# Khởi động toàn bộ cụm Container (DB + Backend + Frontend)
docker compose up --build -d
```

### 2.3. Cổng dịch vụ & Địa chỉ truy cập
| Thành phần | Cổng Host | Địa chỉ truy cập | Ghi chú |
|---|---|---|---|
| **Frontend** | `4001` | [http://localhost:4001](http://localhost:4001) | Giao diện Next.js, đặt món, giỏ hàng |
| **Backend API** | `4000` | [http://localhost:4000](http://localhost:4000) | NestJS REST API |
| **Tài liệu Swagger** | `4000` | [http://localhost:4000/docs](http://localhost:4000/docs) | Tra cứu và test trực tiếp các API |
| **Database** | `4002` | `localhost:4002` | PostgreSQL 16 (user: `brewlite`, pass: `change_me`) |

### 2.4. Theo dõi HTTP Request Logger thời gian thực
Hệ thống tích hợp sẵn script theo dõi log HTTP trực tiếp từ container Backend:

```bash
# Xem log request thời gian thực (in rõ METHOD, ROUTE, STATUS CODE, RESPONSE TIME)
npm run logs
# hoặc chạy trực tiếp file script:
./scripts/logs.sh
```

### 2.5. Dừng và dọn dẹp hệ thống
```bash
# Tắt container và xóa volume dữ liệu tạm
docker compose down -v
```

---

## 3. Kịch Bản 2: Chạy Phát Triển Cục Bộ (Local Dev Không Dùng Docker)

Phù hợp cho lập trình viên muốn sửa code nhanh (Hot Reload) mà không cần build lại container.

### 3.1. Bước 1: Khởi động Database PostgreSQL
Có thể tận dụng container DB từ docker-compose hoặc cài PostgreSQL cục bộ:
```bash
docker compose up db -d
```

### 3.2. Bước 2: Chạy Backend NestJS
```bash
cd backend
npm install
# Tạo migration và nạp menu mẫu vào database
npx prisma migrate dev
# Chạy ở chế độ watch hot-reload
npm run start:dev
```
Backend lắng nghe tại `http://localhost:4000`.

### 3.3. Bước 3: Chạy Frontend Next.js
Mở một tab terminal mới:
```bash
cd frontend
npm install
npm run dev
```
Frontend lắng nghe tại `http://localhost:3000` (hoặc cổng hiển thị trên terminal).

---

## 4. Kịch Bản 3: Chạy Mô Hình Hybrid (Local + Cloudflare Tunnel)

Phù hợp khi bạn muốn chạy code trên laptop nhưng muốn dùng **điện thoại di động** hoặc máy tính của người khác trong lớp cùng vào trải nghiệm mà không cần cấu hình mở cổng modem (Port Forwarding).

```
[ Điện thoại di động / Máy khác ] 
              │
              ▼ (HTTPS Internet)
[ Cloudflare Tunnel: https://...trycloudflare.com ]
              │
              ▼ (Nối vào máy tính cá nhân)
[ Backend Docker: localhost:4000 ]
```

### 4.1. Các bước thực hiện
1. **Khởi động hệ thống local:**
   ```bash
   docker compose up -d
   ```
2. **Khởi chạy Cloudflare Tunnel:**
   ```bash
   ./scripts/start-tunnel.sh
   ```
   *(Script sẽ tự động tải binary `cloudflared` nếu chưa có và chạy với giao thức `--protocol http2` để vượt qua tường lửa/nhà mạng bóp băng thông).*
3. Terminal sẽ in ra một đường link công khai dạng:
   ```text
   https://xxxx-xxxx-xxxx.trycloudflare.com
   ```
4. **Kết nối trên thiết bị di động:**
   - Mở trình duyệt trên điện thoại truy cập web Vercel: [https://se-as1-brewlite.vercel.app](https://se-as1-brewlite.vercel.app).
   - Bấm vào icon **Server (cột sóng)** ở góc phải thanh menu.
   - Dán đường link Tunnel vừa nhận được vào ô URL.
   - Bấm nút **Ping test** -> Hiện báo xanh "Kết nối thành công".
   - Bấm **Lưu cấu hình**.
   - Toàn bộ thao tác trên điện thoại lúc này sẽ gửi dữ liệu trực tiếp về máy tính của bạn!

---

## 5. Kịch Bản 4: Chạy 100% Cloud (Production 24/7 Miễn Phí)

Phù hợp khi nộp bài cho thầy cô bấm vào chấm online bất kỳ lúc nào mà bạn **không cần mở máy tính**.

```
[ Frontend: Vercel ] ────HTTPS────> [ Backend: Render.com ] ────TCP────> [ Database: Neon.tech ]
```

### 5.1. Bước 1: Tạo Database PostgreSQL trên Neon.tech
1. Đăng ký tài khoản miễn phí tại [neon.tech](https://neon.tech) bằng GitHub.
2. Tạo project mới: đặt tên `brewlite-db`, chọn Region **Asia Pacific (Singapore)** (`ap-southeast-1`).
3. Copy chuỗi kết nối (`Connection string`), dạng:
   ```text
   postgresql://neondb_owner:mật_khẩu@ep-xxxx-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   ```

### 5.2. Bước 2: Deploy Backend lên Render.com
1. Đăng ký tài khoản tại [render.com](https://render.com) bằng GitHub.
2. Chọn **New +** -> **Web Service** -> Chọn repo `Longcodepro/Project_SE_Assignment01_HK1_2026_2027`.
3. Điền cấu hình chi tiết:
   - **Language / Runtime:** Chọn **Node** *(Không chọn Docker để build nhanh và nhẹ hơn)*.
   - **Name:** `brewlite-backend`
   - **Region:** `Singapore`
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Build Command:**
     ```bash
     npm install --include=dev && npx prisma generate && npm run build
     ```
   - **Start Command:**
     ```bash
     npx prisma migrate deploy && npx prisma db seed && npm run start:prod
     ```
   - **Instance Type:** Chọn gói **Free ($0/month)**.
4. Thêm các biến môi trường (**Environment Variables**):
   - `DATABASE_URL`: Dán chuỗi kết nối copy từ Neon ở Bước 1.
   - `JWT_SECRET`: Chuỗi bảo mật tùy ý (ví dụ: `brewlite_super_secret_jwt_key_2026`).
   - `NODE_ENV`: `production`
5. Bấm **Create Web Service**. Sau ~2 phút server sẽ báo `Your service is live 🎉` và cung cấp URL công khai dạng:
   ```text
   https://brewlite-backend.onrender.com
   ```

### 5.3. Bước 3: Cấu hình Frontend trên Vercel
1. Vào Dashboard [vercel.com](https://vercel.com) -> chọn dự án `se-as1-brewlite`.
2. Vào **Settings** -> **Environment Variables**:
   - Thêm biến: `NEXT_PUBLIC_API_URL`
   - Giá trị: `https://brewlite-backend.onrender.com`
   - Loại: Chọn **Plaintext** (hoặc nhấn *change the variable to Config*).
   - Chọn đủ 3 môi trường: Production, Preview, Development.
   - Bấm **Save**.
3. Vào tab **Deployments** -> Bấm nút ba chấm `...` ở bản deploy nhánh `main` mới nhất -> chọn **Redeploy**.
4. Sau khi Redeploy xong, web Vercel chính thức kết nối 100% với Backend Cloud!

### 5.4. Bước 4: Xem và quản trị dữ liệu trên Cloud
- **Cách 1 (Web):** Vào trang [neon.tech](https://neon.tech) -> chọn project -> bấm vào mục **Tables** để xem dạng lưới các bảng `User`, `Order`, `Product`, `Payment`.
- **Cách 2 (Prisma Studio Local):** Chạy script có sẵn để mở giao diện quản trị:
  ```bash
  ./scripts/studio-cloud.sh
  ```
  Trình duyệt sẽ tự mở tại `http://localhost:5555`.

---

## 6. Tổng Hợp API Contract Chuẩn

| Endpoint | Method | Header | Mô tả |
|---|---|---|---|
| `/` | `GET` | Không | Health-check máy chủ (`Hello World!`) |
| `/products` | `GET` | Không | Danh sách 6 món đồ uống kèm giá và ảnh |
| `/docs` | `GET` | Không | Giao diện Swagger UI tương tác |
| `/auth/register` | `POST` | Không | Đăng ký tài khoản (`email`, `password`, `name`) |
| `/auth/login` | `POST` | Không | Đăng nhập nhận JWT `accessToken` |
| `/orders` | `POST` | `Authorization: Bearer <token>`, `Idempotency-Key` (tùy chọn) | Tạo đơn hàng (Server tự tính giá) |
| `/orders/me` | `GET` | `Authorization: Bearer <token>` | Lấy lịch sử đơn hàng của người dùng hiện tại |
| `/payments` | `POST` | `Authorization: Bearer <token>`, `Idempotency-Key` (tùy chọn) | Thanh toán mô phỏng Ví/Thẻ, tích điểm Loyalty |

---

## 7. Kinh Nghiệm Thực Chiến & Khắc Phục Sự Cố (Troubleshooting & Gotchas)

### 7.1. Lỗi `sh: 1: nest: not found` khi build trên Render
- **Nguyên nhân:** Khi đặt biến môi trường `NODE_ENV=production`, lệnh `npm install` mặc định tự động bỏ qua toàn bộ gói `devDependencies`. Do đó `@nestjs/cli` không được cài đặt, dẫn đến lệnh `nest build` bị lỗi.
- **Giải pháp:** Trong ô **Build Command**, bắt buộc phải thêm cờ `--include=dev`:
  ```bash
  npm install --include=dev && npx prisma generate && npm run build
  ```

### 7.2. Lỗi Render bắt nhập thông tin thẻ thanh toán dù chọn gói Free
- **Nguyên nhân:** Để chống bot tạo tài khoản ảo đào coin (nhất là dải IP tại Việt Nam), Render kích hoạt cơ chế xác minh thẻ danh tính.
- **Bản chất:** Render chỉ thực hiện giữ tạm thời (authorization hold) 1 USD (~25.000 VNĐ) và **hoàn lại ngay lập tức**, hoàn toàn không thu phí hàng tháng của gói Free.

### 7.3. Biến môi trường Next.js `NEXT_PUBLIC_*` không nhận ngay trên Vercel
- **Nguyên nhân:** Next.js nhúng cứng các biến có tiền tố `NEXT_PUBLIC_*` vào file bundle JavaScript tại thời điểm đóng gói mã nguồn (`next build`). Việc chỉ lưu biến trong Settings không làm thay đổi các file JS đã build trước đó.
- **Giải pháp:** Phải vào tab **Deployments** bấm **Redeploy** thì mã nguồn mới được đóng gói lại với giá trị mới.
- **Giải pháp triệt để:** Ứng dụng đã xây dựng cơ chế **Cấu hình động qua localStorage** (`brewlite_api_url`). Trình duyệt luôn ưu tiên URL trong `localStorage` trước biến môi trường, cho phép người dùng đổi server tức thì ngay trên giao diện mà không cần chờ Redeploy.

### 7.4. Render Free Tier tự "ngủ đông" (Cold Start)
- **Đặc điểm:** Sau 15 phút không có lượt truy cập, Web Service miễn phí của Render sẽ tạm dừng (spin down). Lượt gọi đầu tiên sau khi ngủ sẽ mất từ 30 – 50 giây để khởi động lại.
- **Mẹo báo cáo:** Trước khi bước lên thuyết trình hoặc gửi link cho thầy cô khoảng 1 phút, hãy mở trước link Swagger [https://brewlite-backend.onrender.com/docs](https://brewlite-backend.onrender.com/docs) một lần để "đánh thức" server dậy sẵn.

### 7.5. Xử lý CORS khi Frontend Vercel đổi tên miền hoặc dùng Preview URL
- Trong file `backend/src/main.ts`, cấu hình CORS linh hoạt kiểm tra:
  ```typescript
  if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
    return callback(null, true);
  }
  ```
  Nhờ quy tắc `origin.endsWith('.vercel.app')`, mọi đường link preview của Vercel (kể cả khi tạo nhánh mới) đều được Backend cấp phép truy cập API mà không bao giờ bị lỗi chặn CORS.

### 7.6. Lỗi tương tác TTY khi chạy `prisma migrate dev` trong CI/CD hoặc Docker
- `prisma migrate dev` đòi hỏi terminal tương tác người dùng (TTY). Khi chạy trong Docker hoặc script tự động, lệnh này sẽ bị lỗi.
- **Quy trình chuẩn:** 
  1. Ở máy dev, sinh migration ra file SQL: `npx prisma migrate dev --name <ten>`.
  2. Ở môi trường deploy (Docker, Render, CI): Sử dụng lệnh `npx prisma migrate deploy` kết hợp `npx prisma db seed`. Lệnh này an toàn 100%, không đòi hỏi TTY và tự động đồng bộ schema vào DB.
