# BrewLite

Ứng dụng đặt cà phê không dùng tiền mặt. Next.js (frontend) · NestJS (backend) · PostgreSQL · Docker Compose.

## Chạy dự án

Yêu cầu: Docker + Docker Compose.

```bash
cp .env.example .env     # rồi sửa POSTGRES_PASSWORD, JWT_SECRET
docker compose up --build
```

| Service  | URL                    |
|----------|------------------------|
| Frontend | http://localhost:4001  |
| Backend  | http://localhost:4000  |
| Postgres | localhost:4002         |

Kiểm tra backend: `curl http://localhost:4000` → `Hello World!`
Kiểm tra danh sách sản phẩm: `curl http://localhost:4000/products` (migration và seed tự chạy khi backend khởi động; khi chạy ngoài Docker: `cd backend && npx prisma migrate dev && npx prisma db seed`, cần `DATABASE_URL`).

Dừng: `docker compose down` (thêm `-v` để xoá dữ liệu DB).

Chạy riêng từng service bằng Docker:

```bash
docker compose up --build db         # chỉ Postgres
docker compose up --build backend    # backend (kèm db)
docker compose up --build frontend   # frontend (kèm backend và db)
```

Chạy không cần Docker (cần Node.js 22+):

```bash
cd backend  && npm ci && PORT=4000 npm run start:dev
cd frontend && npm ci && NEXT_PUBLIC_API_URL=http://localhost:4000 npm run dev -- -p 4001
```

## Cấu trúc

- `frontend/` — Next.js
- `backend/` — NestJS
- `docs/` — phân công, `API-CONTRACT.md`

## Quy ước

- Nhánh: `<tên-người>/task-N-mo-ta-ngan`, không push thẳng `main`, merge qua Pull Request.
- Commit: `<loại>(task-N): <mô tả>` (feat, fix, chore, docs, refactor, test, style).
