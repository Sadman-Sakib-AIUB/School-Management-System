# 🎓 School Management System API

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v4.18-blue.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v17+-blue.svg)](https://postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-v7+-purple.svg)](https://prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> A comprehensive multi-tenant school management system with role-based access control, academic structure management, attendance tracking, and complete result management with class-wise subject assignment.

---

## 🌟 Key Features

### 🏢 **Multi-Tenant Architecture**
- Multiple schools in single system with complete data isolation
- Institution-level data segregation
- Shared infrastructure with tenant-specific customization

### 🔐 **Advanced Role-Based Access Control (RBAC)**
- **9 Distinct Roles**: Super Admin, Admin, Principal, Vice Principal, Teacher, Student, Parent, Accountant, Librarian
- **Resource-Action Permissions**: VIEW, CREATE, UPDATE, DELETE, MANAGE
- **In-Memory Caching**: Permission caching with 5-minute TTL for optimal performance
- **Dynamic Permissions**: Runtime permission assignment and revocation

### 🏫 **Complete Academic Structure**
- **Academic Classes**: Grade/class management (Class 1-12)
- **Sections**: Multiple sections per class (A, B, Science, Arts, Commerce)
- **Class-Subject Junction**: Flexible subject assignment with class-specific configuration
- **Subject Categorization**: Science, Mathematics, Languages, Social, Commerce, Arts, Religious, Vocational
- **Education Levels**: Primary, Junior, Secondary, Higher Secondary

### 📚 **Robust Subject Management**
- Master subject repository with cross-class reusability
- Class-wise subject assignment with customizable marks
- Compulsory vs Optional subject designation
- Teacher assignment per class-subject combination
- Default marks with per-class override capability
- Support for different marking schemes (100, 75, 50 marks)

### 📝 **Comprehensive Result Management**
- **Exam Management**: Create exams with multiple subjects and custom date ranges
- **Flexible Marking**: Exam-specific marks override for special assessments
- **Result Entry**: Single and bulk result entry with validation
- **Automatic Grading**: Bangladesh education system grading (A+ to F)
- **GPA Calculation**: Automated GPA computation with pass/fail logic
- **Report Cards**: Student-wise detailed report cards with overall results
- **Merit Lists**: Section-wise ranking with performance statistics
- **Subject Analysis**: Detailed analytics with grade distribution and top performers
- **Result Updates**: Modify results with automatic grade recalculation

### 📊 **Attendance Management**
- **Flexible Marking**: Single student or bulk section-wise attendance
- **Status Tracking**: Present, Absent, Late, Leave
- **Daily Summaries**: Real-time attendance statistics per section
- **Student History**: Individual attendance records with date filtering
- **Section Reports**: Monthly attendance reports with percentage calculations
- **Smart Validation**: Weekend detection, future date prevention, historical limits
- **Update Windows**: Teachers (2 days back), Admins (unlimited)

### 👥 **People Management**
- **Students**: Complete profiles with enrollment history and academic records
- **Teachers**: Qualifications, designations, department assignments, salary management
- **Guardians**: Parent/guardian profiles with relationship tracking
- **Multiple Guardians**: Support for multiple guardians per student with primary designation
- **Guardian-Student Linking**: Flexible relationship management (Father, Mother, Legal Guardian, etc.)

### 🔄 **Enrollment System**
- Academic year-based enrollment tracking
- Section transfer capability
- Enrollment status tracking (Active, Transferred, Passed, Dropped)
- Roll number management
- Enrollment history preservation

### 🚀 **Performance Optimizations**
- In-memory permission caching (5-minute TTL)
- Optimized database queries with strategic indexing
- Bulk operations for attendance and results
- Transaction support for data integrity
- Connection pooling with Prisma

---

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Architecture](#️-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Complete API Documentation](#-complete-api-documentation)
- [Database Schema](#️-database-schema)
- [Environment Variables](#-environment-variables)
- [Testing Guide](#-testing-guide)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Quick Start

### Prerequisites
```bash
Node.js v18 or higher
PostgreSQL v14 or higher
npm or yarn
Git
```

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/ASGSHOP/Apars_School_Management_Backend
cd Apars_School_Management_Backend

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env
# Edit .env with your database credentials

# 4. Generate Prisma Client
npx prisma generate

# 5. Run database migrations
npx prisma migrate dev

# 6. Seed initial data (roles, permissions, demo institution)
node prisma/seeds.js

# 7. Start development server
npm run dev
```

The API will be available at `http://localhost:9090`

### Default Credentials

After seeding, login with:
```
Demo Admin:
  Email: admin@demo.com
  Password: admin123
```

---

## 🏗️ Architecture

### System Architecture
```
┌─────────────────────────────────────────────────────────┐
│                  Client Applications                     │
│         (Web Dashboard, Mobile App, etc.)                │
└─────────────────────────────────────────────────────────┘
                          ↓ HTTPS
┌─────────────────────────────────────────────────────────┐
│                   API Gateway Layer                      │
│          (CORS, Helmet, Compression, Rate Limiting)      │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│              Authentication & Authorization              │
│         (JWT, Permission Cache, RBAC Middleware)         │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   Route Layer                            │
│    (Module-based routing with validation middleware)     │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                Controller Layer                          │
│        (Request handling, Response formatting)           │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│              Business Logic Layer (Services)             │
│   (Data validation, Business rules, Calculations)        │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│              Data Access Layer (Prisma ORM)              │
│        (Query optimization, Transaction management)      │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                 Database Layer (PostgreSQL)              │
│       (Multi-tenant data storage with indexes)           │
└─────────────────────────────────────────────────────────┘
```

### Key Design Patterns

1. **Multi-Tenant Strategy**: Shared database with `institutionId` filtering
2. **RBAC Implementation**: Dynamic permissions stored in database, cached in-memory
3. **JWT Approach**: Lightweight tokens (200-300 bytes) with database permission lookups
4. **Academic Structure**: Normalized design (Class → Section → Enrollment)
5. **Class-Subject Junction**: Many-to-many relationship for flexible subject assignment
6. **Transaction Usage**: Critical operations wrapped in database transactions
7. **Modular Architecture**: Feature-based module organization

### Design Decisions

**Why Multi-Tenant Shared Database?**
- Cost-effective for small-medium institutions
- Easier maintenance and updates
- Simple backup and disaster recovery
- Data isolation via `institutionId` filtering

**Why In-Memory Permission Cache?**
- Reduces database queries by 90%+
- 5-minute TTL ensures fresh permissions
- Simple Map-based implementation
- Easy to replace with Redis later

**Why Class-Subject Junction Table?**
- Same subject (e.g., Mathematics) reusable across classes
- Different marks configuration per class (Class 1: 50 marks, Class 10: 100 marks)
- Support for compulsory vs optional subjects
- Teacher assignment per class-subject combination

---

## 💻 Tech Stack

### Backend Core
- **Runtime**: Node.js v18+
- **Framework**: Express.js v4.18
- **Language**: JavaScript (ES6+ with ES Modules)
- **Database**: PostgreSQL v17+
- **ORM**: Prisma v7+
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Security**: bcrypt, helmet, cors
- **Logging**: Custom error handling with AppError

### Development Tools
- **API Testing**: Postman
- **Version Control**: Git & GitHub
- **Code Quality**: ESLint (planned)
- **Formatting**: Prettier (planned)
- **Testing**: Jest, Supertest (planned)
- **Documentation**: Swagger/OpenAPI (planned)

### Database Tools
- **Migration**: Prisma Migrate
- **Seeding**: Custom seed scripts
- **Query Optimization**: Prisma Client with connection pooling

---

## 📁 Project Structure
```
Apars_School_Management_Backend/
├── prisma/
│   ├── schema.prisma              # Complete database schema with 20+ models
│   ├── migrations/                # All database migrations
│   └── seeds.js                   # Seed script (roles, permissions, demo data)
│
├── src/
│   ├── app/
│   │   ├── modules/
│   │   │   ├── auth/              # Authentication & Authorization
│   │   │   │   ├── auth.constants.js
│   │   │   │   ├── auth.service.js
│   │   │   │   ├── auth.controller.js
│   │   │   │   ├── auth.routes.js
│   │   │   │   └── auth.validation.js
│   │   │   │
│   │   │   ├── user/              # User Management
│   │   │   │   ├── user.service.js
│   │   │   │   ├── user.controller.js
│   │   │   │   ├── user.routes.js
│   │   │   │   └── user.validation.js
│   │   │   │
│   │   │   ├── institution/       # Institution Management
│   │   │   │   ├── institution.service.js
│   │   │   │   ├── institution.controller.js
│   │   │   │   ├── institution.routes.js
│   │   │   │   └── institution.validation.js
│   │   │   │
│   │   │   ├── academicClass/     # Academic Class + Class-Subject Management
│   │   │   │   ├── academicClass.service.js
│   │   │   │   ├── academicClass.controller.js
│   │   │   │   ├── academicClass.routes.js
│   │   │   │   └── academicClass.validation.js
│   │   │   │
│   │   │   ├── section/           # Section Management
│   │   │   │   ├── section.service.js
│   │   │   │   ├── section.controller.js
│   │   │   │   ├── section.routes.js
│   │   │   │   └── section.validation.js
│   │   │   │
│   │   │   ├── student/           # Student Management
│   │   │   │   ├── student.service.js
│   │   │   │   ├── student.controller.js
│   │   │   │   ├── student.routes.js
│   │   │   │   └── student.validation.js
│   │   │   │
│   │   │   ├── teacher/           # Teacher Management
│   │   │   │   ├── teacher.service.js
│   │   │   │   ├── teacher.controller.js
│   │   │   │   ├── teacher.routes.js
│   │   │   │   └── teacher.validation.js
│   │   │   │
│   │   │   ├── guardian/          # Guardian Management
│   │   │   │   ├── guardian.service.js
│   │   │   │   ├── guardian.controller.js
│   │   │   │   ├── guardian.routes.js
│   │   │   │   └── guardian.validation.js
│   │   │   │
│   │   │   ├── enrollment/        # Student Enrollment
│   │   │   │   ├── enrollment.service.js
│   │   │   │   ├── enrollment.controller.js
│   │   │   │   ├── enrollment.routes.js
│   │   │   │   └── enrollment.validation.js
│   │   │   │
│   │   │   ├── attendance/        # Attendance Management
│   │   │   │   ├── attendance.constants.js
│   │   │   │   ├── attendance.utils.js
│   │   │   │   ├── attendance.service.js
│   │   │   │   ├── attendance.controller.js
│   │   │   │   ├── attendance.routes.js
│   │   │   │   └── attendance.validation.js
│   │   │   │
│   │   │   └── result/            # Result & Exam Management
│   │   │       ├── result.constants.js
│   │   │       ├── result.utils.js
│   │   │       ├── result.service.js
│   │   │       ├── result.controller.js
│   │   │       ├── result.routes.js
│   │   │       └── result.validation.js
│   │   │
│   │   ├── middlewares/
│   │   │   ├── auth.js            # JWT authentication middleware
│   │   │   ├── permission.js      # RBAC permission checking
│   │   │   ├── validateRequest.js # Zod validation middleware
│   │   │   ├── globalErrorHandler.js
│   │   │   └── notFound.js
│   │   │
│   │   ├── config/
│   │   │   └── database.js        # Prisma client configuration
│   │   │
│   │   ├── utils/
│   │   │   ├── catchAsync.js      # Async error wrapper
│   │   │   ├── sendResponse.js    # Standard response formatter
│   │   │   ├── AppError.js        # Custom error class
│   │   │   └── permissionCache.js # In-memory permission cache
│   │   │
│   │   └── error/
│   │       └── AppError.js        # Application error handling
│   │
│   ├── routes/
│   │   └── index.js               # Central route aggregator
│   │
│   ├── app.js                     # Express app setup
│   └── server.js                  # Server entry point
│
├── .env.example                   # Environment variables template
├── .gitignore                     # Git ignore rules
├── package.json                   # Dependencies and scripts
├── package-lock.json              # Lock file
└── README.md                      # This file
```

### Module Structure Pattern

Each module follows this consistent structure:
```
module/
├── module.constants.js    # Enums, static values, configuration
├── module.utils.js        # Helper functions, calculations
├── module.validation.js   # Zod validation schemas
├── module.service.js      # Business logic, database operations
├── module.controller.js   # Request handlers, response formatting
└── module.routes.js       # Route definitions with middleware
```

---

## 📖 Complete API Documentation

Base URL: `http://localhost:9090/api/v1`

---

### 🔐 **Authentication Module**

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@demo.com",
  "password": "admin123"
}

Response: 200 OK
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "admin@demo.com",
      "username": "admin",
      "roles": ["ADMIN"]
    }
  }
}
```

#### Logout
```http
POST /api/v1/auth/logout
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "message": "Logout successful"
}
```

---

### 🏢 **Institution Module**

#### Create Institution
```http
POST /api/v1/institutions
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Demo High School",
  "code": "DHS001",
  "eiin": "123456",
  "type": "High School",
  "email": "info@demoschool.com",
  "phone": "01711111111",
  "address": "Dhaka, Bangladesh"
}
```

#### Get All Institutions
```http
GET /api/v1/institutions
Authorization: Bearer <token>
```

#### Get Single Institution
```http
GET /api/v1/institutions/:id
Authorization: Bearer <token>
```

#### Update Institution
```http
PATCH /api/v1/institutions/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated School Name",
  "phone": "01722222222"
}
```

#### Delete Institution
```http
DELETE /api/v1/institutions/:id
Authorization: Bearer <token>
```

---

### 🏫 **Academic Class Module**

#### Create Academic Class
```http
POST /api/v1/academic-classes
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Class 7",
  "academicYear": 2025
}
```

#### Get All Academic Classes
```http
GET /api/v1/academic-classes
Authorization: Bearer <token>
```

#### Get Single Academic Class (with subjects)
```http
GET /api/v1/academic-classes/:id
Authorization: Bearer <token>
```

#### Update Academic Class
```http
PATCH /api/v1/academic-classes/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Class 8",
  "academicYear": 2026
}
```

#### Delete Academic Class
```http
DELETE /api/v1/academic-classes/:id
Authorization: Bearer <token>
```

---

### 📚 **Class-Subject Management**

#### Assign Subjects to Class
```http
POST /api/v1/academic-classes/:classId/subjects
Authorization: Bearer <token>
Content-Type: application/json

