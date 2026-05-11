# Kế hoạch triển khai: Communication Hub

> **Phạm vi:** Tutor Dashboard — `/tutor/dashboard/communication/*`
> **Ưu tiên:** 🔴 Cao — Đây là tính năng còn placeholder, chưa có dữ liệu thực

---

## Tổng quan hiện trạng

| Trang | Trạng thái | Mô tả |
|-------|-----------|-------|
| `/communication/qa` | ⚠️ UI tĩnh | Có giao diện nhưng toàn bộ là hardcode, không có API |
| `/communication/announcements` | 🔴 Placeholder | Chỉ có text "Coming soon!" |
| `/communication/messages` | 🔴 Chưa rõ | Cần kiểm tra |
| `/communication/assignments` | ✅ Hoàn chỉnh | Đã có API đầy đủ |

---

## PHẦN 1: Q&A (Hỏi & Đáp)

### 1.1 Luồng nghiệp vụ

```
Học viên → Trang học (/learning/[courseId])
    ↓ Đặt câu hỏi về bài học
    ↓ POST /api/questions

Giảng viên → Communication → Q&A
    ↓ Xem danh sách câu hỏi theo khóa học
    ↓ Lọc: Chưa đọc / Chưa có trả lời / Chưa có câu trả lời từ giảng viên
    ↓ Click vào câu hỏi → Mở thread
    ↓ POST /api/questions/{id}/answers → Đăng câu trả lời
    ↓ Mark as Top Answer
```

### 1.2 Backend cần tạo

**Entity: `Question.java`**
```java
- id (UUID)
- courseId (FK)
- lessonId (FK, optional)
- studentId (FK → User)
- title (String)
- body (String)
- isResolved (boolean)
- createdAt
```

**Entity: `QuestionAnswer.java`**
```java
- id (UUID)
- questionId (FK)
- authorId (FK → User)
- body (String)
- isTopAnswer (boolean)
- createdAt
```

**API cần tạo:**

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/api/tutor/questions` | Lấy danh sách Q&A theo khóa học của tutor |
| `GET` | `/api/questions/{id}` | Chi tiết câu hỏi + danh sách trả lời |
| `POST` | `/api/questions` | Học viên đặt câu hỏi |
| `POST` | `/api/questions/{id}/answers` | Trả lời câu hỏi |
| `PATCH` | `/api/answers/{id}/top` | Đánh dấu là Top Answer |
| `PATCH` | `/api/questions/{id}/resolve` | Đánh dấu đã giải quyết |

**Query Params cho `GET /api/tutor/questions`:**
- `courseId` — lọc theo khóa học
- `status` — `UNREAD`, `NO_ANSWER`, `NO_INSTRUCTOR_ANSWER`
- `sort` — `NEWEST`, `OLDEST`
- `page`, `size`

### 1.3 Frontend cần xây dựng

**Components:**
```
src/components/features/communication/
├── QuestionList.tsx          # Danh sách câu hỏi (card + filter)
├── QuestionThread.tsx        # Chi tiết thread khi click
├── AnswerItem.tsx            # Hiển thị một câu trả lời
├── QuestionFilterBar.tsx     # Checkbox filter + sort
└── QuestionCard.tsx          # Card tóm tắt câu hỏi trong list
```

**Trang Q&A (refactor):**
- Dropdown chọn khóa học (fetch từ API)
- Danh sách câu hỏi từ API (có phân trang)
- Click vào câu hỏi → mở panel bên phải / modal thread
- Form trả lời với rich text
- Badge số câu hỏi chưa đọc

---

## PHẦN 2: Announcements (Thông báo)

### 2.1 Luồng nghiệp vụ

```
Giảng viên → Communication → Announcements
    ↓ Chọn khóa học
    ↓ Soạn thông báo (tiêu đề + nội dung)
    ↓ POST /api/announcements → Gửi đến TẤT CẢ học viên đã enrolled
    ↓ Học viên nhận thông báo qua email / notification bell
```

### 2.2 Backend cần tạo

**Entity: `Announcement.java`**
```java
- id (UUID)
- courseId (FK)
- tutorId (FK)
- title (String)
- body (String)
- sentAt (LocalDateTime)
- recipientCount (int)
```

**API:**

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/api/tutor/announcements` | Lịch sử thông báo đã gửi |
| `POST` | `/api/announcements` | Gửi thông báo mới |
| `DELETE` | `/api/announcements/{id}` | Xóa thông báo |

