# JobKart – Role-Based Job Application Management System

Live Demo: [Hosted on Render](#)  
Tech Stack: MongoDB, Express.js, Node.js, EJS, Bootstrap

## Overview

JobKart is a full-stack web application that streamlines the job hiring process with clear role separation between Recruiters and Job Seekers. It features a secure authentication system, intuitive UI, and smooth workflows across the platform.

As a BCA student exploring full-stack web development, I built this project to implement real-world concepts like session-based authentication, file handling, and role-specific access control.

## Authentication & Authorization

- Session-based login using Passport.js (local strategy)
- Role-based route protection with express-session and connect-mongo
- All routes restricted based on user roles to prevent unauthorized access

## Key Features

### Job Seekers

- Browse available jobs and apply with resume upload
- Include a reason for application while applying
- View and manage applied jobs via a dedicated dashboard
- Unregister or edit applications before final status update

### Recruiters

- Post new job listings and edit existing ones
- View list of applicants for each job with their resume and reason
- Update application status (Accepted, Rejected, Pending) directly from dashboard

## Highlights

- Responsive dark-themed UI built with Bootstrap and CSS3
- Frontend form validation using Bootstrap validation classes
- Custom backend validation to reject empty or malformed submissions
- RESTful APIs with separate logic for each user role
- Protected routes prevent role spoofing and unauthorized operations
- Secure profile page showing user information in a read-only format
- Resume upload handled via Multer and stored securely

## Tech Stack

Frontend: EJS, HTML5, CSS3, Bootstrap, JavaScript  
Backend: Node.js, Express.js (RESTful APIs)  
Database: MongoDB, Mongoose  
Authentication: Passport.js (local strategy), express-session  
File Uploads: Multer  
Security: dotenv, cookie-parser, manual input validation  
Deployment: Render

## About Me

I'm a self-taught MERN Stack Developer currently pursuing BCA. This project demonstrates my skills in secure backend development, session management, and dynamic frontend rendering. I’m actively looking for part-time internships, freelance projects, or open-source collaboration opportunities.

## Connect with Me

LinkedIn: [https://www.linkedin.com/in/navmeshsrivastava]  
GitHub: [https://github.com/navmeshsrivastava]  
Email: [navmeshsrivastav815@gmail.com]
