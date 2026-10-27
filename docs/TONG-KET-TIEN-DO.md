# BÁO CÁO TIẾN ĐỘ VÀ TỔNG KẾT DỰ ÁN BREWLITE
## Đồ án môn Công nghệ Phần mềm (HK1 2026-2027)

- **Đề tài:** Ứng dụng đặt cà phê trực tuyến không dùng tiền mặt (BrewLite)
- **Thành viên nhóm:**
  - **Long (`Longcodepro`):** Phụ trách Backend, Scrum Master
  - **Tài (`TaiTran263`):** Phụ trách Frontend

---

## 1. Tóm tắt kết quả thực hiện

Nhóm gồm 2 người, áp dụng mô hình Scrum chia thành 3 Sprint. Đến thời điểm hiện tại (27/10/2026), nhóm đã hoàn thành toàn bộ các chức năng yêu cầu của **Assignment 1** và hoàn thiện một số phần việc bổ sung để chuẩn bị nộp bài và demo:

- **10 Tasks nghiệp vụ chính thức**: Đều đã hoàn thành và merge vào nhánh `main`.
- **3 Phần việc hoàn thiện thêm sau Sprint 3**: Triển khai CD/Vercel/Tunnel, sửa lỗi giao diện điện thoại (responsive & dark mode), và thêm log request cho backend.
- **Quản lý mã nguồn**: Đã đóng 19 issues và tạo 52 Pull Requests trên GitHub. Tất cả các PR đều chạy qua hệ thống kiểm tra tự động (CI) trước khi merge.
- **Backend**: Đạt 64/64 bài test bằng Vitest, không có lỗi lint (oxlint). Cơ sở dữ liệu PostgreSQL chạy qua Prisma migration ổn định.
- **Frontend**: Xây dựng bằng Next.js 16 (Turbopack), không có lỗi TypeScript hay ESLint. Giao diện chạy được trên cả máy tính lẫn điện thoại.
- **Chạy thử nghiệm**: Hệ thống có thể chạy toàn bộ ở máy cá nhân bằng một lệnh `docker compose up --build`, hoặc mở demo online qua link Vercel kết hợp Cloudflare Tunnel.

---

## 2. Quá trình thực hiện qua các Sprint

