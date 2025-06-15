# JobKart – Role-Based Job Application Management System

🔗 **Live Demo**: [JobKart on Render](https://jobkart-p3wc.onrender.com/)

---

## 📝 Overview

JobKart is a full-stack web application that streamlines the job hiring process with clear role separation between **Recruiters** and **Job Seekers**. It features a secure authentication system, intuitive UI, and smooth workflows across the platform.

As a BCA student exploring full-stack web development, I built this project to implement real-world concepts like session-based authentication, file handling, and role-specific access control.

---

## 🔐 Authentication & Authorization

- Session-based login using **Passport.js** (local strategy)
- Role-based route protection using **express-session** and **connect-mongo**
- Routes strictly restricted based on user roles to prevent unauthorized access

---

## ✨ Key Features

### 👤 Job Seekers

- Browse job listings and apply with resume upload
- Add a reason for application while applying
- View, edit, or withdraw applications from a personalized dashboard
- Track application status updates (Pending, Accepted, Rejected)

### 🧑‍💼 Recruiters

- Post and manage job listings
- View applicant details (resume, application reason)
- Accept or reject applicants from a unified dashboard

---

## 🌟 Highlights

- Fully responsive dark-themed UI using **Bootstrap** and **CSS3**
- Client-side validation via Bootstrap’s built-in validation classes
- Backend validation to reject empty or malformed inputs
- RESTful routing and logic separation by user role
- Role spoofing prevention with session and route protection
- Secure profile page displaying authenticated user data in read-only mode
- Resume uploads handled securely via **Multer**

---

## 🧰 Tech Stack

**Frontend:**  
EJS, HTML5, CSS3, Bootstrap, JavaScript  

**Backend:**  
Node.js, Express.js (RESTful APIs)  

**Database:**  
MongoDB, Mongoose  

**Authentication:**  
Passport.js (local strategy), express-session, connect-mongo  

**File Uploads:**  
Multer  

**Security:**  
dotenv, cookie-parser, manual input validation  

**Deployment:**  
Render  

---

## About Me

I'm a self-taught full-stack web developer and current BCA student with a focus on building scalable, user-focused applications. JobKart was built to implement real-world features like session-based authentication, role-based access, and secure file handling. I'm open to part-time internships, freelance work, and open-source collaborations.

## Connect with Me

LinkedIn: [https://www.linkedin.com/in/navmeshsrivastava]  
GitHub: [https://github.com/navmeshsrivastava]  
Email: [navmeshsrivastav815@gmail.com]
