# EduStream Project Documentation

## 1. Introduction
EduStream is a comprehensive E-Learning Marketplace platform designed to connect students with tutors. It facilitates the creation, management, and consumption of online educational content. The platform empowers tutors to monetize their expertise by creating and selling courses, while providing students with a rich, interactive learning experience that includes video lessons, quizzes, assignments, and real-time AI assistance.

## 2. System Overview
The EduStream system follows a modern client-server architecture. 
- **Frontend (Client):** A responsive, server-side rendered web application built with Next.js and Tailwind CSS. It communicates with the backend via RESTful APIs and WebSockets for real-time features.
- **Backend (Server):** A robust Spring Boot application that handles business logic, data persistence, security (authentication/authorization), and integrations with third-party services.
- **Database:** A PostgreSQL database managed via Supabase, storing structured data such as user profiles, course structures, enrollments, and transaction records.
- **External Services:** 
    - **AWS S3:** Used for scalable storage of video content and tutor verification documents.
    - **PayOS:** Integrated for handling secure payment processing.
    - **OpenRouter API:** Powers the "AI Coach," a virtual assistant that helps students answer questions during their learning journey.

## 3. Requirements Analysis

### 3.1 Functional Requirements
- **User Authentication:** Registration, login (Email/Password & Google OAuth), logout, and password recovery.
- **Role-Based Access Control:** Distinct capabilities for Students, Tutors, and Administrators.
- **Course Management (Tutor):** Create, update, submit for review, and manage course content (modules, lessons, quizzes, assignments).
- **Course Discovery & Enrollment (Student):** Browse courses, view details, add to cart, process payments, and enroll.
- **Learning Experience:** Video playback, rich text lessons, submitting assignments, taking quizzes, tracking progress, and communicating via a Q&A forum.
- **Admin Dashboard:** Review and approve/reject tutor profiles and course submissions, manage users across the platform.

