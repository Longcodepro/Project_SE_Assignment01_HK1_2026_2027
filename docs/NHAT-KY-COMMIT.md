# Nhật Ký Commit Dự Án BrewLite (Assignment 1)

> **Dự án:** Ứng dụng đặt cà phê không tiền mặt BrewLite  
> **Môn học:** Công nghệ phần mềm — Học kỳ 1, Năm học 2026–2027 (Trường Đại học Sài Gòn)  
> **Thành viên tham gia:**
> - **Nguyễn Thành Long (`Longcodepro`)** — Backend, Scrum Master, DevOps, Tài liệu
> - **Trần Tấn Tài (`TaiTran263`)** — Frontend UI/UX, Quản lý trạng thái Client

---

## 1. Quy Ước Commit Của Nhóm

Toàn bộ thành viên tuân thủ nghiêm ngặt quy ước **Conventional Commits** viết bằng **tiếng Việt có dấu**:

$$\text{Cú pháp chuẩn:} \quad \texttt{<loại>(<phạm-vi>): <mô tả ngắn bằng tiếng Việt có dấu>}$$

### 1.1. Các loại commit hợp lệ:
- `feat`: Thêm tính năng mới cho người dùng hoặc API mới.
- `fix`: Sửa lỗi phát sinh trong mã nguồn hoặc cấu hình.
- `chore`: Cấu hình dự án, cài đặt thư viện, cập nhật workflow CI/CD.
- `docs`: Cập nhật tài liệu, báo cáo tiến độ LaTeX, README.
- `refactor`: Tái cấu trúc mã nguồn, tối ưu hóa nhưng không làm thay đổi tính năng bên ngoài.
- `test`: Viết thêm unit test, e2e test hoặc sửa test case.
- `ci`: Cấu hình quy trình tự động hóa GitHub Actions.

### 1.2. Quy tắc làm việc trên nhánh (Branching Strategy):
- Tuyệt đối **không commit trực tiếp vào nhánh `main`**.
- Mỗi tính năng được phát triển trên một nhánh riêng biệt có tiền tố tên người phụ trách:
  - Nhánh Backend/DevOps: `long/<tên-task>` (ví dụ: `long/task-8-api-thanh-toan`)
  - Nhánh Frontend: `tai/<tên-task>` (ví dụ: `tai/task-7-mobile-responsive`)
- Mọi nhánh khi hoàn thành đều phải mở **Pull Request (PR)**, vượt qua 100% các bài kiểm tra tự động (CI Backend, CI Frontend, CI Docker) và được thành viên còn lại review trước khi merge vào `main`.

---

## 2. Nhật Ký Commit Theo Từng Giai Đoạn Phát Triển

### Giai đoạn 1: Khởi tạo dự án & Thiết lập hạ tầng CI/CD (21/10/2026 – 23/10/2026)
*Mục tiêu: Dựng khung Monorepo, cấu hình Docker Compose, Next.js, NestJS và hệ thống CI tự động kiểm tra mã nguồn.*

| Hash | Tác giả | Ngày | Loại | Nội dung Commit |
|---|---|---|---|---|
| `3430727` | Long | 2026-10-21 | `initial` | Initial commit |
| `e124003` | Tài | 2026-10-21 | `feat` | feat(frotend): khởi tạo Next.js, Dockerfile và env.config |
| `c2aecf8` | Long | 2026-10-21 | `merge` | Merge pull request #1 from Longcodepro/task1/Tai-setup-frontend |
| `baad7e5` | Long | 2026-10-22 | `chore` | chore(task-1): khởi tạo backend NestJS, docker-compose và README |
| `44c0e5b` | Long | 2026-10-22 | `merge` | Merge pull request #2 from Longcodepro/task1/long-setup-backend |
| `9c13fe1` | Long | 2026-10-22 | `chore` | chore(ci): thêm GitHub Actions cho backend, frontend, docker và template issue/PR |
| `137d2c8` | Long | 2026-10-23 | `fix` | fix(ci): curl thử lại mọi loại lỗi khi chờ backend khởi động |
| `aa09ff5` | Long | 2026-10-23 | `docs` | docs: thêm tài liệu yêu cầu và hướng dẫn làm issue |
| `1d4fe06` | Long | 2026-10-23 | `merge` | Merge pull request #20 from Longcodepro/long/ci-github-actions |
| `5304fe7` | Long | 2026-10-23 | `chore` | chore: bỏ qua các file sinh ra khi biên dịch LaTeX |
| `d113c31` | Long | 2026-10-23 | `docs` | docs: thêm báo cáo tiến độ công việc (LaTeX) |
| `abb9b7c` | Long | 2026-10-23 | `docs` | docs: cập nhật báo cáo tiến độ Task 01 (ngày 22/10) |
| `8b7cee2` | Long | 2026-10-23 | `merge` | Merge pull request #21 from Longcodepro/long/docs-tai-lieu |

