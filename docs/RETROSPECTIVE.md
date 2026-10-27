# Biên bản cải tiến Sprint (Sprint Retrospective) — BrewLite

Dự án: **BrewLite — Ứng dụng đặt cà phê không tiền mặt**  
Môn học: **Công nghệ phần mềm** (Học kỳ 1, Năm học 2026–2027)  
Nhóm sinh viên:
- **Nguyễn Thành Long** (Backend Developer, Scrum Master)
- **Trần Vĩnh Tài** (Frontend Developer)

---

## Tổng quan quy trình Scrum của dự án

Nhóm áp dụng mô hình Agile Scrum gồm **3 Sprint** bám sát theo yêu cầu đề bài:
- **Sprint 1 (21/10/2026 – 26/10/2026):** Nền tảng & Hiển thị Menu (Task 01 – 04).
- **Sprint 2 (26/10/2026 – 27/10/2026):** Giỏ hàng, Đặt đơn & Xác thực tài khoản (Task 05 – 07).
- **Sprint 3 (27/10/2026):** Thanh toán, Bàn giao, Nghiệp vụ nâng cao & CD (Task 08 – 10, Task 18, 19).

Biên bản Retrospective này được lập nhằm tổng kết khách quan những điểm làm tốt, các tồn tại, bài học kinh nghiệm và định hướng hoàn thiện cho phiên bản tiếp theo (Assignment 2).

---

## 1. Sprint 1: Nền tảng & Hiển thị Menu (Task 01 – Task 04)

