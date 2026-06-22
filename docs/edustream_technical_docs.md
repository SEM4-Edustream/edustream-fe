# 📚 EduStream – Tài Liệu Kỹ Thuật

> Cập nhật: 18/05/2026

---

## 1. Tổng Quan

**EduStream** là nền tảng học trực tuyến (E-Learning Marketplace) với 3 vai trò chính:
- **Student** – Mua và học các khóa học
- **Tutor** – Tạo, quản lý và phát hành khóa học
- **Admin** – Quản trị toàn bộ nền tảng

### Công Nghệ

| Thành phần | Công nghệ |
|---|---|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS |
| Backend | Spring Boot 3, Java 21 |
| Database | PostgreSQL (Supabase) |
| Auth | JWT (HS512) + Supabase OAuth (Google) |
| Storage | AWS S3 |
| Payment | PayOS |
| AI | OpenRouter API |
| Real-time | WebSocket (STOMP) |
| Email | Gmail SMTP |

---

## 2. Cấu Trúc Dự Án

### Backend (`edustream-be`)

```
src/main/java/sem4/edustreambe/
├── config/           # DatabaseSeeder, CORS, Security
├── configuration/    # JWT, WebSocket config
├── constant/         # PredefinedRole, UserStatus
├── controller/       # 24 REST Controllers
│   ├── admin/        # AdminCourseController, AdminTutorController, AdminUserController
│   └── tutor/        # TutorAnalyticsController
├── dto/              # Request / Response DTOs
├── entity/           # 29 JPA Entities
├── enums/            # CourseStatus, VerificationStatus, LessonType
├── exception/        # GlobalExceptionHandler, ErrorCode
├── mapper/           # MapStruct
├── repository/       # JPA Repositories
├── service/          # 23 Business Logic Services
└── utils/
```

### Frontend (`edustream-fe`)

```
src/
├── app/[locale]/
│   ├── (auth)/           # Login, Register, Forgot Password
│   ├── (public)/
│   │   ├── page.tsx      # Trang chủ
│   │   ├── courses/      # Danh sách & chi tiết khóa học
│   │   ├── learning/     # Trang học (video, Q&A, notes)
│   │   ├── my-learning/  # Khóa học đã mua
│   │   ├── cart/         # Giỏ hàng
│   │   ├── payment/      # Kết quả thanh toán
│   │   └── tutors/       # Danh sách gia sư
│   ├── tutor/
│   │   ├── onboarding/   # Đăng ký gia sư
│   │   ├── application/  # Trạng thái duyệt hồ sơ
│   │   ├── course/[courseId]/
│   │   │   ├── basics/       # Thông tin cơ bản
│   │   │   ├── curriculum/   # Modules & Lessons
│   │   │   ├── goals/        # Mục tiêu khóa học
│   │   │   ├── announcements/# Thông báo lớp
│   │   │   └── messages/     # Q&A từ học viên
│   │   └── dashboard/        # Thống kê gia sư
│   ├── admin/
│   │   ├── page.tsx          # Dashboard (charts)
│   │   ├── courses/          # Quản lý khóa học
│   │   ├── tutor-verification/ # Duyệt hồ sơ gia sư
│   │   └── users/            # Quản lý Student/Tutor
│   ├── checkout/         # Thanh toán
│   └── profile/          # Trang cá nhân
├── components/
│   ├── features/         # Learning, TutorDashboard, Course, Admin...
│   ├── home/             # Hero, FeaturedCourses, CategoryShowcase
│   └── ui/               # Shadcn UI primitives
├── services/             # 16 API service files
└── context/              # AuthContext
```

---

## 3. Mô Hình Dữ Liệu

### Entities Chính

**User**
```
id (UUID), username*, email*, password (BCrypt)
fullName, avatarUrl, dob, status (ACTIVE|INACTIVE|BANNED)
role → Role
```

**Role**: `role_id`, `role_name` (STUDENT | TUTOR | ADMIN)

**TutorProfile**
```
id (UUID), user (1-1), headline, bio, videoIntroduction
status: DRAFT | PENDING | APPROVED | REJECTED | BANNED
documents → List<TutorDocument>
```

**Course**
```
id (UUID), tutorProfile, title, subtitle, description
thumbnailUrl, price, level, language, status
status: DRAFT | PENDING | PUBLISHED | REJECTED
averageRating, category → Category
modules → List<CourseModule>
```

**CourseModule**: `id`, `course`, `title`, `orderIndex`, `lessons`

**Lesson**
```
id (UUID), module, title, content (TEXT)
videoUrl, durationSeconds, orderIndex
type: VIDEO | TEXT | QUIZ | ASSIGNMENT
isFreePreview
```