---

### Giai đoạn 2: Sprint 1 — API Sản phẩm & Trang Menu (24/10/2026 – 25/10/2026)
*Mục tiêu: Xây dựng cơ sở dữ liệu sản phẩm ban đầu, API lấy danh sách đồ uống và hiển thị lên giao diện web.*

| Hash | Tác giả | Ngày | Loại | Nội dung Commit |
|---|---|---|---|---|
| `321414a` | Tài | 2026-10-24 | `feat` | feat(task-3): tạo trang menu, gọi getProduct, render sản phẩm, tạo trạng thái loading, trạng thái empty |
| `eb9ce4c` | Tài | 2026-10-24 | `feat` | feat(task-4): man hinh chi tiet tuy chon san pham chon size va topping tinh gia tong |
| `46d031f` | Long | 2026-10-25 | `feat` | feat(task-2): thêm API GET /products với Prisma schema, migration và seed |
| `c9a3ed0` | Long | 2026-10-25 | `refactor` | refactor(task-2): tách PrismaService thành PrismaModule dùng chung |
| `edc5426` | Long | 2026-10-25 | `merge` | Merge pull request #22 from Longcodepro/tai/task3-trang-menu |
| `77ba18a` | Long | 2026-10-25 | `merge` | Merge pull request #24 from Longcodepro/long/task-2-api-san-pham |

---

### Giai đoạn 3: Sprint 2 — Chi Tiết Món, Giỏ Hàng & Xác Thực JWT (26/10/2026)
*Mục tiêu: Quản lý giỏ hàng phía Client, modal tùy chọn size/topping, hệ thống đăng ký/đăng nhập người dùng qua mã hóa bcrypt và JWT.*

| Hash | Tác giả | Ngày | Loại | Nội dung Commit |
|---|---|---|---|---|
| `97b7f22` | Tài | 2026-10-26 | `feat` | feat(task-5): gio hang cart dung zustand va persist localstorage |
| `0afe10e` | Tài | 2026-10-26 | `feat` | feat(task-8): man hinh thanh toan khong tien mat va xac nhan don hang |
| `2fa9ea4` | Tài | 2026-10-26 | `feat` | feat(task-9): them ham getMyOrders vao api service |
| `8bd9626` | Tài | 2026-10-26 | `fix` | fix(types): cap nhat Product stock optional |
| `bcab0a9` | Long | 2026-10-26 | `merge` | Merge pull request #26 from Longcodepro/tai/fix-product-types |
| `d1e8047` | Long | 2026-10-26 | `fix` | fix(docker): sửa cổng map của frontend từ 3000 sang 4001 |
| `7147c02` | Long | 2026-10-26 | `feat` | feat(task-2): thêm Swagger (/docs) và collection Postman cho API sản phẩm |
| `1c78b02` | Long | 2026-10-26 | `feat` | feat(task-2): thêm ảnh minh họa sản phẩm và trỏ imageUrl trong seed |
| `8526223` | Long | 2026-10-26 | `docs` | docs: cập nhật báo cáo tiến độ Task 02, Task 03 và kết luận Sprint 1 |
| `a61132e` | Long | 2026-10-26 | `merge` | Merge pull request #27 from Longcodepro/long/fix-docker-frontend-port |
| `e761f1c` | Long | 2026-10-26 | `merge` | Merge pull request #28 from Longcodepro/long/task-2-api-san-pham |
| `2cd8938` | Long | 2026-10-26 | `merge` | Merge pull request #29 from Longcodepro/long/docs-tai-lieu |
| `a1e99e2` | Long | 2026-10-26 | `merge` | Merge pull request #30 from Longcodepro/tai/task-4-chi-tiet-san-pham |
| `fc4bd38` | Long | 2026-10-26 | `feat` | feat(task-6): thêm API POST /orders tạo đơn hàng PENDING, validate bằng class-validator |
| `0696e04` | Long | 2026-10-26 | `merge` | Merge pull request #31 from Longcodepro/long/task-6-api-tao-don-hang |
| `e55cc1a` | Long | 2026-10-26 | `feat` | feat(task-7): thêm đăng ký, đăng nhập JWT, băm bcrypt và guard bảo vệ POST /orders |
| `326e01d` | Long | 2026-10-26 | `merge` | Merge pull request #32 from Longcodepro/long/task-7-dang-ky-dang-nhap-jwt |