{
  "subjects": [
    {
      "subjectId": "bangla-subject-uuid",
      "totalMarks": 100,
      "passingMarks": 33,
      "isCompulsory": true
    },
    {
      "subjectId": "math-subject-uuid",
      "totalMarks": 100,
      "passingMarks": 33,
      "isCompulsory": true
    },
    {
      "subjectId": "art-subject-uuid",
      "totalMarks": 50,
      "passingMarks": 17,
      "isCompulsory": false
    }
  ]
}
```

#### Get Class Subjects
```http
GET /api/v1/academic-classes/:classId/subjects
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": {
    "classId": "class-uuid",
    "className": "Class 7",
    "academicYear": 2025,
    "totalSubjects": 6,
    "compulsorySubjects": 4,
    "optionalSubjects": 2,
    "subjects": [...]
  }
}
```

#### Update Class-Subject Configuration
```http
PATCH /api/v1/academic-classes/subjects/:classSubjectId
Authorization: Bearer <token>
Content-Type: application/json

{
  "totalMarks": 75,
  "passingMarks": 25,
  "isCompulsory": true
}
```

#### Remove Subject from Class
```http
DELETE /api/v1/academic-classes/subjects/:classSubjectId
Authorization: Bearer <token>
```

---

### 🚪 **Section Module**

#### Create Section
```http
POST /api/v1/sections
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "A",
  "classId": "class-uuid",
  "shift": "MORNING",
  "capacity": 40
}
```

#### Get All Sections
```http
GET /api/v1/sections
Authorization: Bearer <token>
```

#### Get Single Section
```http
GET /api/v1/sections/:id
Authorization: Bearer <token>
```

#### Update Section
```http
PATCH /api/v1/sections/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "capacity": 50,
  "shift": "DAY"
}
```

#### Delete Section
```http
DELETE /api/v1/sections/:id
Authorization: Bearer <token>
```

---

### 👨‍🎓 **Student Module**

#### Create Student
```http
POST /api/v1/students
Authorization: Bearer <token>
Content-Type: application/json

