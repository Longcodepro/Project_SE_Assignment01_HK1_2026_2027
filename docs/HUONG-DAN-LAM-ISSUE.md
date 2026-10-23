# Hướng dẫn làm Issue

Mỗi đầu việc của dự án là một **Issue** trên GitHub. Mỗi issue được giao cho một người và thuộc một **Sprint** (Milestone). File này mô tả cách làm một issue từ lúc nhận đến lúc xong.

## 1. Quy trình một issue

```
Nhận issue ──► Tạo nhánh ──► Code ──► Chạy kiểm tra ở máy ──► Commit
                                                                  │
   Issue tự đóng ◄── Merge ◄── Review chéo ◄── CI xanh ◄── Push + mở PR
```

1. Mở issue, đọc **Tiêu chí chấp nhận**. Đó là thứ quyết định "xong".
2. Tạo nhánh riêng từ `main`.
3. Code, tự chạy kiểm tra ở máy (mục 3.3).
4. Commit khi task hoàn thành, push, mở Pull Request (PR) vào `main`.
5. CI tự chạy. Đỏ thì sửa tiếp, xanh thì nhờ người còn lại review.
6. Người kia approve, bạn bấm **Merge pull request**. Issue tự đóng vì PR có dòng `Closes #số-issue`.

## 2. Danh sách issue và thứ tự làm

| # | Issue | Người làm | Nhãn |
|---|---|---|---|
| 3 | [CI] CI bằng GitHub Actions | Long | ci |
| 4 | [T2] API danh sách sản phẩm | Long | backend |
| 5 | [T3] Trang Menu | Tài | frontend |
| 6 | [T4] Chi tiết và tùy chọn sản phẩm | Tài | frontend |
| 7 | [T5] Giỏ hàng | Tài | frontend |
| 8 | [T6] API tạo đơn hàng | Long | backend |
| 9 | [T7] Đăng ký / Đăng nhập (JWT) | Long | backend |
| 10 | [T8] Thanh toán không tiền mặt (backend) | Long | backend |
| 11 | [T8-FE] Màn thanh toán và màn xác nhận đơn | Tài | frontend |
| 12 | [T9a] GET /orders/me và docker-compose chạy cả 3 service | Long | backend |
| 13 | [T9-FE] Màn lịch sử đơn | Tài | frontend |
| 14 | [T10a] Order State Machine | Long | backend |
| 15–17 | [T10b] Idempotency, [T10c] Optimistic locking, [T10d] Loyalty | Long | backend, `could` |
| 18 | [CD] CD khi có server | Long | ci, `could` (để sau) |
| 19 | [T9b] README hoàn chỉnh và demo end-to-end | Cả hai | documentation |

**Theo Sprint:**

| Sprint | Mục tiêu | Issue |
|---|---|---|
| 1 | Mở trình duyệt thấy menu quán, dữ liệu lấy từ API thật | #3, #4, #5 |
| 2 | Chọn món với size và topping, bỏ vào giỏ, đặt đơn thành công | #6, #7, #8, #9 |
| 3 | Thanh toán hoàn tất, chạy được luồng end-to-end, sẵn sàng bàn giao | #10 – #19 |

**Phụ thuộc cần để ý:**
- #9 (JWT) bảo vệ route đặt đơn của #8, nên làm sau #8.
- #10 (thanh toán) cần có đơn hàng từ #8.
- #12 (`GET /orders/me`) cần JWT từ #9 để biết đang là ai.
- #14 (state machine) làm trên đơn hàng của #8 và #10.
- Frontend không phải chờ backend: dùng dữ liệu giả đúng hình dạng trong `docs/API-CONTRACT.md` (mục 6).

## 3. Làm một issue, từng bước

Ví dụ dưới đây là issue #4 (T2) của Long. Issue khác làm tương tự, chỉ đổi tên nhánh và số.

### 3.1 Cập nhật `main` và tạo nhánh

```bash
git checkout main
git pull
git checkout -b long/task-2-api-san-pham
```

Tên nhánh theo quy ước `<tên-người>/task-N-mo-ta-ngan` (không dấu, nối bằng gạch ngang), ví dụ `tai/task-3-trang-menu`. **Không push thẳng vào `main`.**

### 3.2 Code

Chỉ làm những gì issue yêu cầu. Việc mới nảy ra giữa chừng thì ghi thành issue mới, bàn ở buổi Planning sau, đừng làm lẫn vào.