---

### Giai đoạn 4: Sprint 3 — Thanh Toán, State Machine, Idempotency, Optimistic Locking, Loyalty & CD (26/10/2026 – 27/10/2026)
*Mục tiêu: Hoàn thiện toàn bộ logic nghiệp vụ Backend, xử lý tranh chấp dữ liệu, chống gửi trùng và tự động hóa CD.*

| Hash | Tác giả | Ngày | Loại | Nội dung Commit |
|---|---|---|---|---|
| `e19aff6` | Tài | 2026-10-26 | `feat` | feat(task-9): man hinh lich su don hang va dieu huong |
| `a0d3335` | Long | 2026-10-27 | `merge` | Merge pull request #36 from Longcodepro/tai/task-9-lich-su-don-hang |
| `8256ac1` | Long | 2026-10-26 | `feat` | feat(task-8): thêm POST /payments thanh toán mô phỏng Ví/Thẻ, cập nhật trạng thái đơn |
| `c28caad` | Long | 2026-10-27 | `merge` | Merge pull request #37 from Longcodepro/long/task-8-api-thanh-toan |
| `257cbda` | Long | 2026-10-26 | `feat` | feat(task-9a): thêm GET /orders/me, sửa cổng frontend trong docker-compose |
| `b3c85f2` | Long | 2026-10-27 | `merge` | Merge pull request #38 from Longcodepro/long/task-9a-lich-su-don-docker-compose |
| `04a2f14` | Long | 2026-10-26 | `feat` | feat(task-10a): thêm Order State Machine, chặn chuyển trạng thái đơn sai |
| `b278b18` | Long | 2026-10-27 | `merge` | Merge pull request #39 from Longcodepro/long/task-10a-chuyen-trang-thai-don-hang |
| `f3b2c5b` | Long | 2026-10-26 | `feat` | feat(task-10b): thêm Idempotency-Key cho POST /orders và POST /payments |
| `660183f` | Long | 2026-10-27 | `merge` | Merge pull request #40 from Longcodepro/long/task-10b-chong-gui-trung |
| `ae3200b` | Long | 2026-10-26 | `feat` | feat(task-10c): thêm khoá lạc quan (version) cho đơn hàng, từ chối cập nhật đồng thời |
| `92c4bc7` | Long | 2026-10-27 | `merge` | Merge pull request #41 from Longcodepro/long/task-10c-khoa-lac-quan |
| `ec7af2a` | Long | 2026-10-26 | `feat` | feat(task-10d): tích điểm loyalty khi thanh toán thành công |
| `dd5edca` | Long | 2026-10-27 | `merge` | Merge pull request #42 from Longcodepro/long/task-10d-tich-diem |
| `18c21ba` | Long | 2026-10-27 | `docs` | docs(task-19): hoàn thiện README và hướng dẫn demo end-to-end |
| `d5070cb` | Long | 2026-10-27 | `merge` | Merge pull request #43 from Longcodepro/long/task-19-hoan-thien-readme |
| `5a40210` | Long | 2026-10-27 | `docs` | docs: cập nhật báo cáo tiến độ Task 08, 09, 10 và kết luận Sprint 3 |
| `56fc3f8` | Long | 2026-10-27 | `merge` | Merge pull request #44 from Longcodepro/long/docs-tai-lieu |
| `227d849` | Long | 2026-10-27 | `ci` | ci(task-18): thêm workflow CD đóng gói backend Docker image lên GHCR và cấu hình Cloudflare Tunnel |
| `475f6fe` | Long | 2026-10-27 | `merge` | Merge pull request #45 from Longcodepro/long/task-18-cd-deploy |