{
  "studentCode": "STD2025001",
  "fullNameEnglish": "Rahim Ahmed",
  "fullNameBangla": "রহিম আহমেদ",
  "dateOfBirth": "2012-01-15",
  "gender": "MALE",
  "bloodGroup": "A_POSITIVE",
  "phone": "01711111111",
  "address": "Dhaka",
  "email": "rahim@student.com",
  "password": "student123"
}
```

#### Get All Students
```http
GET /api/v1/students
Authorization: Bearer <token>
```

#### Get Single Student
```http
GET /api/v1/students/:id
Authorization: Bearer <token>
```

#### Update Student
```http
PATCH /api/v1/students/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "phone": "01722222222",
  "address": "New Address"
}
```

#### Delete Student
```http
DELETE /api/v1/students/:id
Authorization: Bearer <token>
```

---

### 👨‍🏫 **Teacher Module**

#### Create Teacher
```http
POST /api/v1/teachers
Authorization: Bearer <token>
Content-Type: application/json

{
  "teacherCode": "TCH2025001",
  "fullNameEnglish": "Dr. Karim Hassan",
  "fullNameBangla": "ডঃ করিম হাসান",
  "dateOfBirth": "1985-05-20",
  "gender": "MALE",
  "bloodGroup": "B_POSITIVE",
  "qualification": "PhD in Mathematics",
  "department": "Science",
  "designation": "Senior Teacher",
  "joiningDate": "2020-01-01",
  "phone": "01733333333",
  "email": "karim@teacher.com",
  "password": "teacher123",
  "salary": 50000
}
```

#### Get All Teachers
```http
GET /api/v1/teachers
Authorization: Bearer <token>
```

#### Get Single Teacher
```http
GET /api/v1/teachers/:id
Authorization: Bearer <token>
```

#### Update Teacher
```http
PATCH /api/v1/teachers/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "designation": "Head Teacher",
  "salary": 60000
}
```

#### Delete Teacher
```http
DELETE /api/v1/teachers/:id
Authorization: Bearer <token>
```

---

### 👪 **Guardian Module**

#### Create Guardian
```http
POST /api/v1/guardians
Authorization: Bearer <token>
Content-Type: application/json

