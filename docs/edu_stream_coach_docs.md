# Tài liệu kỹ thuật: EduStream Coach AI Assistant

## 1. Tổng quan (Overview)
**EduStream Coach** là một trợ lý ảo thông minh (AI Chatbot) được tích hợp trực tiếp vào từng khóa học. Nhiệm vụ chính là hỗ trợ học viên giải đáp các thắc mắc về nội dung bài giảng, bài tập và các khái niệm liên quan trong phạm vi tri thức của khóa học đó.

---

## 2. Nguyên lý hoạt động (How it works)
Hệ thống sử dụng mô hình **RAG (Retrieval-Augmented Generation)** đơn giản để đảm bảo tính chính xác:

1.  **Thu thập dữ liệu (Retrieval):** Khi nhận được câu hỏi, hệ thống sẽ truy vấn Database để lấy toàn bộ tiêu đề, mô tả và nội dung văn bản của tất cả các bài giảng trong khóa học đó.
2.  **Tạo bối cảnh (Contextualization):** Toàn bộ dữ liệu này được gộp lại thành một "Cơ sở tri thức" (Knowledge Base) tạm thời.
3.  **Xử lý qua AI (Generation):** Gửi cơ sở tri thức này cùng với câu hỏi của người dùng tới mô hình ngôn ngữ lớn (LLM - GPT-3.5/4) với các quy tắc nghiêm ngặt.

---

## 3. Kỹ thuật Prompt Engineering
Trái tim của hệ thống nằm ở **System Prompt**. Chúng ta thiết lập các "rào chắn" (Guardrails) để AI không trả lời ngoài lề:
*   **Vai trò:** AI đóng vai trò là một gia sư nhiệt tình.
*   **Phạm vi:** Chỉ được sử dụng thông tin từ `COURSE CONTENT` được cung cấp.
*   **Từ chối:** Nếu câu hỏi không nằm trong nội dung khóa học, AI buộc phải từ chối lịch sự bằng một mẫu câu cố định.
*   **Độ sáng tạo (Temperature):** Thiết lập ở mức `0.3` để giảm thiểu sự "ảo giác" (Hallucination) và tăng tính chính xác.

---

## 4. Cấu trúc các thành phần (Architecture)

### Backend (Spring Boot)
- **`AICoachController`**: Tiếp nhận yêu cầu tại `/api/ai/coach/chat`.
- **`AICoachService`**: Xử lý logic thu thập context từ DB và giao tiếp với OpenAI API.
- **`AIChatRequest/Response`**: Các đối tượng chứa dữ liệu đầu vào/đầu ra.
- **`RestTemplateConfig`**: Cấu hình để Java có thể gọi các API bên ngoài.

### Frontend (Next.js)
- **`aiService.ts`**: Lớp dịch vụ gọi API Backend.
- **`AICoachChat.tsx`**: Component giao diện Chat nổi (Floating Widget).
  - Sử dụng **Optimistic UI** (hiện tin nhắn ngay lập tức).
  - Tự động cuộn (Auto-scroll) và trạng thái Loading ("Thinking...").

---

## 5. Hướng dẫn cấu hình (Configuration)

### Biến môi trường (.env)
Thêm API Key vào file `.env` ở Backend:
```env
OPENAI_API_KEY=sk-xxx...
```

### Cấu hình hệ thống (application.yaml)
Các tham số có thể điều chỉnh:
```yaml
openai:
  api:
    key: ${OPENAI_API_KEY}
    url: https://api.openai.com/v1/chat/completions # URL OpenAI
```

---

## 6. Quy trình mở rộng (Future Roadmap)
*   **Vector Database:** Nếu nội dung khóa học quá lớn (hàng triệu từ), nên chuyển sang dùng Pinecone hoặc Supabase Vector để tìm kiếm nội dung liên quan thay vì gửi toàn bộ giáo án.
*   **Video Transcripts:** Tích hợp thêm nội dung từ Video (chuyển âm thanh thành văn bản) để AI có thể giải đáp chi tiết hơn.
*   **Streaming Response:** Nâng cấp API để AI trả lời theo thời gian thực (chữ chạy ra từng từ) thay vì đợi phản hồi toàn bộ.

---
*Tài liệu được soạn thảo bởi EduStream AI Implementation Team.*