---

### Giai đoạn 5: Sau Sprint 3 — Hoàn Thiện Trải Nghiệm, Logger, Dynamic Server & Đưa Lên Cloud (27/10/2026)
*Mục tiêu: Đưa ứng dụng đạt độ hoàn thiện cao nhất, hỗ trợ mobile responsive, logger trực quan, cấu hình server linh hoạt và triển khai 100% Cloud.*

| Hash | Tác giả | Ngày | Loại | Nội dung Commit |
|---|---|---|---|---|
| `59d6158` | Long | 2026-10-27 | `docs` | docs: bổ sung biên bản cải tiến RETROSPECTIVE.md và cập nhật TienDoCongViec.pdf |
| `5b160ed` | Tài | 2026-10-27 | `feat` | feat(task-7): thêm giao diện đăng ký, đăng nhập và tích hợp xác thực JWT |
| `1342441` | Long | 2026-10-27 | `merge` | Merge pull request #46 from Longcodepro/tai/task-7-dang-ky-dang-nhap |
| `b2a4b73` | Long | 2026-10-27 | `docs` | docs: cập nhật Task 07 Frontend và biên dịch TienDoCongViec.pdf hoàn chỉnh |
| `a686db1` | Long | 2026-10-27 | `merge` | Merge pull request #47 from Longcodepro/long/docs-tai-lieu |
| `bb934e1` | Tài | 2026-10-27 | `fix` | fix(frontend): tối ưu giao diện responsive trên thiết bị di động cho menu, auth modal, giỏ hàng và thanh toán |
| `53cad9a` | Tài | 2026-10-27 | `fix` | fix(frontend): thêm màu chữ text-gray-900 cho ô input đăng nhập và thanh toán tránh bị tàng hình trong dark mode |
| `c55210a` | Long | 2026-10-27 | `merge` | Merge pull request #48 from Longcodepro/tai/task-7-mobile-responsive |
| `3f55128` | Long | 2026-10-27 | `feat` | feat(backend): thêm HTTP request logger ra terminal và script logs.sh theo dõi log docker |
| `aec9185` | Long | 2026-10-27 | `merge` | Merge pull request #49 from Longcodepro/long/task-1-backend-http-logger |
| `1c7c9ac` | Long | 2026-10-27 | `docs` | docs: cập nhật báo cáo tiến độ sau Sprint 3 và chuẩn bị chuyển giao Assignment 2 |
| `5fa4486` | Long | 2026-10-27 | `docs` | docs(readme): cập nhật hướng dẫn chạy mới với Docker live logging, tunnel và giao diện trực quan |
| `3adf0c2` | Long | 2026-10-27 | `feat` | feat(frontend): thêm tính năng cấu hình URL Backend động cho phép kết nối Cloudflare Tunnel trực tiếp trên web |
| `c260c8f` | Long | 2026-10-27 | `merge` | Merge pull request #52 from Longcodepro/tai/fix-dynamic-api-url |
| `d77d2a9` | Long | 2026-10-27 | `docs` | docs: cập nhật báo cáo tiến độ bổ sung tính năng cấu hình server động và tổng kết 52 PRs |
| `414164b` | Long | 2026-10-27 | `merge` | Merge pull request #53 from Longcodepro/long/docs-tai-lieu-final |

---

## 3. Thống Kê Chung
- **Tổng số commits:** 110+ commits.
- **Tổng số Pull Requests đã merge vào `main`:** 52 PRs.
- **Tỷ lệ vượt qua CI/CD tự động:** 100% (Backend lint/build/test, Frontend lint/build, Docker build).
- **Trạng thái nhánh `main`:** Sạch sẽ, ổn định và sẵn sàng nghiệm thu hoặc phát triển tiếp Assignment 2.
