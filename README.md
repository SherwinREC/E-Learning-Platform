# E-Learn Platform

A lightweight, responsive e-learning web application built with vanilla HTML, CSS, and JavaScript. E-Learn supports three distinct user roles — Learner, Instructor, and Admin — each with their own tailored dashboard experience, all running entirely in the browser with no backend required.

---

## Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Default Credentials](#default-credentials)
- [User Roles](#user-roles)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Roadmap](#roadmap)
- [Contributing](#contributing)

---

## Demo

> Open `index.html` directly in your browser — no server setup needed.

---

## Features

### General
- Single-page application (SPA) with smooth section transitions and fade-in animations
- Fully responsive layout for desktop and mobile
- Sticky glassmorphism header with role-aware navigation
- Client-side authentication with session state management

### Learner
- Personalized dashboard with enrollment stats, completed courses, and overall progress percentage
- Browse and enroll in published courses
- Track lesson-by-lesson progress with animated progress bars
- Unenroll from courses (with progress reset confirmation)
- Take quizzes and receive instant feedback
- Achievement badge system (unlocks based on milestones)
- "Continue Learning" and "Recommended Courses" sections

### Instructor
- Create new courses with title and description
- Toggle courses between **Draft** and **Published** states
- View per-course enrollment counts and learner statistics
- Delete courses they own
- Recent activity feed

### Admin
- Platform-wide overview (total users, total courses, enrollment stats)
- User management panel — view all registered users with role badges
- Promote or change any user's role via prompt dialog
- Visual chart placeholder for enrollment analytics

---

## Project Structure

```
elearn/
├── index.html        # Application shell and all section markup
├── styles.css        # Full styling — layout, components, responsive breakpoints
├── script.js         # All application logic — auth, routing, CRUD, localStorage
└── requirements.txt  # External frontend dependencies and CDN references
```

---

## Getting Started

### Prerequisites

No build tools, package managers, or servers are required.

### Running Locally

1. Clone or download this repository:
   ```bash
   git clone https://github.com/your-username/elearn-platform.git
   cd elearn-platform
   ```

2. Open `index.html` in any modern browser:
   ```bash
   # macOS
   open index.html

   # Linux
   xdg-open index.html

   # Windows
   start index.html
   ```

That's it. The app initialises sample data automatically on first load.

---

## Default Credentials

These accounts are seeded automatically when no data exists in `localStorage`.

| Email | Password | Role |
|---|---|---|
| `admin@elearn.com` | `admin123` | Admin |
| `john.doe@example.com` | `password` | Instructor |
| `jane.smith@example.com` | `password` | Instructor |
| `mike.johnson@example.com` | `password` | Instructor |
| `sarah.wilson@example.com` | `password` | Instructor |
| `david.brown@example.com` | `password` | Instructor |

To create a Learner account, click **Register** and select the **Learner** role.

---

## User Roles

### Learner
Registers and logs in to browse the course catalogue, enroll in courses, track lesson progress, and take quizzes.

### Instructor
Can create and manage their own courses, toggle publish/draft status, and monitor student enrollments.

### Admin
Has full visibility into the platform — all users and all courses — and can change any user's role.

> **Note:** Role is selected at registration time. Admins can later reassign roles from the User Management panel.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Application structure and semantic markup |
| CSS3 | Styling, CSS Grid, Flexbox, animations, responsive design |
| Vanilla JavaScript (ES6+) | Application logic, DOM manipulation, state management |
| localStorage API | Client-side data persistence across sessions |
| Google Fonts (Roboto) | Typography |
| Font Awesome 6 | Icons throughout the UI |

---

## Roadmap

Potential improvements for a production version:

- [ ] Backend API with a real database (e.g. Node.js + PostgreSQL)
- [ ] Secure authentication using JWT or OAuth
- [ ] Rich course content — video embeds, file uploads, multi-lesson structure
- [ ] Dynamic quiz engine with question banks per course
- [ ] PDF certificate generation on course completion
- [ ] Search and filter for the course catalogue
- [ ] Email notifications for enrollment and completion
- [ ] Dark mode toggle

---

## Contributing

Contributions, issues, and feature requests are welcome.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.