{
  "guardianCode": "GRD2025001",
  "fullNameEnglish": "Abdul Rahman",
  "fullNameBangla": "আব্দুল রহমান",
  "phone": "01744444444",
  "email": "rahman@parent.com",
  "address": "Dhaka",
  "occupation": "Business",
  "monthlyIncome": 80000,
  "password": "parent123"
}
```

#### Link Guardian to Student
```http
POST /api/v1/guardians/:guardianId/students
Authorization: Bearer <token>
Content-Type: application/json

{
  "studentId": "student-uuid",
  "relationship": "FATHER",
  "isPrimary": true
}
```

#### Get All Guardians
```http
GET /api/v1/guardians
Authorization: Bearer <token>
```

#### Get Single Guardian
```http
GET /api/v1/guardians/:id
Authorization: Bearer <token>
```

#### Update Guardian
```http
PATCH /api/v1/guardians/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "phone": "01755555555",
  "monthlyIncome": 90000
}
```

#### Delete Guardian
```http
DELETE /api/v1/guardians/:id
Authorization: Bearer <token>
```

---

### 🔄 **Enrollment Module**

#### Enroll Student in Section
```http
POST /api/v1/enrollments
Authorization: Bearer <token>
Content-Type: application/json

{
  "studentId": "student-uuid",
  "sectionId": "section-uuid",
  "academicYear": 2025,
  "rollNumber": "01"
}
```

#### Get All Enrollments
```http
GET /api/v1/enrollments
Authorization: Bearer <token>
```

#### Get Single Enrollment
```http
GET /api/v1/enrollments/:id
Authorization: Bearer <token>
```

#### Update Enrollment
```http
PATCH /api/v1/enrollments/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "rollNumber": "02",
  "status": "ACTIVE"
}
```

#### Transfer Student to Another Section
```http
PATCH /api/v1/enrollments/:id/transfer
Authorization: Bearer <token>
Content-Type: application/json

{
  "newSectionId": "new-section-uuid"
}
```

#### Delete Enrollment
```http
DELETE /api/v1/enrollments/:id
Authorization: Bearer <token>
```

---

### 📊 **Attendance Module**

#### Mark Single Attendance
```http
POST /api/v1/attendance
Authorization: Bearer <token>
Content-Type: application/json

{
  "studentId": "student-uuid",
  "sectionId": "section-uuid",
  "date": "2025-03-14",
  "status": "PRESENT",
  "remarks": "On time"
}
```

#### Bulk Mark Attendance (Entire Section)
```http
POST /api/v1/attendance/bulk
Authorization: Bearer <token>
Content-Type: application/json