### 3.3 Tự chạy kiểm tra ở máy trước khi push

Đây chính là những gì CI sẽ chạy, nên chạy trước để không bị đỏ.

```bash
# Backend (Long)
cd backend
npm ci
npm run lint
npm run build
npm test

# Frontend (Tài)
cd frontend
npm ci
npm run lint
npm run build

# Cả hệ thống (khi đụng tới Docker hoặc docker-compose.yml)
cp .env.example .env     # nếu chưa có .env
docker compose up --build
curl http://localhost:4000
```

Nhớ: **không commit file `.env`** (đã bị `.gitignore` chặn). Chỉ commit `.env.example`.

### 3.4 Commit

Commit ngay khi task hoàn thành, mỗi task một commit, không gom nhiều task. Định dạng `<loại>(task-N): <mô tả>`, tiếng Việt có dấu. Các loại: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `style`.

```bash
git add backend
git commit -m "feat(task-2): thêm endpoint lấy danh sách sản phẩm"
```

### 3.5 Push và mở Pull Request

```bash
git push -u origin long/task-2-api-san-pham
```

Trên GitHub bấm **Compare & pull request** (hoặc dùng `gh pr create`). Mẫu PR đã có sẵn, hãy điền:

- Mô tả ngắn: làm gì, vì sao.
- Dòng **`Closes #4`** (số issue của task) để merge xong issue tự đóng.
- Tick các mục Definition of Done đã đạt.

### 3.6 CI chạy tự động

Mỗi PR chạy 3 job:

| Job | Kiểm tra | Chạy ở máy bằng |
|---|---|---|
| `backend` | cài thư viện, lint, build, test | các lệnh trong mục 3.3 |
| `frontend` | cài thư viện, lint, build | các lệnh trong mục 3.3 |
| `docker` | build và chạy cả 3 service, gọi thử backend ở cổng 4000 | `docker compose up --build` |

- **Xanh ✓ cả 3:** sang bước review.
- **Đỏ ✗:** bấm **Details** ở job đỏ, đọc dòng lỗi cuối, sửa ở máy rồi `git push` thêm. CI tự chạy lại, không cần mở PR mới.

CI xanh chỉ nghĩa là build được và các test hiện có qua, không có nghĩa là app đúng ý. Bạn vẫn phải tự chạy thử.

### 3.7 Review chéo và merge

- Người **còn lại** đọc code và bấm **Approve** (Long review PR của Tài và ngược lại). Không tự duyệt PR của mình.
- Khi đã approve và CI xanh, người mở PR bấm **Merge pull request**.
- Bấm **Delete branch** sau khi merge.

### 3.8 Sau khi merge

```bash
git checkout main
git pull
```

Rồi bắt đầu issue kế tiếp từ bước 3.1.

## 4. Quy ước tóm tắt

| Hạng mục | Quy ước |
|---|---|
| Nhánh | `<tên-người>/task-N-mo-ta-ngan`, không push thẳng `main` |
| Commit | `<loại>(task-N): <mô tả>`, tiếng Việt có dấu, mỗi task một commit |
| PR | Có `Closes #số-issue`, điền Definition of Done |
| Review | Người kia approve rồi mới merge |
| Sprint | Độ dài cố định, làm không kịp thì cắt bớt task đẩy về Backlog, không kéo dài giờ |
| Việc mới | Không nhận giữa Sprint; ghi thành issue mới, bàn ở buổi Planning kế tiếp |

## 5. Khi bị xung đột code

Xung đột xảy ra khi hai người cùng sửa một chỗ của một file. GitHub **tự phát hiện** và hiện dòng *"This branch has conflicts that must be resolved"* ở PR, nút merge bị khoá. Lúc đó CI thường **không chạy**, vì GitHub không tạo được bản ghép để kiểm tra.

Cách giải quyết ở máy bạn:

```bash
git fetch origin
git merge origin/main          # Git báo file nào bị xung đột
```

1. Mở file bị báo, tìm các dấu `<<<<<<<`, `=======`, `>>>>>>>`.
2. Giữ lại đoạn đúng (có thể gộp cả hai bên), xoá các dấu đó.
3. `git add <file>` rồi `git commit` (giữ thông điệp mặc định cũng được).
4. `git push`. Xung đột biến mất và CI chạy lại.

