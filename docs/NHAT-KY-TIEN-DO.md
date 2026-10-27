# Nhật Ký Tiến Độ Dự Án BrewLite (Assignment 1)

> **Dự án:** Ứng dụng đặt cà phê không tiền mặt BrewLite  
> **Môn học:** Công nghệ phần mềm — Học kỳ 1, Năm học 2026–2027 (Trường Đại học Sài Gòn)  
> **Giảng viên hướng dẫn:** Bộ môn Công nghệ Phần mềm — Khoa Công nghệ Thông tin  
> **Nhóm thực hiện (2 thành viên):**
> - **Nguyễn Thành Long (`Longcodepro`)** — Backend, DevOps, Scrum Master, Tài liệu XeLaTeX
> - **Trần Tấn Tài (`TaiTran263`)** — Frontend UI/UX, Quản trị trạng thái Client (Zustand)

---

## 1. Tổng Kết Tiến Độ 3 Sprint

| Sprint | Thời gian | Mục tiêu chính | Trạng thái | Kết quả bàn giao |
|---|---|---|---|---|
| **Sprint 1** | 21/10 – 25/10/2026 | Khởi tạo dự án, CI/CD, API Sản phẩm, Trang Menu | **Hoàn thành 100%** | Monorepo Next.js + NestJS, CI GitHub Actions, `GET /products`, Swagger `/docs`, Menu web qua Docker |
| **Sprint 2** | 25/10 – 26/10/2026 | Modal chi tiết món, Giỏ hàng, Đăng ký/Đăng nhập JWT | **Hoàn thành 100%** | Giỏ hàng Zustand, mã hóa bcrypt, JWT Bearer Token, `POST /orders` (PENDING) |
| **Sprint 3** | 26/10 – 27/10/2026 | Thanh toán, State Machine, Khóa lạc quan, Chống gửi trùng, Tích điểm & CD | **Hoàn thành 100%** | `POST /payments`, State Machine, `Idempotency-Key`, `version` lock, Tích điểm Loyalty, CD Docker image |
| **Hậu Sprint 3** | 27/10/2026 | Tối ưu Mobile, HTTP Logger, Cloudflare Tunnel, Dynamic Server & 100% Cloud | **Hoàn thành 100%** | Responsive di động, HTTP logger console, nút cấu hình Server động, Deploy trọn gói Vercel + Render + Neon |

---

## 2. Bảng Tổng Hợp 52 Pull Requests Đã Hoàn Thành

Toàn bộ 52 Pull Requests đều được tạo theo quy chuẩn, vượt qua 100% các bài kiểm tra tự động (CI/backend, CI/frontend, CI/docker) và được đồng thuận merge vào nhánh `main`:

| PR # | Tiêu đề Pull Request | Tác giả | Nhánh nguồn | Issue liên kết | Trạng thái |
|---|---|---|---|---|---|
| **#1** | Khởi tạo Next.js, Dockerfile và env.config | Tài | `task1/Tai-setup-frontend` | Issue #1 | ✅ Merged |
| **#2** | Khởi tạo backend NestJS, docker-compose và README | Long | `task1/long-setup-backend` | Issue #1 | ✅ Merged |
| **#20** | Thiết lập CI GitHub Actions (backend, frontend, docker) | Long | `long/ci-github-actions` | Issue #3 | ✅ Merged |
| **#21** | Bổ sung tài liệu yêu cầu và hướng dẫn quy trình issue | Long | `long/docs-tai-lieu` | Docs | ✅ Merged |
| **#22** | Trang Menu gọi API, render món, loading và empty state | Tài | `tai/task3-trang-menu` | Issue #5 | ✅ Merged |
| **#24** | API GET /products với Prisma schema, migration và seed | Long | `long/task-2-api-san-pham` | Issue #4 | ✅ Merged |
| **#26** | Cập nhật kiểu Product hỗ trợ thuộc tính stock tùy chọn | Tài | `tai/fix-product-types` | Fix | ✅ Merged |
| **#27** | Sửa cổng map frontend từ 3000 sang 4001 trong docker-compose | Long | `long/fix-docker-frontend-port` | Fix | ✅ Merged |
| **#28** | Bổ sung Swagger /docs, Postman Collection và ảnh SVG | Long | `long/task-2-api-san-pham` | Issue #4 | ✅ Merged |
| **#29** | Cập nhật báo cáo tiến độ LaTeX Task 02, 03 và kết luận Sprint 1 | Long | `long/docs-tai-lieu` | Docs | ✅ Merged |
| **#30** | Giao diện Modal tùy chọn size, topping và tính tổng tiền | Tài | `tai/task-4-chi-tiet-san-pham` | Issue #6 | ✅ Merged |
| **#31** | API POST /orders tạo đơn PENDING, validate class-validator | Long | `long/task-6-api-tao-don-hang` | Issue #8 | ✅ Merged |
| **#32** | Hệ thống Auth: đăng ký, đăng nhập JWT, băm bcrypt, Guard | Long | `long/task-7-dang-ky-dang-nhap-jwt` | Issue #9 | ✅ Merged |
| **#36** | Màn hình lịch sử đơn hàng và điều hướng Client | Tài | `tai/task-9-lich-su-don-hang` | Issue #13 | ✅ Merged |
| **#37** | API POST /payments mô phỏng Ví/Thẻ, cập nhật trạng thái đơn | Long | `long/task-8-api-thanh-toan` | Issue #10 | ✅ Merged |
| **#38** | API GET /orders/me và đồng bộ docker-compose | Long | `long/task-9a-lich-su-don-docker-compose` | Issue #12 | ✅ Merged |
| **#39** | Máy trạng thái Order State Machine, chặn chuyển trạng thái sai | Long | `long/task-10a-chuyen-trang-thai-don-hang` | Issue #14 | ✅ Merged |
| **#40** | Chống gửi trùng lặp Idempotency-Key cho POST /orders và /payments | Long | `long/task-10b-chong-gui-trung` | Issue #15 | ✅ Merged |
| **#41** | Khóa lạc quan (cột version) chống xung đột cập nhật đồng thời | Long | `long/task-10c-khoa-lac-quan` | Issue #16 | ✅ Merged |
| **#42** | Tích điểm thành viên Loyalty khi thanh toán thành công | Long | `long/task-10d-tich-diem` | Issue #17 | ✅ Merged |
| **#43** | Hoàn thiện README và kịch bản demo end-to-end | Long | `long/task-19-hoan-thien-readme` | Issue #19 | ✅ Merged |
| **#44** | Cập nhật báo cáo tiến độ Task 08, 09, 10 và kết luận Sprint 3 | Long | `long/docs-tai-lieu` | Docs | ✅ Merged |
| **#45** | Workflow CD đóng gói backend Docker image và Cloudflare Tunnel | Long | `long/task-18-cd-deploy` | Issue #18 | ✅ Merged |
| **#46** | Giao diện Đăng ký / Đăng nhập và tích hợp xác thực JWT Client | Tài | `tai/task-7-dang-ky-dang-nhap` | Issue #9 | ✅ Merged |
| **#47** | Cập nhật báo cáo Task 07 Frontend và biên dịch PDF hoàn chỉnh | Long | `long/docs-tai-lieu` | Docs | ✅ Merged |
| **#48** | Tối ưu Mobile Responsive và sửa lỗi chữ tàng hình Dark Mode | Tài | `tai/task-7-mobile-responsive` | UI Fix | ✅ Merged |
| **#49** | Tích hợp HTTP Request Logger console và script logs.sh | Long | `long/task-1-backend-http-logger` | Feature | ✅ Merged |
| **#50** | Cập nhật tài liệu tiến độ LaTeX bổ sung các task sau Sprint 3 | Long | `long/docs-tai-lieu` | Docs | ✅ Merged |
| **#51** | Nâng cấp README với badges, sơ đồ luồng dữ liệu và hướng dẫn chạy | Long | `long/task-19-hoan-thien-readme` | Docs | ✅ Merged |
| **#52** | Hỗ trợ cấu hình Backend API động trên giao diện web (localStorage) | Tài | `tai/fix-dynamic-api-url` | Feature | ✅ Merged |
| **#53** | Báo cáo tiến độ bổ sung tính năng cấu hình server và tổng kết 52 PRs | Long | `long/docs-tai-lieu-final` | Docs | ✅ Merged |

*(Các PR trung gian khác bao gồm các bản merge fix conflict, cập nhật tài liệu và kiểm thử tự động).*

---

## 3. Phân Chia Vai Trò & Đóng Góp Của Từng Thành Viên

### 3.1. Nguyễn Thành Long (`Longcodepro`)
- **Vai trò:** Backend Developer, Scrum Master, DevOps Engineer, Tác giả tài liệu XeLaTeX.
- **Khối lượng công việc chính:**
  - Thiết kế kiến trúc tổng thể Monorepo và viết file `docker-compose.yml` chuẩn hóa các cổng (`4000`, `4001`, `4002`).
  - Thiết lập hạ tầng CI/CD trên GitHub Actions tự động kiểm tra cú pháp, build mã nguồn và đóng gói container.
  - Xây dựng toàn bộ hệ thống API Backend trên nền tảng NestJS 12, Prisma ORM 7 và PostgreSQL 16.
  - Hiện thực logic bảo mật: Mã hóa bcryptjs, JWT Guard, xác thực phiên làm việc.
  - Xây dựng các tính năng nâng cao chuyên sâu: Máy trạng thái (State Machine), Chống gửi trùng (`Idempotency-Key`), Khóa lạc quan (`version`), Tích điểm khách hàng thân thiết.
  - Soạn thảo và biên dịch báo cáo đồ án chính thức bằng **XeLaTeX** (`docs/TienDoCongViec.pdf` dày 14 trang A4 chuẩn format học thuật).
  - Triển khai Backend lên Render.com và Database lên Neon PostgreSQL Cloud.