{
  "sectionId": "section-uuid",
  "date": "2025-03-14",
  "attendances": [
    {
      "studentId": "student1-uuid",
      "status": "PRESENT"
    },
    {
      "studentId": "student2-uuid",
      "status": "ABSENT",
      "remarks": "Sick leave"
    },
    {
      "studentId": "student3-uuid",
      "status": "LATE"
    }
  ]
}
```

#### Get Today's Attendance Summary
```http
GET /api/v1/attendance/today/summary
Authorization: Bearer <token>
```

#### Get Attendance by Date/Section
```http
GET /api/v1/attendance?date=2025-03-14&sectionId=section-uuid
Authorization: Bearer <token>
```

#### Get Student Attendance History
```http
GET /api/v1/attendance/student/:studentId?startDate=2025-03-01&endDate=2025-03-31
Authorization: Bearer <token>
```

#### Get Section Attendance Report
```http
GET /api/v1/attendance/section/:sectionId/report?month=3&year=2025
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": {
    "section": {
      "id": "section-uuid",
      "name": "A",
      "class": "Class 7"
    },
    "period": {
      "month": 3,
      "year": 2025,
      "totalDays": 20
    },
    "students": [
      {
        "studentId": "student1-uuid",
        "studentName": "Rahim Ahmed",
        "rollNumber": "01",
        "present": 18,
        "absent": 2,
        "late": 0,
        "leave": 0,
        "percentage": 90.0
      }
    ]
  }
}
```

#### Update Attendance
```http
PATCH /api/v1/attendance/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "PRESENT",
  "remarks": "Updated status"
}
```

---

### 📝 **Subject Module**

#### Create Subject
```http
POST /api/v1/results/subjects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "বাংলা",
  "code": "BAN",
  "category": "LANGUAGES",
  "level": "SECONDARY",
  "defaultTotalMarks": 100,
  "defaultPassingMarks": 33,
  "description": "বাংলা ভাষা ও সাহিত্য"
}
```

#### Get All Subjects
```http
GET /api/v1/results/subjects
Authorization: Bearer <token>
```

#### Get Single Subject
```http
GET /api/v1/results/subjects/:id
Authorization: Bearer <token>
```

---

### 📋 **Exam Module**

#### Create Exam
```http
POST /api/v1/results/exams
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Class 7 Midterm Exam 2025",
  "type": "MIDTERM",
  "academicYear": 2025,
  "sectionId": "section-uuid",
  "startDate": "2025-04-01",
  "endDate": "2025-04-10",
  "classSubjects": [
    {
      "classSubjectId": "class7-bangla-junction-id",
      "examDate": "2025-04-01"
    },
    {
      "classSubjectId": "class7-english-junction-id",
      "totalMarks": 200,
      "passingMarks": 66,
      "examDate": "2025-04-02"
    },
    {
      "classSubjectId": "class7-math-junction-id",
      "examDate": "2025-04-03"
    }
  ]
}
```

#### Get All Exams
```http
GET /api/v1/results/exams
Authorization: Bearer <token>
```

#### Get Exams by Section
```http
GET /api/v1/results/exams?sectionId=section-uuid
Authorization: Bearer <token>
```

#### Get Exams by Academic Year
```http
GET /api/v1/results/exams?academicYear=2025
Authorization: Bearer <token>
```

#### Get Single Exam
```http
GET /api/v1/results/exams/:id
Authorization: Bearer <token>
```

---

### 🎯 **Result Module**

#### Enter Single Result
```http
POST /api/v1/results
Authorization: Bearer <token>
Content-Type: application/json

{
  "studentId": "student-uuid",
  "examSubjectId": "exam-subject-uuid",
  "marksObtained": 85,
  "remarks": "Excellent performance"
}
```

#### Bulk Result Entry
```http
POST /api/v1/results/bulk
Authorization: Bearer <token>
Content-Type: application/json