**Category**: `id (slug)`, `name`, `slug`, `parent` (self-ref tree)

### Entities Hỗ Trợ

| Entity | Mô tả |
|---|---|
| Enrollment | Học viên đã mua/enroll khóa học |
| LessonProgress | Tiến độ học từng bài |
| Question / QuestionAnswer | Hệ thống Q&A |
| QuizQuestion / QuizAnswerChoice / QuizSubmission | Quiz |
| AssignmentSubmission | Nộp bài tập |
| CourseReview | Đánh giá & rating |
| Notification | Thông báo real-time (WebSocket) |
| Note | Ghi chú trong bài học |
| CartItem | Giỏ hàng |
| WishlistItem | Yêu thích |
| PaymentTransaction | Lịch sử giao dịch PayOS |
| Announcement | Thông báo từ gia sư |
| InvalidatedToken | Blacklist JWT đã logout |
| PasswordResetToken | Token reset mật khẩu |

---

## 4. API Endpoints

### Authentication (`/auth`)

| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/auth/register` | Đăng ký |
| POST | `/auth/login` | Đăng nhập |
| POST | `/auth/logout` | Đăng xuất |
| POST | `/auth/refresh` | Làm mới token |
| POST | `/auth/introspect` | Kiểm tra token |
| POST | `/auth/outbound/authentication` | Sync OAuth (Google) |
| POST | `/auth/forgot-password` | Yêu cầu reset MK |
| POST | `/auth/reset-password` | Đặt lại mật khẩu |

### User (`/users`)

| Method | Endpoint | Role |
|---|---|---|
| GET | `/users/my-info` | ALL |
| PUT | `/users/me` | ALL |
| PATCH | `/users/avatar` | ALL |

### Public Courses (`/api/courses`)

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/courses` | Danh sách (search, filter category, paging) |
| GET | `/api/courses/{id}` | Chi tiết khóa học |

### Tutor Course Management (`/api/tutor-courses`) — TUTOR only

| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/api/tutor-courses` | Tạo khóa học |
| GET | `/api/tutor-courses` | DS khóa học của tôi |
| GET/PUT | `/api/tutor-courses/{id}` | Chi tiết / Cập nhật |
| POST | `/api/tutor-courses/{id}/submit` | Nộp duyệt |
| CRUD | `/api/tutor-courses/{id}/modules` | Quản lý modules |
| PUT | `/api/tutor-courses/{id}/modules/reorder` | Sắp xếp lại |
| CRUD | `/api/tutor-courses/modules/{moduleId}/lessons` | Quản lý lessons |
| PUT | `/api/tutor-courses/modules/{moduleId}/lessons/reorder` | Sắp xếp |

### Q&A (`/api/qa`)

| Method | Endpoint | Role |
|---|---|---|
| GET | `/api/qa/tutor` | TUTOR |
| GET | `/api/qa/courses/{courseId}` | Public |
| GET | `/api/qa/{questionId}` | Public |
| POST | `/api/qa/courses/{courseId}` | STUDENT/TUTOR |
| POST | `/api/qa/{questionId}/answers` | Authenticated |
| PATCH | `/api/qa/answers/{answerId}/top` | TUTOR |
| PATCH | `/api/qa/{questionId}/resolve` | Authenticated |

### Admin (`/api/admin`) — ADMIN only

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/admin/courses` | Tất cả khóa học |
| POST | `/api/admin/courses/{id}/verify` | Duyệt/Từ chối KH |
| GET | `/api/admin/tutor-profiles` | DS hồ sơ gia sư |
| GET | `/api/admin/tutor-profiles/{id}` | Chi tiết gia sư |
| POST | `/api/admin/tutor-profiles/{id}/verify` | Duyệt gia sư |
| GET | `/api/admin/users?role=STUDENT\|TUTOR` | DS users theo role |

### Các API Khác

| Prefix | Mô tả |
|---|---|
| `/api/progress` | Đánh dấu hoàn thành bài học |
| `/api/enrollments` | Kiểm tra enrollment |
| `/api/reviews` | Đánh giá khóa học |
| `/api/notifications` | Thông báo (+ WebSocket) |
| `/api/notes` | Ghi chú bài học |
| `/api/cart` | Giỏ hàng |
| `/api/wishlist` | Danh sách yêu thích |
| `/api/quiz` | Quiz submissions |
| `/api/assignments` | Nộp & chấm bài tập |
| `/api/announcements` | Thông báo lớp học |
| `/api/ai-coach` | Chat AI Coach |
| `/api/files` | Presigned URL (S3 upload) |
| `/api/categories` | Danh mục khóa học |
| `/api/tutors` | Danh sách gia sư (public) |
| `/api/tutor-profiles` | Hồ sơ gia sư |
| `/api/analytics` | Thống kê gia sư |
| `/api/payments` | Tạo / hủy thanh toán PayOS |
| `/api/webhooks/payos` | Webhook callback PayOS |