**Logic gửi thông báo:**
- Khi tạo Announcement → Lấy danh sách Enrollment của courseId
- Gửi email đến từng học viên qua Gmail SMTP
- Lưu vào bảng Notification cho từng học viên

### 2.3 Frontend cần xây dựng

**Components:**
```
src/components/features/communication/
├── AnnouncementComposer.tsx  # Form soạn thông báo (rich text)
├── AnnouncementHistory.tsx   # Lịch sử thông báo đã gửi
└── AnnouncementCard.tsx      # Card hiển thị thông báo cũ
```

**UI Flow:**
```
[Dropdown chọn khóa học]
[Preview: "Thông báo này sẽ gửi đến X học viên"]
[Textarea: Tiêu đề]
[Rich Text Editor: Nội dung]
[Button: Gửi thông báo]
─────────────────────────────
[Lịch sử thông báo đã gửi]
  ├── Tiêu đề | Ngày gửi | Số người nhận
  ├── ...
```

---

## PHẦN 3: Messages (Tin nhắn trực tiếp)

> **Lưu ý:** Đây là tính năng phức tạp nhất, nên để giai đoạn sau nếu không có WebSocket.

### 3.1 Phương án đơn giản (Polling — không cần WebSocket)

```
Học viên → Trang học → Nhấn "Liên hệ giảng viên"
    ↓ POST /api/messages { to: tutorId, content }

Giảng viên → Communication → Messages
    ↓ Danh sách cuộc hội thoại (polling mỗi 10 giây)
    ↓ Click vào → Xem thread
    ↓ POST /api/messages/reply
```

### 3.2 Backend cần tạo

**Entity: `Message.java`**
```java
- id (UUID)
- conversationId (UUID)
- senderId (FK → User)
- receiverId (FK → User)
- content (String)
- isRead (boolean)
- createdAt
```

**API:**

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/api/messages/conversations` | Danh sách cuộc hội thoại |
| `GET` | `/api/messages/{conversationId}` | Tin nhắn trong conversation |
| `POST` | `/api/messages` | Gửi tin nhắn |
| `PATCH` | `/api/messages/{id}/read` | Đánh dấu đã đọc |

---

## Lộ trình thực hiện (Sprint)

### Sprint 1 — Q&A (1-2 ngày)
```
Backend:
  □ Tạo entity Question, QuestionAnswer
  □ Tạo Repository, Service, Controller
  □ Viết API với filter + pagination
  □ Thêm security: chỉ tutor của course mới xem được

Frontend:
  □ Fetch danh sách câu hỏi theo khóa học đã chọn
  □ Render danh sách có filter hoạt động
  □ Form trả lời câu hỏi (textarea đơn giản)
  □ Thêm form đặt câu hỏi vào trang học tập /learning
```

### Sprint 2 — Announcements (1 ngày)
```
Backend:
  □ Tạo entity Announcement
  □ API gửi thông báo + lấy lịch sử
  □ Tích hợp Gmail SMTP để gửi email hàng loạt

Frontend:
  □ Form soạn thông báo với preview số người nhận
  □ Danh sách lịch sử thông báo đã gửi
```

### Sprint 3 — Messages (2-3 ngày, tùy phức tạp)
```
Backend:
  □ Tạo entity Message, Conversation
  □ API CRUD tin nhắn

Frontend:
  □ UI danh sách conversation
  □ UI chat thread
  □ Polling tự động mỗi 10 giây
```

---

## Quyết định kỹ thuật

| Vấn đề | Quyết định | Lý do |
|--------|-----------|-------|
| Real-time Messages | **Polling** (không WebSocket) | Đơn giản hơn, đủ dùng cho MVP |
| Rich Text Editor | **Textarea đơn giản** cho giai đoạn 1 | Tránh phụ thuộc thêm thư viện |
| Email Announcements | **Gmail SMTP** (đã có config) | Không cần dịch vụ bên thứ 3 mới |
| Thứ tự ưu tiên | **Q&A → Announcements → Messages** | Q&A có nhiều giá trị nhất với user |

---

## Bắt đầu từ đâu?

> Tôi đề xuất **bắt đầu từ Backend Q&A API** vì đây là nền tảng cho cả frontend. Sau khi API hoạt động, phần frontend sẽ chỉ cần "nối dây" là xong.

Bạn muốn:
- **A)** Bắt đầu xây Backend Q&A API ngay bây giờ
- **B)** Xây Frontend Q&A (dùng mock data trước, kết nối API sau)
- **C)** Bắt đầu từ Announcements (đơn giản hơn)
