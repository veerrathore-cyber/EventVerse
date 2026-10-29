# 🎟️ EventVerse - Event & Hackathon Booking Platform

A professional full-stack MERN application for managing and booking college events and hackathons. Built with a clean UI and role-based access control for Admins and Students.

## ✨ Key Features
- **Role-Based Access:** Separate views and permissions for 'Admin' and 'Student'.
- **Admin Dashboard:** Admins can create new events and track the real-time list (Name & Email) of registered students for each event.
- **Student Portal:** Students can browse events, book seats (if available), and cancel their bookings.
- **My Collection:** A dedicated private dashboard for students to view all their successfully booked events.
- **Authentication:** Secure Login & Registration system using JWT (JSON Web Tokens).
- **Pagination & Sorting:** Clean page-by-page navigation for the events list, sorted by date.

## 💻 Tech Stack
- **Frontend:** React.js (Vite), React Router DOM, Axios, Custom CSS (Modern UI)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT & Browser LocalStorage

## 🚀 How to Run the Project Locally

### 1. Clone the Repository
```text
git clone [https://github.com/your-username/EventVerse-MERN.git](https://github.com/your-username/EventVerse-MERN.git)
cd EventVerse-MERN

### 2. Setup the Backend (Terminal 1)
```text
Bash
cd Server
npm install
node index.js

### 3. Setup the Frontend (Terminal 2)
```text
cd Client
npm install
npm run dev
(Once both servers are running, open your browser and go to the localhost:5173 link provided by Vite to view the application).