---

## 5. Luồng Nghiệp Vụ

### Đăng nhập

```
[Email/Pass]  POST /auth/login → JWT token
[Google]      Supabase OAuth → POST /auth/outbound/authentication
              → Sync user DB → Sinh internal JWT
```

### Gia sư tạo khóa học

```
1. Hoàn thiện TutorProfile → Submit (PENDING)
2. Admin APPROVE → Gia sư tạo khóa học (DRAFT)
3. Điền basics / goals / curriculum
4. Upload video qua Presigned URL lên S3
5. Submit khóa học (PENDING) → Admin review
6. Admin APPROVE → Status = PUBLISHED
```

### Học viên mua khóa học

```
1. Duyệt DS → Thêm vào Cart
2. Checkout → Tạo Booking + PaymentTransaction
3. Redirect sang PayOS → Học viên thanh toán
4. PayOS Webhook → Backend confirm → Tạo Enrollment
5. Học viên vào /learning/{courseId}
```

### Học bài

```
1. Chọn bài (VIDEO / TEXT / QUIZ / ASSIGNMENT)
2. Làm xong → POST /api/progress/{lessonId}/complete
3. 100% hoàn thành → Popup chúc mừng → Rate khóa học
```

---

## 6. Phân Quyền

| Role | Quyền |
|---|---|
| **STUDENT** | Mua, học, Q&A, đánh giá, ghi chú, giỏ hàng, wishlist |
| **TUTOR** | STUDENT + tạo/quản lý khóa học, thống kê, thông báo lớp |
| **ADMIN** | Duyệt gia sư, duyệt khóa học, quản lý users |

---

## 7. Tích Hợp Ngoài

| Service | Mục đích |
|---|---|
| **AWS S3** | Lưu video bài học + tài liệu gia sư (Presigned URL) |
| **PayOS** | Cổng thanh toán, nhận webhook xác nhận giao dịch |
| **Supabase** | PostgreSQL database + OAuth (Google login) |
| **OpenRouter** | AI Coach chatbot hỗ trợ học viên |
| **Gmail SMTP** | Email chào mừng, reset mật khẩu |

---

## 8. Cấu Hình Môi Trường

### Backend (`.env`)

```env
SPRING_PROFILES_ACTIVE=dev
DB_HOST=xxx.supabase.com
DB_PORT=5432
DB_NAME=postgres
DB_USERNAME=postgres.xxx
DB_PASSWORD=xxx

JWT_SIGNER_KEY=xxx
JWT_VALID_DURATION=3600
JWT_REFRESHABLE_DURATION=36000

PAYOS_CLIENT_ID=xxx
PAYOS_API_KEY=xxx
PAYOS_CHECKSUM_KEY=xxx

AWS_S3_REGION=ap-southeast-2
AWS_S3_BUCKET=xxx
AWS_S3_DOCUMENT_BUCKET=xxx
AWS_ACCESS_KEY=xxx
AWS_SECRET_KEY=xxx

SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx
SUPABASE_JWT_SECRET=xxx

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=xxx@gmail.com
MAIL_PASSWORD=xxx

OPENAI_API_KEY=sk-or-v1-xxx
APP_FRONTEND_URL=https://edu-stream.dev
```

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
```

---

## 9. Chạy Local

```bash
# Backend (Java 21 required)
cd edustream-be
./mvnw spring-boot:run
# Swagger: http://localhost:8080/swagger-ui.html

# Frontend (Node 18+ required)
cd edustream-fe
npm install && npm run dev
# App: http://localhost:3000
```

---

## 10. Tài Khoản Mặc Định

| Role | Username | Password |
|---|---|---|
| Admin | `admin` | `admin123` |
| Tutor | `tutor_demo` | `12345678` |

---

## 11. Response Format

```json
{
  "code": 1000,
  "message": "Success",
  "result": { ... }
}
```

Error:
```json
{
  "code": 4001,
  "message": "USER_EXISTED",
  "result": null
}
```

---

## 12. Sơ Đồ Quan Hệ

```
User ──< Enrollment >── Course
User ──< CartItem, WishlistItem >── Course
User ──< LessonProgress >── Lesson
User ──< Question >── Course
Question ──< QuestionAnswer

Course ──< CourseModule ──< Lesson
Lesson ──< QuizQuestion ──< QuizAnswerChoice
Lesson ──< QuizSubmission
Lesson ──< AssignmentSubmission

TutorProfile ──< Course
TutorProfile ──< TutorDocument
Category (self-ref tree) ──< Course
```
