# SecureAuthProject 🔐
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

![Node.js](https://img.shields.io/badge/Node.js-18-green)
![Express](https://img.shields.io/badge/Express-4.x-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## Table of Contents
- [Overview](#overview)
- [Objectives](#objectives)
- [Features](#features)
- [Architecture](#architecture)
- [Installation & Usage](#installation--usage)
- [Deployment](#deployment)
- [Security Measures](#security-measures)
- [Future Improvements](#future-improvements)
- [Credits](#credits)
- [License](#license)

---

## Overview
SecureAuthProject is a secure authentication system built with **Node.js, Express, and MongoDB Atlas**.  
It demonstrates modern cyber security practices including password hashing, session management, rate limiting, and input validation.  
This project was developed as part of the **Cyber Security Major Project (EdiGlobe)**.

---

## Objectives
- Design and deploy a secure authentication system resistant to common web attacks.  
- Gain hands‑on experience with web security, deployment, and defensive coding.  
- Showcase practical implementation of authentication and protection mechanisms.

---

## Features
- User registration and login  
- Password hashing with **bcrypt**  
- Session management with secure cookies  
- Rate limiting to prevent brute force attacks  
- Input validation with **express-validator**  
- Security headers with **Helmet**  
- Protected routes (Profile, Logout)  

---

## Architecture
- **Frontend**: EJS templates + Bootstrap for UI polish  
- **Backend**: Express routes, middleware, session handling  
- **Database**: MongoDB Atlas cluster  
- **Security Layer**: bcrypt, Helmet, rate limiting, input validation  

---

## Installation & Usage
Clone the repository and install dependencies:

```bash
git clone https://github.com/chaitanya554-11/SecureAuthProject.git
cd SecureAuthProject
npm install
npm start
```
---

##Deployment
This project is deployed on Render.
Live demo: https://secureauthproject.onrender.com

##Security Measures
-Password hashing with bcrypt
-Rate limiting to prevent brute force login attempts
-Input validation against injection attacks
-Helmet for secure HTTP headers
-Session protection with httpOnly cookies

##Future Improvements
-CSRF protection
-HTTPS enforcement
-Forgot Password flow
-Role‑based access control

##Credits
-Author:Lakkoju Chandra Chaitanya
-Email:cmt.chaitanya554@gmail.com
-Institution: EdiGlobe Cyber Security Major Project

## License
This project is licensed under the **MIT License**. See [LICENSE](LICENSE).
