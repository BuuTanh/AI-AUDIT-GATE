# AI Audit Gate

Hệ thống kiểm định tài liệu yêu cầu nghiệp vụ (SRS) thông minh — NAB Vietnam  
Project thực tập năm 3, UEL · Demo UI (Frontend only)

---

## Cấu trúc thư mục

```
AI Audit Gate/
├── index.html                  ← Redirect tự động về pages/login.html
├── pages/
│   ├── login.html              ← Đăng nhập, chọn vai trò
│   ├── dashboard.html          ← Tổng quan: stat cards, health score, biểu đồ lỗi
│   ├── projects.html           ← Grid dự án, filter, health gauge
│   ├── requirements.html       ← Bảng yêu cầu + AI Audit Engine panel
│   ├── audit.html              ← Kết quả kiểm định, expandable error table
│   └── approval.html           ← Phê duyệt tài liệu, comment, version history
├── assets/
│   ├── css/styles.css          ← Design system (CSS variables, dark/light mode)
│   ├── js/
│   │   ├── nav.js              ← Active nav link, user session display
│   │   └── app.js              ← Theme toggle + VI/EN language switch
│   └── images/
│       ├── logo_NAB.png
│       ├── logo_NAB_full_text_trang.png
│       └── logo_NAB_text_trang.png
├── backend/                    ← Placeholder cho backend sau này
│   ├── routers/                ← API route handlers (FastAPI / Vercel Functions)
│   └── models/                 ← AI model integration (ReqBrain)
├── data/
│   ├── projects.json           ← Mock data dự án
│   └── requirements.json       ← Mock data yêu cầu
└── README.md
```

---

## Chạy web local (VS Code)

### Cách 1 — Live Server extension (khuyến nghị)

1. Cài extension **Live Server** (Ritwick Dey) trong VS Code
2. Chuột phải vào `index.html` → **Open with Live Server**
3. Trình duyệt tự mở tại `http://127.0.0.1:5500`

### Cách 2 — Terminal lệnh `npx serve`

```bash
# Trong terminal VS Code (Ctrl + `)
npx serve .
# Mở http://localhost:3000
```

### Cách 3 — Python HTTP server

```bash
python -m http.server 8080
# Mở http://localhost:8080
```

---

## Tính năng

| Tính năng | Mô tả |
|---|---|
| 🌙 Dark / ☀️ Light mode | Nút toggle ở topnav, lưu vào localStorage |
| 🌐 VI / EN | Nút chuyển ngôn ngữ ở topnav, dịch các nhãn nav |
| AI Audit Engine | Panel nhập nghiệp vụ thô → sinh yêu cầu (mock 1.8s) |
| Health Score gauge | SVG circular gauge, công thức `dashoffset = circumference × (1 − score/100)` |
| Expandable audit rows | Click hàng để xem diff gốc vs gợi ý AI |
| Approval workflow | Phê duyệt / Yêu cầu sửa / Từ chối với comment và version timeline |

---

## Kiến trúc Backend (kế hoạch)

Khi tích hợp backend để deploy lên **Vercel**:

```
Frontend (pages/)  ←→  Vercel Serverless Functions (backend/routers/)
                              ↕
                       Supabase (PostgreSQL)   ←  lưu projects, requirements
                              ↕
                    LM Studio API (localhost:1234)  ←  ReqBrain model
```

### Stack đề xuất

| Layer | Tech | Lý do |
|---|---|---|
| Frontend | HTML/CSS/JS (hiện tại) | Không cần build tool, deploy tĩnh |
| Backend API | Python FastAPI → Vercel Functions | OpenAI-compatible, dễ tích hợp LM Studio |
| Database | Supabase (PostgreSQL) | Free tier, realtime, REST API có sẵn |
| AI Model | ReqBrain via LM Studio | `reelicit_-_zephyr-7b-beta-reqbrain`, port 1234 |

### ReqBrain API call mẫu

```javascript
const response = await fetch('http://localhost:1234/v1/chat/completions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'reelicit_-_zephyr-7b-beta-reqbrain',
    messages: [
      { role: 'system', content: 'You are a requirements engineering assistant.' },
      { role: 'user', content: userInput }
    ],
    temperature: 0.3,
    max_tokens: 512
  })
});
```

---

## Roles

| Role | Quyền hạn |
|---|---|
| **BA** | Tạo và chỉnh sửa yêu cầu |
| **Senior BA** | Kiểm định, phê duyệt, nhận xét |
| **PM** | Xem tổng quan dashboard |

---

*NAB Business Requirements Design Style Guide v1.0 · Inter font · Material Symbols · Tailwind CSS CDN*