**Cách giảm xung đột:** Long chỉ sửa trong `backend/`, Tài chỉ sửa trong `frontend/`. Những file dùng chung (`README.md`, `docker-compose.yml`, `docs/API-CONTRACT.md`, `.env.example`) thì báo người kia trước khi sửa.

## 6. Hợp đồng API

Hình dạng JSON của `/products` và `/orders` nằm ở `docs/API-CONTRACT.md`. Tài dựng giao diện theo dữ liệu giả có đúng hình dạng đó, không chờ backend xong. **Mọi thay đổi hợp đồng phải báo người kia trước khi sửa**, nếu không giao diện và API sẽ lệch nhau lúc ghép.

## 7. Gợi ý kỹ thuật cho từng issue

> Đây là gợi ý định hướng, chưa được kiểm chứng. Tiêu chí chấp nhận trong issue mới là chuẩn.

| Issue | Gợi ý |
|---|---|
| #4 T2 | Thêm Prisma (`prisma`, `@prisma/client`), kết nối bằng `DATABASE_URL` (compose đã đặt sẵn), model `Product`, migrate, seed dữ liệu mẫu, controller `GET /products` |
| #8 T6 | DTO dùng `class-validator` và `class-transformer`, bật `ValidationPipe` trong `main.ts`, bảng đơn hàng và chi tiết đơn, trạng thái ban đầu `PENDING` |
| #9 T7 | `@nestjs/jwt` và `bcrypt`, guard kiểm tra JWT; `JWT_SECRET`, `JWT_EXPIRES_IN` đã có trong `.env.example` |
| #10 T8 | Endpoint `POST /payments` nhận Ví/Thẻ, mock kết quả thành công hoặc lỗi, đổi đơn sang `PAID` hoặc `PAYMENT_FAILED` |
| #12 T9a | `GET /orders/me` dùng guard JWT để lấy đơn của người dùng đăng nhập; job `docker` của CI phải xanh |
| #14 T10a | Một bảng "trạng thái nào được chuyển sang trạng thái nào" và một hàm kiểm tra; có test cho các chuyển trạng thái sai |
| #5 T3 | Gọi `${NEXT_PUBLIC_API_URL}/products`, vẽ lưới sản phẩm, xử lý loading và empty |
| #6, #7 T4, T5 | Màn chi tiết chọn size và topping tính giá; giỏ hàng dùng Zustand (`npm i zustand`) |
| #11 T8-FE, #13 T9-FE | Màn thanh toán gọi `POST /payments`; màn lịch sử gọi `GET /orders/me`; cả hai có loading và lỗi |

**Lưu ý cho frontend:** `frontend/AGENTS.md` ghi rằng bản Next.js này có thay đổi so với Next.js quen thuộc, hãy đọc tài liệu trong `node_modules/next/dist/docs/` trước khi viết code.

## 8. Definition of Done

Một issue chỉ được tính điểm khi đủ **cả sáu** điều kiện:

- [ ] Code chạy được, không lỗi build
- [ ] Đúng tiêu chí chấp nhận của task
- [ ] Có commit trên Git với mô tả rõ ràng, được người còn lại review
- [ ] API có validate đầu vào
- [ ] Giao diện xử lý trạng thái loading và lỗi cơ bản
- [ ] README có hướng dẫn chạy

## 9. Khi thiếu giờ

Ưu tiên là **làm ít task nhưng mỗi task đạt Definition of Done**, vì task làm dở không được tính điểm. Cắt theo thứ tự:

1. Trước hết bỏ các issue nhãn `could`: #15 (idempotency), #16 (optimistic locking), #17 (loyalty).
2. Nếu vẫn thiếu, bỏ tiếp #9 (JWT).
3. Phần đã làm được thì trình bày thực khi bàn giao.

## 10. Khi CI đỏ

| Job đỏ | Cách xử lý |
|---|---|
| `backend` | Chạy lại các lệnh ở mục 3.3 trong `backend/`, xem lệnh nào lỗi (lint, build hay test) |
| `frontend` | Chạy lại `npm run lint` và `npm run build` trong `frontend/` |
| `docker` | Chạy `docker compose up --build` ở máy, rồi `docker compose logs` để xem container nào lỗi |
| Không có job nào chạy | PR đang bị xung đột, xem mục 5 |