{
  "examSubjectId": "exam-subject-uuid",
  "results": [
    {
      "studentId": "student1-uuid",
      "marksObtained": 85,
      "remarks": "Good"
    },
    {
      "studentId": "student2-uuid",
      "marksObtained": 92,
      "remarks": "Excellent"
    },
    {
      "studentId": "student3-uuid",
      "marksObtained": 78
    }
  ]
}
```

#### Get All Results
```http
GET /api/v1/results
Authorization: Bearer <token>
```

#### Get Results by Exam
```http
GET /api/v1/results?examId=exam-uuid
Authorization: Bearer <token>
```

#### Get Results by Student
```http
GET /api/v1/results?studentId=student-uuid
Authorization: Bearer <token>
```

#### Get Results by Section
```http
GET /api/v1/results?sectionId=section-uuid
Authorization: Bearer <token>
```

#### Get Single Result
```http
GET /api/v1/results/:id
Authorization: Bearer <token>
```

#### Update Result
```http
PATCH /api/v1/results/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "marksObtained": 90,
  "remarks": "Improved performance"
}
```

---

### 📊 **Reports & Analytics**

#### Get Student Report Card
```http
GET /api/v1/results/student/:studentId/exam/:examId
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": {
    "student": {
      "id": "student-uuid",
      "studentCode": "STD2025001",
      "fullName": "Rahim Ahmed",
      "rollNumber": "01"
    },
    "exam": {
      "id": "exam-uuid",
      "name": "Class 7 Midterm Exam 2025",
      "type": "MIDTERM",
      "class": "Class 7",
      "section": "A"
    },
    "subjectResults": [
      {
        "subject": "বাংলা",
        "subjectCode": "BAN",
        "marksObtained": 88,
        "totalMarks": 100,
        "passingMarks": 33,
        "percentage": 88,
        "grade": "A+",
        "gpa": 5.0,
        "remarks": "Excellent"
      }
    ],
    "overallResult": {
      "totalGPA": 19.0,
      "averageGPA": 4.75,
      "overallGrade": "A+",
      "status": "PASS",
      "failedSubjects": []
    }
  }
}
```

#### Get Section Summary (Merit List)
```http
GET /api/v1/results/section/:sectionId/exam/:examId
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": {
    "exam": {
      "name": "Class 7 Midterm Exam 2025",
      "type": "MIDTERM",
      "class": "Class 7",
      "section": "A"
    },
    "statistics": {
      "totalStudents": 30,
      "resultsEntered": 30,
      "passedStudents": 28,
      "failedStudents": 2,
      "passPercentage": 93.33
    },
    "studentResults": [
      {
        "rank": 1,
        "student": {
          "studentCode": "STD2025002",
          "fullNameEnglish": "Fatima Khan"
        },
        "rollNumber": "02",
        "totalObtained": 465,
        "grandTotal": 500,
        "percentage": 93.0,
        "averageGPA": 4.95,
        "overallGrade": "A+",
        "status": "PASS"
      }
    ]
  }
}
```

#### Get Subject-wise Analysis
```http
GET /api/v1/results/exam/:examId/subject/:examSubjectId/analysis
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": {
    "exam": {
      "name": "Class 7 Midterm Exam 2025",
      "class": "Class 7",
      "section": "A"
    },
    "subject": {
      "name": "গণিত",
      "code": "MATH",
      "totalMarks": 100,
      "passingMarks": 33
    },
    "statistics": {
      "totalStudents": 30,
      "passCount": 28,
      "failCount": 2,
      "passPercentage": 93.33,
      "highestMarks": 98,
      "lowestMarks": 25,
      "averageMarks": 76.5
    },
    "gradeDistribution": {
      "A+": 12,
      "A": 8,
      "A-": 5,
      "B": 3,
      "F": 2
    },
    "topPerformers": [
      {
        "rank": 1,
        "studentCode": "STD2025010",
        "studentName": "Samir Khan",
        "marksObtained": 98,
        "percentage": 98,
        "grade": "A+",
        "gpa": 5.0
      }
    ]
  }
}
```

---

### 👤 **User Module**

#### Create User
```http
POST /api/v1/users
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "newadmin",
  "email": "newadmin@school.com",
  "password": "SecurePass123",
  "roles": ["ADMIN"]
}
```

#### Get All Users
```http
GET /api/v1/users
Authorization: Bearer <token>
```

#### Get Single User
```http
GET /api/v1/users/:id
Authorization: Bearer <token>
```

#### Update User
```http
PATCH /api/v1/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "isActive": "ACTIVE"
}
```

#### Delete User
```http
DELETE /api/v1/users/:id
Authorization: Bearer <token>
```

---

## 🗄️ Database Schema

### Core Entities

#### Institution
```prisma
model Institution {
  id     String            @id @default(uuid())
  name   String
  code   String            @unique
  eiin   String?           @unique
  status InstitutionStatus @default(ACTIVE)
  type   String?
  email  String?
  phone  String?
  address String?
  
  users           User[]
  students        Student[]
  teachers        Teacher[]
  guardians       Guardian[]
  academicClasses AcademicClass[]
  sections        Section[]
  attendances     Attendance[]
  subjects        Subject[]
  exams           Exam[]
  results         Result[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("institutions")
}
```

#### User
```prisma
model User {
  id       String     @id @default(uuid())
  username String     @unique
  email    String     @unique
  password String
  isActive UserStatus @default(ACTIVE)
  
  institutionId String?
  institution   Institution?
  
  userRoles UserRole[]
  student   Student?
  teacher   Teacher?
  guardian  Guardian?
  
  markedAttendances Attendance[]
  enteredResults    Result[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("users")
}
```

#### Role & Permissions
```prisma
model Role {
  id          String   @id @default(uuid())
  name        RoleName @unique
  description String?
  
  userRoles   UserRole[]
  permissions RolePermission[]
  
  @@map("roles")
}

model RolePermission {
  id       String             @id @default(uuid())
  roleId   String
  resource Resource
  actions  PermissionAction[]
  
  role Role @relation(fields: [roleId], references: [id])
  
  @@unique([roleId, resource])
  @@map("role_permissions")
}
```

#### Academic Structure
```prisma
model AcademicClass {
  id   String @id @default(uuid())
  name String
  academicYear Int
  
  institutionId String
  institution   Institution
  
  sections       Section[]
  classSubjects  AcademicClassSubject[]
  
  @@unique([name, institutionId, academicYear])
  @@map("academic_classes")
}

model Section {
  id       String       @id @default(uuid())
  name     String
  shift    SectionShift @default(MORNING)
  capacity Int          @default(40)
  
  classId String
  class   AcademicClass
  
  enrollments StudentEnrollment[]
  attendances Attendance[]
  exams       Exam[]
  
  @@unique([name, classId])
  @@map("sections")
}
```

#### Subject Management
```prisma
model Subject {
  id   String @id @default(uuid())
  name String
  code String
  
  defaultTotalMarks   Int @default(100)
  defaultPassingMarks Int @default(33)
  
  category    SubjectCategory?
  level       EducationLevel?
  description String?
  
  institutionId String
  institution   Institution
  
  classSubjects AcademicClassSubject[]
  
  @@unique([code, institutionId])
  @@map("subjects")
}

model AcademicClassSubject {
  id String @id @default(uuid())
  
  classId   String
  class     AcademicClass
  
  subjectId String
  subject   Subject
  
  totalMarks   Int     @default(100)
  passingMarks Int     @default(33)
  isCompulsory Boolean @default(true)
  
  teacherId String?
  teacher   Teacher?
  
  examSubjects ExamSubject[]
  
  @@unique([classId, subjectId])
  @@map("academic_class_subjects")
}
```

#### Student & Enrollment
```prisma
model Student {
  id              String      @id @default(uuid())
  studentCode     String      @unique
  fullNameBangla  String?
  fullNameEnglish String
  dateOfBirth     DateTime
  gender          Gender
  bloodGroup      BloodGroup?
  phone           String?
  address         String?
  
  userId        String @unique
  user          User
  
  institutionId String
  institution   Institution
  
  guardianStudents GuardianStudent[]
  enrollments      StudentEnrollment[]
  attendances      Attendance[]
  results          Result[]
  
  @@map("students")
}

model StudentEnrollment {
  id String @id @default(uuid())
  
  studentId String
  student   Student
  
  sectionId String
  section   Section
  
  academicYear Int
  rollNumber   String?
  status       EnrollmentStatus @default(ACTIVE)
  
  @@unique([studentId, academicYear])
  @@map("student_enrollments")
}
```

#### Attendance
```prisma
model Attendance {
  id String @id @default(uuid())
  
  studentId String
  student   Student
  
  sectionId String
  section   Section
  
  date   DateTime         @db.Date
  status AttendanceStatus
  remarks String?
  
  markedById String
  markedBy   User
  
  institutionId String
  institution   Institution
  
  @@unique([studentId, date])
  @@index([sectionId, date])
  @@map("attendances")
}
```

#### Exam & Results
```prisma
model Exam {
  id   String   @id @default(uuid())
  name String
  type ExamType
  
  academicYear Int
  
  sectionId String
  section   Section
  
  startDate DateTime @db.Date
  endDate   DateTime @db.Date
  
  institutionId String
  institution   Institution
  
  examSubjects ExamSubject[]
  
  @@map("exams")
}

model ExamSubject {
  id String @id @default(uuid())
  
  examId String
  exam   Exam
  
  classSubjectId String
  classSubject   AcademicClassSubject
  
  totalMarks   Int?
  passingMarks Int?
  examDate     DateTime? @db.Date
  
  results Result[]
  
  @@unique([examId, classSubjectId])
  @@map("exam_subjects")
}

model Result {
  id String @id @default(uuid())
  
  studentId String
  student   Student
  
  examSubjectId String
  examSubject   ExamSubject
  
  marksObtained Float
  grade         String
  gpa           Float
  remarks       String?
  
  enteredById String
  enteredBy   User
  
  institutionId String
  institution   Institution
  
  @@unique([studentId, examSubjectId])
  @@map("results")
}
```

### Enums
```prisma
enum RoleName {
  SUPER_ADMIN
  ADMIN
  PRINCIPAL
  VICE_PRINCIPAL
  TEACHER
  STUDENT
  PARENT
  ACCOUNTANT
  LIBRARIAN
}

enum Resource {
  INSTITUTION
  USER
  STUDENT
  TEACHER
  GUARDIAN
  ATTENDANCE
  RESULT
  EXAM
  SUBJECT
  LIBRARY
  ACCOUNT
  REPORT
  ACADEMIC_CLASS
  SECTION
  ENROLLMENT
}

enum PermissionAction {
  VIEW
  CREATE
  UPDATE
  DELETE
  MANAGE
}

enum AttendanceStatus {
  PRESENT
  ABSENT
  LATE
  LEAVE
}

enum ExamType {
  CLASS_TEST
  MIDTERM
  FINAL
  TERM_END
  WEEKLY_TEST
}

enum SubjectCategory {
  SCIENCE
  MATHEMATICS
  LANGUAGES
  SOCIAL
  COMMERCE
  ARTS
  GENERAL
  VOCATIONAL
  RELIGIOUS
}

enum EducationLevel {
  PRIMARY
  JUNIOR
  SECONDARY
  HIGHER_SECONDARY
}

enum EnrollmentStatus {
  ACTIVE
  TRANSFERRED
  PASSED
  DROPPED
}

enum Gender {
  MALE
  FEMALE
  OTHER
}

enum BloodGroup {
  A_POSITIVE
  A_NEGATIVE
  B_POSITIVE
  B_NEGATIVE
  AB_POSITIVE
  AB_NEGATIVE
  O_POSITIVE
  O_NEGATIVE
}
```

### Database Migrations
```bash
# Generate Prisma Client after schema changes
npx prisma generate

# Create new migration
npx prisma migrate dev --name migration_name

# Apply migrations to production
npx prisma migrate deploy

# Reset database (development only - WARNING: deletes all data)
npx prisma migrate reset

# View migration status
npx prisma migrate status
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:
```env
# Server Configuration
NODE_ENV=development
PORT=9090

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/school_management_db?schema=public"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
JWT_EXPIRES_IN=1d
REFRESH_TOKEN_SECRET=your-refresh-token-secret-change-this-in-production
REFRESH_TOKEN_EXPIRES_IN=7d

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Bcrypt Configuration
BCRYPT_SALT_ROUNDS=10

# Logging
LOG_LEVEL=debug
```

### Environment Variable Details

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Application environment | `development` | Yes |
| `PORT` | Server port | `9090` | Yes |
| `DATABASE_URL` | PostgreSQL connection string | - | Yes |
| `JWT_SECRET` | Secret key for JWT signing | - | Yes |
| `JWT_EXPIRES_IN` | Access token expiration | `1d` | Yes |
| `REFRESH_TOKEN_SECRET` | Refresh token secret | - | Yes |
| `REFRESH_TOKEN_EXPIRES_IN` | Refresh token expiration | `7d` | Yes |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins | - | Yes |
| `BCRYPT_SALT_ROUNDS` | Password hashing rounds | `10` | No |

**⚠️ Security Notes:**
- Never commit `.env` file to version control
- Use strong, random secrets in production (minimum 32 characters)
- Rotate secrets regularly
- Use different secrets for different environments

---

## 🧪 Testing Guide

### Running Tests
```bash
# Install testing dependencies
npm install --save-dev jest supertest

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- auth.test.js
```

### Test Structure
```
tests/
├── integration/
│   ├── auth.test.js
│   ├── student.test.js
│   ├── attendance.test.js
│   └── result.test.js
├── unit/
│   ├── services/
│   │   ├── auth.service.test.js
│   │   └── result.service.test.js
│   └── utils/
│       ├── gradeCalculation.test.js
│       └── permissionCache.test.js
└── e2e/
    └── studentJourney.test.js
```

### Sample Test (Integration Test)
```javascript
// tests/integration/auth.test.js
import request from 'supertest';
import app from '../../src/app.js';

describe('Authentication API', () => {
  describe('POST /api/v1/auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'admin@demo.com',
          password: 'admin123'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data.user).toHaveProperty('email', 'admin@demo.com');
    });

    it('should fail with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'admin@demo.com',
          password: 'wrongpassword'
        });
      
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
```

### Testing Checklist

- [ ] Unit tests for utility functions (grade calculation, date validation)
- [ ] Unit tests for services (business logic)
- [ ] Integration tests for API endpoints
- [ ] E2E tests for critical user flows
- [ ] Permission tests for RBAC
- [ ] Database transaction tests
- [ ] Error handling tests

### Test Coverage Goals

- **Overall Coverage**: 80%+
- **Critical Paths**: 100% (authentication, enrollment, result calculation)
- **Business Logic**: 90%+
- **Controllers**: 70%+

---

## 🚀 Deployment

### Production Checklist

#### Pre-Deployment

- [ ] Set `NODE_ENV=production`
- [ ] Update `DATABASE_URL` to production database
- [ ] Change `JWT_SECRET` and `REFRESH_TOKEN_SECRET` to strong random values
- [ ] Configure `ALLOWED_ORIGINS` for your production frontend
- [ ] Set up SSL/HTTPS certificates
- [ ] Configure environment-specific logging
- [ ] Set up database backups
- [ ] Configure monitoring and alerting
- [ ] Test all critical flows in staging environment

#### Database Setup
```bash
# 1. Create production database
createdb school_management_prod

# 2. Run migrations
npx prisma migrate deploy

# 3. Seed initial data (roles, permissions)
node prisma/seeds.js
```

#### Server Deployment Options

##### Option 1: Railway
```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Initialize project
railway init

# 4. Add PostgreSQL
railway add postgresql

# 5. Deploy
railway up
```

##### Option 2: Render
```bash
# 1. Create render.yaml
services:
  - type: web
    name: school-api
    env: node
    buildCommand: npm install && npx prisma generate
    startCommand: npm start
  - type: pserv
    name: school-db
    region: singapore
    plan: starter
```

##### Option 3: DigitalOcean App Platform
```bash
# 1. Install doctl
# 2. Connect GitHub repository
# 3. Configure build and run commands
# 4. Add PostgreSQL database
# 5. Deploy
```

#### Environment Variables (Production)
```env
NODE_ENV=production
PORT=9090
DATABASE_URL=<production-database-url>
JWT_SECRET=<strong-random-secret-min-64-chars>
JWT_EXPIRES_IN=12h
REFRESH_TOKEN_SECRET=<another-strong-random-secret>
REFRESH_TOKEN_EXPIRES_IN=7d
ALLOWED_ORIGINS=https://yourfrontend.com
BCRYPT_SALT_ROUNDS=12
```

#### Post-Deployment

- [ ] Verify all API endpoints are working
- [ ] Test authentication flow
- [ ] Verify database connections
- [ ] Check logs for errors
- [ ] Monitor performance metrics
- [ ] Set up automated backups
- [ ] Configure CDN (if applicable)
- [ ] Enable rate limiting
- [ ] Set up SSL renewal automation

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/Apars_School_Management_Backend`
3. Create a feature branch: `git checkout -b feature/amazing-feature`
4. Make your changes
5. Commit with meaningful messages: `git commit -m 'Add amazing feature'`
6. Push to your branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Coding Standards

- **JavaScript Style**: ES6+ with ES Modules
- **Naming Conventions**:
  - Files: `camelCase.js` (e.g., `auth.service.js`)
  - Functions: `camelCase` (e.g., `createStudent`)
  - Constants: `UPPER_SNAKE_CASE` (e.g., `JWT_SECRET`)
  - Classes: `PascalCase` (e.g., `AppError`)
- **Comments**: Write clear, concise comments for complex logic
- **Error Handling**: Always use try-catch with AppError
- **Validation**: Use Zod for all request validation
- **Transactions**: Wrap multi-step operations in Prisma transactions

### Module Development Guidelines

When adding a new module:
```
1. Create module folder: src/app/modules/moduleName/
2. Add files in this order:
   - moduleName.constants.js (if needed)
   - moduleName.utils.js (if needed)
   - moduleName.validation.js
   - moduleName.service.js
   - moduleName.controller.js
   - moduleName.routes.js
3. Export routes in src/routes/index.js
4. Update README.md with new endpoints
5. Add tests for new functionality
```

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Example:**
```
feat(result): Add bulk result entry endpoint

- Implement bulk result entry service
- Add validation for bulk results
- Update result routes and controller

Closes #123
```

### Pull Request Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated and passing
- [ ] Dependent changes merged
- [ ] Checked on multiple environments

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```
MIT License

Copyright (c) 2025 Apars School Management System

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📞 Support & Contact

- **GitHub Issues**: [Report a bug](https://github.com/ASGSHOP/Apars_School_Management_Backend/issues)
- **Email**: support@aparschool.com
- **Documentation**: [Wiki](https://github.com/ASGSHOP/Apars_School_Management_Backend/wiki)

---

## 🙏 Acknowledgments

- [Prisma](https://prisma.io) - Next-generation ORM
- [Express.js](https://expressjs.com) - Web framework
- [PostgreSQL](https://postgresql.org) - Database
- [JWT](https://jwt.io) - Authentication
- [Zod](https://zod.dev) - Validation library
- Bangladesh Education Board - Grading system reference

---

## 📊 Project Stats

![GitHub Stars](https://img.shields.io/github/stars/ASGSHOP/Apars_School_Management_Backend?style=social)
![GitHub Forks](https://img.shields.io/github/forks/ASGSHOP/Apars_School_Management_Backend?style=social)
![GitHub Issues](https://img.shields.io/github/issues/ASGSHOP/Apars_School_Management_Backend)
![GitHub Pull Requests](https://img.shields.io/github/issues-pr/ASGSHOP/Apars_School_Management_Backend)
![Last Commit](https://img.shields.io/github/last-commit/ASGSHOP/Apars_School_Management_Backend)

---

**Built with ❤️ for the Bangladesh Education System**