### 3.2 Non-Functional Requirements
- **Scalability:** The system must handle concurrent users, especially during video streaming and quiz submissions. (Supported by AWS S3 and Spring Boot's scalable architecture).
- **Security:** Passwords must be hashed (BCrypt). API endpoints must be protected using JWT. Secure payment handling.
- **Usability:** The interface must be intuitive, responsive across devices, and accessible.
- **Performance:** Fast page load times (leveraging Next.js SSR) and efficient database queries.

## 4. System Design

### 4.1 Architecture Pattern
EduStream employs a monolithic backend architecture with a decoupled frontend, adhering to the REST architectural style for client-server communication.

### 4.2 Core Modules
1.  **Authentication Module:** Manages JWT generation, validation, and OAuth synchronization.
2.  **User & Profile Module:** Handles basic user info and specialized Tutor profiles (including verification workflows).
3.  **Course Management Module:** Core engine for creating the hierarchical structure of Courses -> Modules -> Lessons.
4.  **Enrollment & Progress Module:** Tracks which students have access to which courses and their completion status.
5.  **Payment Module:** Integrates with PayOS to generate payment links and process webhook callbacks for order fulfillment.
6.  **Interactive Modules:** Includes Q&A threads, Quizzes, Assignments, and AI Coach integration.

## 5. Technologies Used

### 5.1 Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, Shadcn UI
- **State Management/Data Fetching:** React Hooks, Axios
- **Internationalization:** next-intl

### 5.2 Backend
- **Framework:** Spring Boot 3
- **Language:** Java 21
- **Security:** Spring Security, JWT (JSON Web Tokens)
- **Data Access:** Spring Data JPA, Hibernate
- **Real-time:** Spring WebSocket (STOMP)

### 5.3 Infrastructure & Third-Party
- **Database:** PostgreSQL (Hosted on Supabase)
- **Cloud Storage:** Amazon S3 (Video and Document Storage)
- **Payment Gateway:** PayOS
- **AI Integration:** OpenRouter API (OpenAI compatible)
- **Email Service:** Gmail SMTP

## 6. Main Features

### 6.1 For Students
- **Marketplace Browsing:** Search and filter available courses by category and keywords.
- **Cart & Checkout:** Add multiple courses to a cart and checkout securely via PayOS.
- **Interactive Dashboard:** View enrolled courses and resume learning from the last saved progress.
- **Rich Learning Interface:** Watch videos, read materials, take quizzes, and submit assignments.
- **AI Coach & Q&A:** Get instant help from an AI assistant or ask questions directly to the tutor and peers in the Q&A section.

### 6.2 For Tutors
- **Tutor Onboarding:** Submit professional details and documents for admin verification.
- **Course Builder:** An intuitive interface to construct courses, arrange modules, and upload videos directly to AWS S3.
- **Analytics & Management:** Track course enrollments, revenue, and manage student interactions (Q&A, Announcements).

### 6.3 For Administrators
- **Content Moderation:** Review and approve pending courses before they are published to the marketplace.
- **Tutor Verification:** Review tutor applications and documents to maintain quality standards.
- **User Management:** Oversee all users on the platform.

## 7. Installation Guide

### 7.1 Prerequisites
- Java 21 (JDK)
- Node.js (v18 or higher)
- Maven
- A PostgreSQL database (or Supabase project)
- AWS, PayOS, and OpenRouter API credentials

### 7.2 Backend Setup
1. Navigate to the backend directory: `cd edustream-be`
2. Create a `.env` file in the root directory and populate it with required variables (Database URL, JWT Secret, AWS credentials, PayOS keys, SMTP config).
3. Build and run the application: `./mvnw spring-boot:run`
4. The backend will start on `http://localhost:8080`. Swagger UI is available at `/swagger-ui.html`.

### 7.3 Frontend Setup
1. Navigate to the frontend directory: `cd edustream-fe`
2. Install dependencies: `npm install`
3. Create a `.env.local` file with the required variables (e.g., `NEXT_PUBLIC_API_URL=http://localhost:8080`).
4. Start the development server: `npm run dev`
5. The application will be accessible at `http://localhost:3000`.

## 8. User Guide

### 8.1 Getting Started
- Navigate to the homepage and click "Sign Up".
- Fill in your details. You will automatically be assigned the `STUDENT` role.
- To become a tutor, navigate to your profile and click "Become a Tutor" to start the onboarding process.

### 8.2 Creating a Course (Tutors)
1. Ensure your Tutor Profile is approved by an Admin.
2. Go to the Tutor Dashboard -> Courses -> "Create New Course".
3. Fill in the basic information (Title, Description, Category, Price).
4. Navigate to the "Curriculum" tab to add Modules and Lessons.
5. Upload video content or create text/quiz lessons.
6. Once complete, click "Submit for Review".

### 8.3 Purchasing a Course (Students)
1. Browse the course catalog.
2. Click on a course to view its details, then click "Add to Cart" or "Buy Now".
3. Proceed to checkout. You will be redirected to the PayOS payment gateway.
4. Scan the QR code or use the provided bank details to pay.
5. Upon successful payment, you will be redirected back, and the course will appear in your "My Learning" dashboard.

## 9. Conclusion
EduStream provides a robust, scalable, and feature-rich foundation for online education. By leveraging modern technologies like Next.js, Spring Boot, and cloud services (AWS, Supabase), the platform ensures a seamless experience for all users while maintaining high standards of security and performance.

## 10. Appendices

### Appendix A: Use Case Diagram
*(Note: As this is a text document, please refer to the external UML diagrams provided in the project assets.)*
**Key Actors:** Student, Tutor, Admin, System.
**Key Use Cases:**
- Student: Register, Login, Browse Course, Buy Course, Learn Course, Ask Question.
- Tutor: Submit Profile, Create Course, Upload Content, Answer Question.
- Admin: Approve Tutor, Approve Course, Manage Users.

### Appendix B: Sequence Diagrams
**Example: Course Purchase Flow**
1. Student -> Frontend: Click "Checkout"
2. Frontend -> Backend: `POST /api/payments/create`
3. Backend -> PayOS: Create payment link
4. PayOS -> Backend: Return checkout URL
5. Backend -> Frontend: Return URL
6. Frontend -> Student: Redirect to PayOS
7. Student -> PayOS: Completes payment
8. PayOS -> Backend (Webhook): `POST /api/webhooks/payos`
9. Backend -> DB: Update PaymentTransaction, Create Enrollment
10. Backend -> PayOS: Webhook received acknowledgment.

### Appendix C: Database ERD (Entity Relationship Diagram)
**Core Relationships Summary:**
- `User` (1) --- (1) `TutorProfile`
- `TutorProfile` (1) --- (N) `Course`
- `Course` (1) --- (N) `CourseModule`
- `CourseModule` (1) --- (N) `Lesson`
- `User` (1) --- (N) `Enrollment` (N) --- (1) `Course`
- `Lesson` (1) --- (N) `LessonProgress`
- `Course` (1) --- (N) `Question` (1) --- (N) `QuestionAnswer`
