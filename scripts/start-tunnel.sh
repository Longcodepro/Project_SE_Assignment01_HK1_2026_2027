#!/bin/bash
set -e

echo "=================================================="
echo "    BrewLite - Khởi động Cloudflare Tunnel        "
echo "=================================================="

# Kiểm tra backend cục bộ
if curl -s http://localhost:4000 > /dev/null; then
    echo "✓ Đã phát hiện Backend NestJS đang chạy tại http://localhost:4000"
else
    echo "⚠ CẢNH BÁO: Chưa thấy Backend chạy tại cổng 4000."
    echo "  Vui lòng khởi động backend bằng Docker trước:"
    echo "  $ docker compose up -d"
    echo ""
    read -p "Bạn có muốn khởi động backend ngay bây giờ không? (y/n): " confirm
    if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
        docker compose up -d
        echo "Đang chờ backend sẵn sàng..."
        until curl -s http://localhost:4000 > /dev/null; do
            sleep 2
        done
        echo "✓ Backend đã sẵn sàng!"
    fi
fi

echo ""
echo "--------------------------------------------------"
echo "Đang khởi tạo đường hầm HTTPS ra ngoài Internet..."
echo "Hệ thống sẽ cấp cho bạn một đường link HTTPS miễn phí."
echo "Hãy copy link đó và dán vào biến môi trường NEXT_PUBLIC_API_URL trên Vercel."
echo "Nhấn Ctrl+C để dừng đường hầm khi kết thúc demo."
echo "--------------------------------------------------"
echo ""

# Nếu đã cài binary cloudflared thì dùng trực tiếp
if command -v cloudflared &> /dev/null; then
    cloudflared tunnel --url http://localhost:4000
else
    # Nếu chưa cài, chạy qua Docker image chính chủ của Cloudflare (không cần cài gì thêm)
    echo "-> Đang chạy Cloudflare Tunnel qua Docker container..."
    docker run --rm -it --network host cloudflare/cloudflared:latest tunnel --url http://localhost:4000
fi