### Sprint 1: Dựng khung dự án và hiển thị Menu (21/10 - 26/10)
- **Task 01**: Khởi tạo repo GitHub, dựng khung backend NestJS, frontend Next.js, viết Dockerfile và cài đặt GitHub Actions CI (issue #3, PR #1, #2, #20).
- **Task 02**: Thiết kế cơ sở dữ liệu sản phẩm bằng Prisma, viết API `GET /products`, tạo dữ liệu mẫu và ảnh minh họa SVG cho từng món (issue #4, PR #26).
- **Task 03**: Viết trang Menu hiển thị danh sách cà phê, kết nối API lấy dữ liệu thật từ backend (issue #5, PR #28).

### Sprint 2: Đặt hàng và Đăng nhập (26/10)
- **Task 04**: Làm modal xem chi tiết sản phẩm, cho phép chọn Size (S/M/L) và Topping (trân châu, kem cheese, thạch cafe) với giá tiền chuẩn theo backend (issue #6, PR #30).
- **Task 05**: Làm giỏ hàng bằng Zustand, cho phép thêm món, tăng giảm số lượng, lưu giỏ hàng vào trình duyệt (issue #7, PR #34).
- **Task 06**: Viết API `POST /orders` tạo đơn hàng, server tự tính tổng tiền dựa trên số lượng, size và topping để tránh gian lận giá từ client (issue #8, PR #31).
- **Task 07**: Xây dựng tính năng xác thực: Backend cấp token JWT khi đăng ký/đăng nhập, băm mật khẩu bằng `bcryptjs`; Frontend có modal đăng nhập/đăng ký và chặn người dùng chưa đăng nhập khi thanh toán (issue #9, PR #32, #46).

### Sprint 3: Thanh toán, Lịch sử đơn và Nghiệp vụ nâng cao (26/10 - 27/10)
- **Task 08**: Làm màn hình thanh toán `/checkout` và viết API `POST /payments` mô phỏng Ví/Thẻ ngân hàng (thẻ đuôi 0000 báo lỗi, ví trên 500k báo lỗi) (issue #10, #11, PR #35, #37).
- **Task 09**: Viết API `GET /orders/me` và làm trang `/orders` hiển thị lịch sử đơn của khách hàng; chuẩn hóa lại cổng trong Docker Compose (backend 4000, frontend 4001, database 4002) (issue #12, #13, PR #36, #38).
- **Task 10**: Bổ sung 4 tính năng kỹ thuật nâng cao:
  - Máy trạng thái đơn hàng (Order State Machine): Chặn các bước nhảy trạng thái sai (issue #14, PR #39).
  - Chống gửi trùng (`Idempotency-Key`): Ngăn trừ tiền hay tạo đơn 2 lần khi mạng lag (issue #15, PR #40).
  - Khóa lạc quan (`version`): Tránh xung đột cập nhật đồng thời (issue #16, PR #41).
  - Tích điểm thành viên: Cộng 1 điểm cho mỗi 1.000đ khi thanh toán thành công (issue #17, PR #42).

---

## 3. Các công việc hoàn thiện sau Sprint 3

Sau khi xong 3 Sprint, nhóm tiếp tục xử lý các phần việc phát sinh thực tế:

- **Task 11: Đóng gói CD và triển khai demo Vercel + Cloudflare Tunnel**
  - Viết GitHub Actions CD tự động build và push Docker image backend lên GHCR (issue #18, PR #45).
  - Viết script `scripts/start-tunnel.sh` chạy Cloudflare Tunnel để mở link HTTPS cho backend local, giúp frontend Vercel gọi được API phục vụ demo online.
  - Cập nhật file `README.md` hướng dẫn cài đặt và kịch bản demo (issue #19, PR #43, #44).

- **Task 12: Tối ưu giao diện điện thoại và bổ sung log backend ra terminal**
  - Chỉnh lại CSS responsive trên điện thoại cho 6 màn hình: thu gọn thanh navbar, modal chọn món và modal đăng ký/đăng nhập có giới hạn chiều cao để không bị bàn phím ảo che mất nút (PR #48).
  - Thêm thuộc tính màu chữ `text-gray-900` cho tất cả các ô nhập liệu, xử lý lỗi chữ bị tàng hình màu trắng khi điện thoại bật giao diện tối (Dark mode) (PR #48).
  - Bổ sung middleware in log HTTP request của backend ra terminal để khi frontend gọi API thì terminal hiện rõ method, URL, status code và thời gian phản hồi (PR #49).
  - Viết thêm script `scripts/logs.sh` để tiện xem log container backend khi chạy ngầm.
  - Xây dựng tính năng Cấu hình Server API động ngay trên giao diện web: tạo modal nhập link Cloudflare Tunnel và lưu vào `localStorage`, giúp người dùng test trên điện thoại kết nối ngay lập tức mà không cần cấu hình lại Vercel (PR #52).

- **Task 13: Họp tổng kết Sprint (Retrospective) và chuẩn bị cho Assignment 2**
  - Họp đánh giá lại quá trình làm việc: ghi nhận các điểm làm tốt (CI tự động, viết test kỹ, làm việc bám sát task) và bài học kinh nghiệm (cần thống nhất hợp đồng API sớm để frontend và backend không bị lệch nhau); viết tài liệu `docs/RETROSPECTIVE.md` (PR #47).
  - Đọc đề Assignment 2 và lên danh sách công việc tiếp theo (tách monorepo `apps/web` và `apps/api`, vẽ sơ đồ UML, viết tài liệu kiến trúc ADR).
  - Cập nhật báo cáo tiến độ `docs/TienDoCongViec.tex` và biên dịch ra file PDF nộp môn học.

---

## 4. Kết luận

Nhóm đã hoàn thành trọn vẹn yêu cầu của Assignment 1, đảm bảo tính năng chạy đúng theo kịch bản nghiệp vụ, code được kiểm thử tự động và tài liệu ghi nhận tiến độ rõ ràng. Toàn bộ mã nguồn và tài liệu đã sẵn sàng để tiếp tục phát triển sang Assignment 2.