### 1.1. Điều làm tốt (What went well)
- Khởi tạo nhanh chóng bộ khung mã nguồn gồm Frontend ([Next.js 16](https://nextjs.org/)), Backend ([NestJS 12](https://nestjs.com/)) và Cơ sở dữ liệu ([PostgreSQL 16](https://www.postgresql.org/)) chạy nhất quán qua [Docker Compose](https://docs.docker.com/compose/).
- Thiết lập quy trình kiểm thử tự động **GitHub Actions CI** ngay từ ngày đầu (gồm 3 job song song: Backend, Frontend, Docker validation), giúp toàn bộ các Pull Request đều được kiểm tra nghiêm ngặt trước khi merge.
- Thống nhất hợp đồng dữ liệu ban đầu ([`docs/API-CONTRACT.md`](API-CONTRACT.md)) cho endpoint `GET /products`, giúp Tài xây dựng giao diện Menu và Modal chi tiết món song song với quá trình Long làm Backend.

### 1.2. Điều cần cải thiện (What could be improved)
- Quy ước kiểm tra mã nguồn (linting/formatting) giữa hai thành viên chưa đồng nhất hoàn toàn: Backend dùng `oxlint`, Frontend dùng `eslint`, đôi khi phát sinh cảnh báo biến chưa dùng khi merge.
- Việc phân bổ cổng mạng giữa container và máy host ban đầu chưa tách biệt rõ, gây tranh chấp cổng 4000 khi cả Docker và tiến trình local cùng chạy.

### 1.3. Hành động khắc phục (Action Items)
- Bổ sung quy định bắt buộc: Trước khi commit phải chạy `npm run lint && npm run build && npm test` ở local.
- Chuẩn hóa cổng dịch vụ trong `docker-compose.yml`: Backend cổng `4000`, Frontend cổng `4001`, Database cổng `4002`.

---

## 2. Sprint 2: Giỏ hàng, Đặt đơn & Xác thực (Task 05 – Task 07)

### 2.1. Điều làm tốt (What went well)
- Phía Frontend: Xây dựng trải nghiệm chọn món, điều chỉnh size (S/M/L) và topping mượt mà; quản lý trạng thái giỏ hàng bằng Zustand tối ưu, hỗ trợ lưu trữ cục bộ (local persistence) không bị mất khi tải lại trang.
- Phía Backend: Thực hiện toàn bộ công thức tính giá tổng tiền tại máy chủ (`pricing.ts`), chống gian lận giá từ client; mã hóa mật khẩu người dùng an toàn bằng `bcryptjs` và cấp phát JWT token xác thực hợp lệ.

### 2.2. Điều cần cải thiện & Lỗ hổng phân rã Task (Key Learning)
- **Khoảng lệch phân rã Backlog (Requirement Gap):** Trong kế hoạch ban đầu ([`docs/HUONG-DAN-LAM-ISSUE.md`](HUONG-DAN-LAM-ISSUE.md)), nhóm đã tạo cặp task song song cho các tính năng khác (ví dụ `[T8]` BE và `[T8-FE]` FE), nhưng riêng Task 7 chỉ tạo duy nhất Issue `#9 [T7] Đăng ký / Đăng nhập (JWT)` cho Long (Backend) mà **quên tạo Issue `[T7-FE]`** cho Tài.
- **Hệ quả phát sinh:**
  - Tài không nhận được task làm giao diện Auth nên đã hiện thực luồng mua hàng theo dạng *Khách vãng lai (Guest Checkout)*: chọn món $\rightarrow$ giỏ hàng $\rightarrow$ thanh toán thẳng.
  - Phía Backend áp dụng Guard bảo vệ `GET /orders/me`, yêu cầu header `Authorization: Bearer <token>`. Khi Frontend gọi lấy lịch sử đơn, API trả về `401 Unauthorized`.
  - Tài đã xử lý tình thế bằng cách bắt lỗi `try ... catch` và trả dữ liệu giả lập (mock data) để giao diện không bị gián đoạn khi chạy thử.

### 2.3. Hành động khắc phục (Action Items)
- Nhận diện đây là khoản nợ kỹ thuật (*Technical Debt*) xuất phát từ khâu phân rã yêu cầu; thống nhất giữ nguyên luồng demo của Assignment 1 và đưa hạng mục *"Hoàn thiện giao diện Đăng ký / Đăng nhập & gắn Token toàn hệ thống"* thành Task ưu tiên cao nhất trong Sprint 1 của Assignment 2.

---

## 3. Sprint 3: Thanh toán, Bàn giao, Nghiệp vụ nâng cao & CD (Task 08 – Task 10, 18, 19)

### 3.1. Điều làm tốt (What went well)
- Hoàn thành xuất sắc toàn bộ 4 nghiệp vụ nâng cao của Task 10 phía Backend:
  1. **Order State Machine:** Ngăn chặn nhảy trạng thái sai lệch, bảo vệ vòng đời đơn hàng `PENDING` $\rightarrow$ `PAID` / `PAYMENT_FAILED`.
  2. **Chống gửi trùng (Idempotency-Key):** Cache kết quả thanh toán, ngăn chặn trừ tiền hoặc tạo đơn trùng lặp khi người dùng bấm nhiều lần hoặc mạng chập chờn.
  3. **Khóa lạc quan (Optimistic Locking):** Dùng trường `version` trong bảng Order để phát hiện và ngăn chặn tranh chấp cập nhật đồng thời (race condition), trả lỗi `409 Conflict`.
  4. **Tích điểm thành viên (Loyalty):** Tự động cộng 1 điểm cho mỗi 1.000đ khi thanh toán thành công.
- Bộ kiểm thử tự động đạt độ tin cậy tuyệt đối: **64/64 test cases** bằng Vitest vượt qua toàn bộ, 0 cảnh báo lint.
- Triển khai thành công Continuous Deployment (CD) theo mô hình Hybrid:
  - Tự động đóng gói Docker image Backend lên GitHub Container Registry (GHCR) qua GitHub Actions.
  - Thiết lập đường hầm HTTPS an toàn ra Internet bằng [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/) thông qua script tự động [`scripts/start-tunnel.sh`](../scripts/start-tunnel.sh), cho phép ứng dụng Frontend deploy trên Vercel gọi thẳng API Backend dưới máy local.
- Tài liệu hóa hoàn chỉnh: [`README.md`](../README.md) có hướng dẫn chi tiết kịch bản demo end-to-end 10 bước; Báo cáo tiến độ phân công công việc chi tiết bằng LaTeX [`docs/TienDoCongViec.pdf`](TienDoCongViec.pdf).

### 3.2. Điều cần cải thiện (What could be improved)
- Khởi tạo Cloudflare Tunnel ban đầu bị ngắt kết nối do giao thức mặc định QUIC (UDP cổng 7844) bị một số nhà mạng chặn; nhóm đã xử lý bằng cách bổ sung tùy chọn bắt buộc `--protocol http2` (TCP cổng 443).
- Cần tuân thủ chặt chẽ nguyên tắc không commit trực tiếp vào nhánh `main`, mọi thay đổi phải qua PR để bảo toàn lịch sử kiểm thử CI.

---

## 4. Kế hoạch bàn giao & Backlog chuyển giao cho Assignment 2

### 4.1. Kết quả bàn giao Assignment 1
- Toàn bộ 10/10 nhiệm vụ (Task 01 – Task 10) đã hoàn thành và đạt tiêu chí Definition of Done (DoD).
- 45 Pull Request được review chéo và merge vào nhánh `main`.
- 100% tài liệu kỹ thuật, hợp đồng API và báo cáo tiến độ bằng văn bản đã được hoàn tất.

### 4.2. Product Backlog chuyển giao cho Assignment 2
1. **[Auth FE]** Xây dựng Modal / Trang Đăng nhập & Đăng ký tài khoản trên Next.js; lưu trữ Access Token và tự động đính kèm vào header `Authorization: Bearer <token>` cho mọi request tạo đơn và xem lịch sử.
2. **[Monorepo Architecture]** Tái cấu trúc dự án sang Monorepo chuẩn (Turborepo / pnpm workspace) với cấu trúc `apps/web`, `apps/api`, `packages/types`, `docs/requirements`, `docs/diagrams`, `docs/architecture`.
3. **[Software Architecture & Diagrams]** Biên soạn tài liệu phân tích thiết kế phần mềm chi tiết theo đề bài Assignment 2:
   - Đặc tả yêu cầu phần mềm (**SRS**).
   - Bản vẽ sơ đồ phân tích và thiết kế (**Use-case, Activity, Sequence, Class Diagram**) bằng PlantUML.
   - Tài liệu kiến trúc và Quyết định kiến trúc (**Architecture Decision Records - ADR**).
   - Ma trận truy vết yêu cầu (**Traceability Matrix**).
