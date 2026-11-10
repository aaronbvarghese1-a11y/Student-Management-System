# Student Management System

A full-stack web application to manage students, built with Spring Boot, MySQL, HTML, CSS and JavaScript.

## Features

- User registration and login (passwords stored as BCrypt hashes)
- Dashboard with total students, total courses and student details
- Add, view, update and delete students
- Search students by name or ID
- Responsive, modern design

## Tech Stack

- **Backend:** Java, Spring Boot, Spring Web, Spring Data JPA
- **Database:** MySQL
- **Frontend:** HTML, CSS, JavaScript

## How to Run

1. Install JDK 17 or newer and MySQL.
2. Create the database in MySQL:
   ```sql
   CREATE DATABASE student_management;
   ```
3. In `src/main/resources`, copy `application.properties.example` to `application.properties` and put your MySQL password in it.
4. Run the app from the project folder:
   ```
   ./mvnw spring-boot:run
   ```
5. Open `http://localhost:8080/login.html` in your browser.

## REST API

| Action | Method | URL |
|---|---|---|
| Add student | POST | `/api/students` |
| View all students | GET | `/api/students` |
| Get one student | GET | `/api/students/{id}` |
| Update student | PUT | `/api/students/{id}` |
| Delete student | DELETE | `/api/students/{id}` |
| Search | GET | `/api/students/search?keyword=...` |
| Count | GET | `/api/students/count` |
| Register | POST | `/api/auth/register` |
| Login | POST | `/api/auth/login` |

## Note

This is a learning project. Login state is kept in the browser and the student APIs are not protected. Spring Security with JWT would be the next improvement.
