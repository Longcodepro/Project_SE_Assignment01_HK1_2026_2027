# Hướng dẫn Triển khai Hybrid & CD (Vercel + Cloudflare Tunnel)

Tài liệu hướng dẫn cấu hình Continuous Deployment (CD) và triển khai đồ án **BrewLite** theo kiến trúc **Hybrid**:
- **Frontend:** Lưu trữ trên Cloud qua nền tảng [Vercel](https://vercel.com/) (miễn phí, tự động deploy qua Git).
- **Backend & Database:** Chạy an toàn trên Laptop của bạn (chỉ bật khi cần chạy thử/demo, không cần mở máy 24/7).
- **Đường truyền an toàn:** Sử dụng **Cloudflare Tunnel** cấp chứng chỉ HTTPS công khai, vượt qua tường lửa/NAT và chống lỗi Mixed Content.
- **Quy trình CD:** Tự động đóng gói và xuất bản Docker Image lên **GitHub Container Registry (GHCR)** mỗi khi merge vào nhánh `main`.

---

## 1. Sơ đồ kiến trúc hoạt động

```text
[ Trình duyệt / Giảng viên ]
            │
            ▼ (Truy cập Web)
  [ Vercel (Frontend Next.js) ]
  https://brewlite.vercel.app
            │
            ▼ (Gọi API qua HTTPS an toàn)
  [ Cloudflare Quick Tunnel ]
  https://<random-id>.trycloudflare.com
            │
            ▼ (Chuyển tiếp về cổng 4000)
  [ Laptop cá nhân (Chỉ chạy khi cần) ]
  ├── Backend NestJS (cổng 4000, hỗ trợ CORS Vercel)
  └── PostgreSQL Database (cổng 4002)
```

---

## 2. Quy trình thiết lập từng bước

### Bước 1: Deploy Frontend lên Vercel

1. Đăng nhập vào [Vercel](https://vercel.com/) bằng tài khoản GitHub (`Longcodepro` hoặc `TaiTran263`).
2. Bấm **Add New...** ➔ **Project** ➔ Chọn repository `Longcodepro/Project_SE_Assignment01_HK1_2026_2027`.
3. Trong phần cấu hình dự án:
   - **Framework Preset:** Next.js
   - **Root Directory:** Chọn thư mục `frontend` (bấm Edit ➔ chọn `frontend`).
4. Trong phần **Environment Variables**:
   - Thêm biến: `NEXT_PUBLIC_API_URL` (giá trị tạm thời có thể để URL tunnel hoặc domain).
5. Bấm **Deploy**. Vercel sẽ tự động build và cấp một tên miền dạng `https://project-se-assignment01-....vercel.app`.

---

### Bước 2: Khởi động Backend và mở Đường hầm trên Laptop

Mỗi khi bạn muốn chạy thử nghiệm hoặc demo cho giảng viên:

1. Mở terminal tại thư mục gốc của dự án.
2. Chạy script tự động:
   ```bash
   ./scripts/start-tunnel.sh
   ```
   *(Script sẽ tự kiểm tra Backend, nếu chưa chạy sẽ tự bật `docker compose up -d`, sau đó dùng Docker chạy `cloudflared` mà bạn không cần phải cài đặt thêm bất kỳ phần mềm nào vào máy).*

3. Terminal sẽ hiển thị đường link HTTPS công khai dạng:
   ```text
   Your quick Tunnel has been created! Visit it at (it may take some time to be reachable):
   https://example-tea-coffee-1234.trycloudflare.com
   ```

4. Truy cập Vercel ➔ **Settings** ➔ **Environment Variables**:
   - Sửa giá trị `NEXT_PUBLIC_API_URL` thành URL HTTPS vừa nhận được ở trên.
   - Bấm **Redeploy** trên Vercel (chỉ mất ~20 giây).

5. Bây giờ, bất kỳ ai vào trang Vercel đều có thể xem menu, đặt hàng và thanh toán trực tiếp qua Backend đang chạy trên máy bạn!

---

### Bước 3: Quy trình CD tự động (GitHub Actions)

Mỗi khi có code mới được merge vào nhánh `main`:
1. **Frontend:** Vercel tự động lắng nghe commit mới trên `main` và build lại giao diện.
2. **Backend:** Workflow `.github/workflows/cd.yml` tự động kích hoạt:
   - Đóng gói mã nguồn `backend/` thành Docker Image.
   - Gắn nhãn `latest` và mã commit sha.
   - Đẩy trực tiếp lên **GitHub Container Registry (GHCR)**: `ghcr.io/longcodepro/project_se_assignment01_hk1_2026_2027/backend:latest`.

---

## 3. Cách tắt khi kết thúc buổi demo

Khi buổi thuyết trình hoặc kiểm thử hoàn tất:
1. Tại terminal đang chạy tunnel: bấm `Ctrl + C` để đóng đường hầm.
2. Dừng các container backend trên máy:
   ```bash
   docker compose down
   ```
Laptop của bạn hoàn toàn trở lại trạng thái bình thường, không tốn tài nguyên, pin hay lo ngại rủi ro an ninh mạng.
