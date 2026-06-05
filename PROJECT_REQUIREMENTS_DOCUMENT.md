# PROJECT REQUIREMENTS DOCUMENT (PRD)
## IgnitteInductions

**Document Version:** 1.0  
**Last Updated:** June 5, 2026  
**Repository:** [Rupeshkumar-2004/IgnitteInductions](https://github.com/Rupeshkumar-2004/IgnitteInductions)  
**Repository ID:** 1134560423

---

## 1. PROJECT OVERVIEW

### 1.1 Project Name
**IgnitteInductions** - A tech stack solution designed to streamline and optimize the process of club inductions.

### 1.2 Project Description
IgnitteInductions is a web-based platform that serves as a unified tech stack to smooth and facilitate the club induction process. It provides tools and infrastructure for managing club member onboarding, documentation, and workflow automation.

### 1.3 Repository Information
- **Owner:** Rupeshkumar-2004
- **Visibility:** Public
- **License:** ISC
- **Created:** January 14, 2026
- **Default Branch:** main
- **Status:** Active Development (Last push: June 5, 2026)

---

## 2. TECHNOLOGY STACK

### 2.1 Language Composition
| Language | Percentage | Usage |
|----------|-----------|-------|
| JavaScript | 97.1% | Primary language for both frontend and backend |
| CSS | 2.7% | Styling and UI design |
| HTML | 0.2% | Markup structure |

### 2.2 Frontend Stack
- **Framework:** React 19.2.0
- **Build Tool:** Vite 7.2.4
- **Styling:** Tailwind CSS 4.1.18
- **UI Components:** Radix UI (Accordion, Avatar, Checkbox, Dialog, Dropdown, Label, Select, Separator, Slot, Switch, Tabs, Toast, Tooltip)
- **Form Management:** React Hook Form 7.77.0 with Zod validation
- **HTTP Client:** Axios 1.13.2
- **State Management:** TanStack React Query 5.90.18
- **Routing:** React Router DOM 7.12.0
- **Animation:** Framer Motion 12.29.0
- **Icons:** Lucide React 0.562.0
- **Theme Management:** Next Themes 0.4.6
- **Toast Notifications:** Sonner 2.0.7
- **Code Quality:** ESLint 9.39.1
- **Type Safety:** TypeScript support

### 2.3 Backend Stack
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js 5.2.1
- **Database:** MongoDB with Mongoose ODM 9.6.3
- **Authentication:** JWT (jsonwebtoken 9.0.3)
- **Security:** Bcrypt 6.0.0 for password hashing
- **Utilities:** 
  - Cookie Parser 1.4.7
  - CORS 2.8.6
  - Dotenv 17.4.2 for environment variables
  - Zod 4.4.3 for schema validation
- **Development:** Nodemon 3.1.14 for auto-reload

### 2.4 Repository Structure
```
IgnitteInductions/
├── Frontend/
│   └── Ignitte/
│       ├── package.json
│       ├── vite.config.js
│       └── src/
├── Backend/
│   ├── package.json
│   ├── src/
│   │   ├── Index.js (entry point)
│   │   └── scripts/
│   │       └── seedAdmin.js
│   └── .env
└── PROJECT_REQUIREMENTS_DOCUMENT.md
```

---

## 3. FUNCTIONAL REQUIREMENTS

### 3.1 Core Features (Inferred from Tech Stack)
1. **User Authentication & Authorization**
   - User registration and login
   - JWT-based session management
   - Role-based access control (Admin role supported)
   - Password encryption with Bcrypt

2. **Club Member Management**
   - Member profile creation and management
   - Member data persistence in MongoDB
   - Member search and filtering capabilities

3. **Induction Process Workflow**
   - Streamlined onboarding workflow
   - Form-based data collection with validation
   - Progress tracking for induction steps

4. **Dashboard Interface**
   - Responsive web UI built with React
   - Real-time data fetching with React Query
   - Theme switching capability (dark/light mode)
   - Toast notifications for user feedback

5. **API Integration**
   - RESTful API endpoints
   - CORS-enabled for frontend-backend communication
   - Error handling and validation

### 3.2 Data Models (Implied)
- **Users** - User accounts with authentication credentials
- **Members** - Club member profiles and induction data
- **Admin** - Administrative users with elevated privileges

---

## 4. NON-FUNCTIONAL REQUIREMENTS

### 4.1 Performance
- Fast build times with Vite
- Optimized production builds
- Efficient database queries with MongoDB indexes
- Client-side caching with React Query

### 4.2 Security
- Password hashing with Bcrypt
- JWT token-based authentication
- CORS protection for API endpoints
- Environment variable management for sensitive data
- Input validation with Zod schema validation

### 4.3 Scalability
- Modular component architecture
- Database designed for horizontal scaling
- RESTful API for distributed system integration

### 4.4 Code Quality
- ESLint configuration for code standards
- TypeScript support for type safety
- Organized project structure with separation of concerns

### 4.5 Development Experience
- Hot Module Replacement (HMR) with Vite
- Auto-reload with Nodemon
- Easy environment setup with dotenv

---

## 5. USER INTERFACE REQUIREMENTS

### 5.1 UI Components
- Form components with validation feedback
- Dropdown menus and select inputs
- Accordion components for collapsible content
- Dialog modals for confirmations and inputs
- Toast notifications for alerts
- Avatar components for user profiles
- Toggle switches and checkboxes
- Tabs for organizing content
- Tooltips for additional information

### 5.2 Design System
- Tailwind CSS for consistent styling
- Tailwind CSS Animations for smooth transitions
- Class Variance Authority for component variants
- Responsive design for mobile, tablet, and desktop
- Accessibility features via Radix UI

---

## 6. API REQUIREMENTS

### 6.1 Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### 6.2 Member Management Endpoints
- `GET /api/members` - List all members
- `GET /api/members/:id` - Get member details
- `POST /api/members` - Create new member
- `PUT /api/members/:id` - Update member
- `DELETE /api/members/:id` - Delete member

### 6.3 Admin Endpoints
- `POST /api/admin/seed` - Seed admin user (via seedAdmin.js script)

---

## 7. DATABASE REQUIREMENTS

### 7.1 MongoDB Collections
- **Users**
  - userId (unique)
  - email (unique)
  - password (hashed)
  - role (user/admin)
  - createdAt
  - updatedAt

- **Members**
  - memberId (unique)
  - firstName
  - lastName
  - email
  - departmentId
  - inductionStatus
  - createdAt
  - updatedAt

### 7.2 Indexing Strategy
- Index on email fields for quick lookups
- Index on userId for authentication
- Index on inductionStatus for filtering

---

## 8. DEPLOYMENT REQUIREMENTS

### 8.1 Frontend Deployment
- Vite build output: `dist/`
- Hosting: Compatible with static hosting (Vercel, Netlify, GitHub Pages)
- Environment Variables: API endpoint configuration

### 8.2 Backend Deployment
- Node.js runtime required
- Environment Variables:
  - `PORT` - Server port
  - `MONGODB_URI` - Database connection string
  - `JWT_SECRET` - Secret for token signing
  - Database credentials and API keys

### 8.3 Environment Configuration
- `.env` file for local development
- Production environment variables for deployed instances

---

## 9. DEVELOPMENT SETUP

### 9.1 Installation & Running

**Backend Setup:**
```bash
cd Backend
npm install
npm run dev        # Development mode with auto-reload
npm start          # Production mode
npm run seed:admin # Initialize admin user
```

**Frontend Setup:**
```bash
cd Frontend/Ignitte
npm install
npm run dev    # Development server with HMR
npm run build  # Production build
npm run lint   # Code quality check
npm run preview # Preview production build
```

### 9.2 Development Tools
- **Code Formatter:** ESLint for JavaScript/React
- **Version Control:** Git with GitHub
- **Package Manager:** npm
- **Environment Management:** dotenv

---

## 10. TESTING REQUIREMENTS

### 10.1 Current Status
- No test frameworks currently configured
- ESLint used for static code analysis

### 10.2 Recommended Testing Strategy
- **Unit Tests:** Jest for component and utility testing
- **Integration Tests:** API endpoint testing with Supertest
- **E2E Tests:** Cypress or Playwright for user flows

---

## 11. PROJECT METRICS

### 11.1 Repository Statistics
- **Size:** 13.9 MB
- **Stars:** 0
- **Forks:** 0
- **Open Issues:** 0
- **Watchers:** 0
- **Contributors:** 1 (Rupeshkumar-2004)

### 11.2 Development Status
- **Status:** Active
- **Last Update:** June 5, 2026
- **Branch Protection:** Not enabled
- **Auto-merge:** Disabled
- **Discussions:** Not enabled

---

## 12. SUCCESS CRITERIA

The IgnitteInductions platform will be considered successful when:

1. ✅ Users can register and log in securely
2. ✅ Club members can be created and managed efficiently
3. ✅ Induction workflow can be tracked and monitored
4. ✅ The UI is responsive and user-friendly
5. ✅ The API performs reliably with proper error handling
6. ✅ Database operations are optimized and indexed
7. ✅ Code maintains quality standards with ESLint
8. ✅ The system can scale to accommodate multiple club members

---

## 13. FUTURE ENHANCEMENTS

### 13.1 Potential Features
- Email notifications for induction updates
- Batch import of members (CSV upload)
- Analytics dashboard with induction completion rates
- Document management system for induction materials
- Mobile app for native experience
- Multi-club support
- Advanced reporting capabilities
- Integration with external systems

### 13.2 Technology Upgrades
- Implement automated testing (Jest, Cypress)
- Add TypeScript for enhanced type safety
- Database migration tools
- CI/CD pipeline setup
- Docker containerization
- Monitoring and logging solutions

---

## 14. CONSTRAINTS & ASSUMPTIONS

### 14.1 Constraints
- Single organization/club focus (currently)
- MongoDB as primary database
- Node.js and React stack locked

### 14.2 Assumptions
- Users have modern browser support
- MongoDB instance available for deployment
- Server can handle concurrent connections
- Members have valid email addresses

---

## 15. SIGN-OFF

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Project Owner | Rupeshkumar-2004 | June 5, 2026 | - |
| Document Prepared By | GitHub Copilot | June 5, 2026 | - |

---

**End of Document**