### 3.2. Trần Tấn Tài (`TaiTran263`)
- **Vai trò:** Frontend Developer, Chuyên viên thiết kế giao diện UI/UX.
- **Khối lượng công việc chính:**
  - Khởi tạo và phát triển ứng dụng web trên nền tảng Next.js 16 (App Router) kết hợp Tailwind CSS.
  - Thiết kế giao diện Menu trực quan, phong cách hiện đại với màu sắc thương hiệu cà phê mộc Tây Nguyên.
  - Xây dựng Modal tùy chọn sản phẩm cho phép khách hàng linh hoạt chọn kích cỡ (S/M/L) và topping đi kèm.
  - Quản lý giỏ hàng phía Client bằng thư viện **Zustand** có hỗ trợ đồng bộ dữ liệu vào `localStorage`.
  - Hiện thực giao diện Modal Đăng ký / Đăng nhập, tự động lưu trữ token và đính kèm vào Axios Interceptor.
  - Tối ưu hóa giao diện hiển thị mượt mà trên mọi kích cỡ màn hình di động (Responsive) và xử lý tương thích Dark Mode.
  - Hiện thực Modal cấu hình máy chủ động (Server Config Modal) kèm tính năng Ping test kiểm tra độ trễ mạng.

---

## 4. Biên Bản Cải Tiến Quy Trình (Retrospective)

Qua 3 Sprint làm việc liên tục theo mô hình Agile Scrum, nhóm đã rút ra các bài học thực tiễn quý giá:

### 4.1. Những điểm làm tốt:
- **Tuân thủ quy ước Git chặt chẽ:** 100% commit có dấu, rõ ràng; 100% tính năng được kiểm tra qua PR trước khi merge.
- **Tính tự động hóa cao:** Nhờ có CI GitHub Actions, mọi lỗi cú pháp hay thiếu thư viện đều bị chặn lại ngay từ khâu mở PR, không bao giờ gây lỗi cho nhánh `main`.
- **Hợp đồng API rõ ràng:** Việc thống nhất tài liệu hợp đồng API ngay từ đầu giúp Frontend và Backend có thể phát triển song song mà không bị phụ thuộc vào nhau.

### 4.2. Khó khăn đã gặp và giải pháp khắc phục:
1. **Lỗi mạng khi test trên điện thoại di động:**
   - *Khó khăn:* Next.js nhúng cứng URL API lúc build, khiến điện thoại mở web Vercel bị gọi nhầm vào `localhost:4000` của điện thoại.
   - *Giải pháp:* Xây dựng hàm `getApiUrl()` ưu tiên đọc từ `localStorage`, đồng thời thêm nút **Server** ngay trên thanh Menu để người dùng có thể dán link Cloudflare Tunnel hoặc Render URL bất cứ lúc nào.
2. **Lỗi `nest: not found` khi đưa lên Render Cloud:**
   - *Khó khăn:* Biến `NODE_ENV=production` khiến npm bỏ qua `devDependencies`, làm thiếu `@nestjs/cli` lúc build.
   - *Giải pháp:* Bổ sung cờ `--include=dev` vào lệnh build trên Render, giải quyết dứt điểm sự cố.
3. **Lỗi chữ tàng hình trong Dark Mode:**
   - *Khó khăn:* Các thẻ `<input>` trên nền sáng bị hệ điều hành ép màu chữ trắng khi người dùng bật Dark Mode.
   - *Giải pháp:* Bổ sung lớp CSS rõ ràng `text-gray-900 placeholder:text-gray-400` cho toàn bộ các ô nhập liệu.

---

## 5. Kết Luận & Chuyển Giao Sang Assignment 2

Dự án BrewLite đã hoàn thành trọn vẹn 100% các yêu cầu của **Assignment 1**:
- Cung cấp trải nghiệm đặt hàng mượt mà, hỗ trợ cả môi trường Local Docker lẫn 100% Cloud.
- Hệ thống tài liệu, mã nguồn và lịch sử Git minh bạch, sạch sẽ, chuẩn chỉ.
- Sẵn sàng chuyển giao toàn bộ kiến trúc và kinh nghiệm sang **Assignment 2** (mở rộng SRS, Use-case, Activity/Sequence/Class Diagram và kiến trúc microservices/monorepo hoàn chỉnh).
