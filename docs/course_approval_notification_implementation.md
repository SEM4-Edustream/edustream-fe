# EduStream — Implement tổng thể: Notification cho Tutor khi Admin approve/publish khóa học

## Mục tiêu

Khi Admin duyệt hoặc publish một khóa học, Tutor của khóa học đó sẽ nhận được thông báo ngay lập tức trong giao diện:

- Hiển thị trên `NotificationBell`
- Có toast realtime
- Có thể bấm để đi đến trang quản lý khóa học
- Lưu lại trong danh sách notification để xem sau

---

## Phạm vi triển khai

### Frontend
- Hiển thị notification loại `COURSE_STATUS`
- Làm nổi bật thông báo khi khóa học được duyệt/publish
- Nhận realtime qua WebSocket
- Load danh sách notification khi mở bell dropdown

### Backend
- Tạo notification khi Admin approve/publish khóa học
- Gửi notification realtime tới đúng Tutor
- Lưu notification vào database để truy vấn lại
- Đồng bộ payload với frontend

---

## Luồng nghiệp vụ mong muốn

### 1. Admin duyệt hoặc publish khóa học
- Admin thao tác trên dashboard
- Backend cập nhật trạng thái khóa học:
  - `PENDING` → `APPROVED`
  - hoặc `DRAFT` / `SUBMITTED` → `PUBLISHED`
- Sau khi cập nhật thành công, hệ thống tạo notification

### 2. Tutor nhận thông báo
- Notification được lưu trong DB
- Notification được đẩy realtime qua WebSocket
- Tutor thấy badge tăng lên trên bell
- Dropdown hiển thị nội dung thông báo
- Click vào thông báo sẽ mở trang quản lý khóa học

---

## Dữ liệu notification đề xuất

### Type
- `COURSE_STATUS`

### Title gợi ý
- `Khóa học đã được duyệt`
- `Khóa học đã được xuất bản`

### Message gợi ý
- `Khóa học "{courseName}" đã được admin phê duyệt.`
- `Khóa học "{courseName}" đã được xuất bản và hiển thị công khai.`

### Reference URL
- `/tutor/dashboard/manage/{courseId}`
- hoặc trang quản lý course cụ thể nếu dự án đang có route khác

---

## Backend implement đề xuất

### A. Tạo notification service dùng chung
Tạo service chịu trách nhiệm:
- lưu notification
- gửi realtime notification
- chuẩn hóa payload notification

Ví dụ chức năng:
- `createCourseStatusNotification(...)`
- `sendNotificationToUser(...)`

### B. Hook vào luồng approve/publish course
Tại nơi Admin duyệt khóa học:
- sau khi update course status thành công
- gọi notification service
- xác định tutor owner của khóa học
- bắn notification tới tutor đó

### C. API notification
Nếu backend chưa có đầy đủ, cần đảm bảo có:
- `GET /api/notifications`
- `GET /api/notifications/unread-count`
- `PATCH /api/notifications/{id}/read`
- `PATCH /api/notifications/read-all`

---

## Frontend implement đề xuất

### A. `NotificationBell`
Cần hỗ trợ:
- nhận realtime qua topic riêng của user
- hiển thị icon theo type `COURSE_STATUS`
- toast có action `Xem khóa học`
- giữ unread count chính xác

### B. Tích hợp trong layout
`NotificationBell` nên xuất hiện ở:
- header chung
- tutor dashboard header
- các khu vực có user authenticated

### C. UI/UX cho notification `COURSE_STATUS`
- màu nổi bật hơn thông báo thường
- icon `BadgeCheck`
- message rõ ràng, ngắn gọn
- click điều hướng trực tiếp tới trang quản lý course

---

## Thành phần cần bổ sung hoặc kiểm tra

### Frontend
- `src/services/notificationService.ts`
- `src/components/layout/NotificationBell.tsx`
- `src/hooks/useWebsocket.ts`
- layout đang render bell notification

### Backend
- Controller xử lý admin approve/publish course
- Notification entity/repository/service
- WebSocket messaging config
- Mapping notification payload

---

## Kiểm tra tương thích với code hiện tại

### Hiện đã có ở frontend
- `notificationService`
- `NotificationBell`
- `useWebsocket`
- toast realtime bằng `sonner`

### Cần backend khớp theo
- có topic WebSocket riêng cho user
- notification type có `COURSE_STATUS`
- payload có `title`, `message`, `referenceUrl`, `isRead`, `createdAt`

---

## Cách triển khai an toàn

### Bước 1
Tạo notification backend khi admin approve/publish course.

### Bước 2
Bắn realtime notification qua WebSocket.

### Bước 3
Kiểm tra frontend bell dropdown hiển thị đúng.

### Bước 4
Test case:
- admin approve course
- admin publish course
- tutor đăng nhập nhận notification ngay
- notification lưu lại và đọc được sau khi reload

---

## Ghi chú

Implement này nên làm theo kiểu incremental:
- không phá luồng cũ
- thêm `COURSE_STATUS` như một type mới
- tận dụng notification service hiện có
- ưu tiên ổn định và dễ mở rộng

---

## Kết luận

Đây là feature phù hợp để làm ngay vì:
- tutor nhận feedback rõ ràng khi course được duyệt
- giảm tình trạng phải tự kiểm tra thủ công
- tăng tính chuyên nghiệp cho dashboard
- nền tảng notification hiện có đã đủ để mở rộng

Nếu bạn đồng ý, chỉ cần nói: `bạn làm là làm`.
