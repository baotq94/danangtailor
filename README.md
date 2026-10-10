# Đà Nẵng Tailor

```text
danangtailor/
├── content/                 # Cấu hình, bảng giá và bản dịch vi/ko/en
├── design-system/           # Quy chuẩn thiết kế
├── docs/                    # Yêu cầu và kế hoạch
├── photos/                  # Ảnh gốc và nguồn ảnh
├── public/                  # Font, favicon và cấu hình HTTP header
├── scripts/                 # Chuyển ảnh WebP và tải font
├── src/
│   ├── app/                 # Trang, section, UI, i18n và nội dung
│   ├── styles/              # Style dùng chung
│   ├── main.ts              # Điểm khởi chạy trình duyệt
│   └── main.server.ts       # Điểm khởi chạy prerender
├── angular.json             # Cấu hình Angular
├── package.json             # Dependencies và lệnh npm
├── package-lock.json        # Khoá phiên bản dependencies
├── tsconfig*.json           # Cấu hình TypeScript
└── wrangler.jsonc           # Cấu hình Cloudflare Workers
```

Trang giới thiệu Nhà may Đà Nẵng (chợ Hàn, Đà Nẵng): `/vi`, `/ko`, `/en`.

## Lệnh

```bash
npm install
npm start       # http://localhost:4200
npm run build   # ra dist/danangtailor/browser
npm test
```

`npm start` và `npm run build` tự đổi ảnh trong `photos/` sang WebP trước khi chạy.

## Cloudflare Workers (Git integration)

- Project name: `danangtailor` (phải trùng `name` trong `wrangler.jsonc`)
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy` (thư mục output khai báo trong `wrangler.jsonc`)
- Node: Cloudflare tự đọc từ `.node-version` (24)

`siteUrl` trong `content/site.json` đang là `https://example.com`. Sau khi deploy, đổi sang URL thật của project mới; cấu hình Cloudflare Web Analytics nếu cần.

Font tự host kèm giấy phép OFL trong `public/fonts/`. Nguồn ảnh: `photos/CREDITS.md`.
