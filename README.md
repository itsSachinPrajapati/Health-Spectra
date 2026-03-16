# HealthSpectra

HealthSpectra is an AI-assisted healthcare consultation platform that connects patients with doctors and provides intelligent medical guidance through AI tools. The system allows users to describe symptoms, receive AI suggestions, consult specialists, and book appointments through an integrated dashboard.

The platform consists of a **patient web application**, a **doctor portal**, and a **Python backend API** connected to a **MySQL database**.

---

# Live Architecture

Patient Platform
https://healthspectra.site

Doctor Portal
https://doctor.healthspectra.site

Backend API
https://api.healthspectra.site

---

# System Overview

HealthSpectra provides a complete digital consultation workflow:

1. User logs in through secure authentication.
2. User interacts with AI tools to analyze symptoms.
3. AI suggests a relevant medical specialist.
4. User books an appointment with a doctor.
5. Doctor manages bookings through the doctor portal.

All interactions are stored in a centralized MySQL database.

---

# Technology Stack

## Frontend

Patient and doctor interfaces are built using modern web technologies.

* React
* Vite
* Tailwind CSS
* JavaScript
* Axios / Fetch

## Backend

The backend API handles all business logic and communication with the database.

* Python
* Flask
* MySQL
* REST API architecture

Database queries are executed using **direct MySQL connections instead of an ORM** for better control and performance.

## Authentication

Authentication and user identity are handled using **Clerk**.

Clerk provides:

* secure login
* session management
* identity verification

---

# Project Structure

```
HealthSpectra
│
├── backend
│   ├── server.py
│   ├── database connection
│   ├── routes
│   │   ├── users.py
│   │   ├── consultation.py
│   │   ├── book_appointment.py
│   │   ├── doctor_portal.py
│   │   └── AI tools
│
├── frontend
│   ├── patient dashboard
│   ├── consultation interface
│   ├── appointment booking
│   └── AI tools
│
├── doctor-frontend
│   ├── doctor dashboard
│   ├── appointment queue
│   └── patient management
│
└── deployment configuration
```

---

# Core Features

## AI Medical Consultation

Users can interact with an AI assistant to describe symptoms and receive suggestions.

The AI consultation system records:

* patient symptoms
* conversation messages
* AI analysis
* recommended specialist

Consultations are saved in the database and appear in the patient dashboard.

---

# Patient Dashboard

The dashboard provides users with a centralized view of their healthcare interactions.

Features include:

* consultation history
* doctor recommendations
* appointment bookings
* AI consultation tools
* personal profile management

---

# Doctor Discovery

The platform provides AI categorized doctors including:

* General Physicians
* Orthopedic Specialists
* Psychologists
* Gynecologists
* ENT Specialists
* Nutritionists

Doctors are stored in the database and displayed dynamically.

---

# Appointment Booking System

Patients can book consultations with doctors through two mechanisms.

## Queue Booking

Patients join a doctor's queue for consultation.

Stored fields include:

* queue number
* patient email
* doctor name
* consultation date

## Time Slot Booking

Patients can reserve a specific time slot.

Stored fields include:

* appointment time
* appointment date
* doctor id
* patient email

All bookings are stored in the **appointments table**.

---

# Doctor Portal

Doctors access a dedicated dashboard where they can:

* view today's appointment queue
* manage patient bookings
* view patient details
* track consultation sessions

The doctor portal communicates with the same backend API as the patient platform.

---

# Database Design

HealthSpectra uses **MySQL as the primary database**.

Key tables include:

## Users

Stores patient information.

```
id
email
name
role
clerk_id
created_on
```

## Consultations

Stores AI consultation history.

```
id
session_id
notes
selected_doctor
user_email
messages
report
created_on
```

## Doctors

Stores specialist categories.

```
id
specialist
description
image
```

## DoctorList

Stores registered doctors.

```
id
name
specialization
experience
consultation_fee
phone
email
clerk_user_id
```

## Appointments

Stores booked appointments.

```
id
doctor_id
doctor_name
patient_name
patient_email
appointment_date
queue_number
booking_type
time_slot
status
```

---

# API Design

The backend exposes REST endpoints.

Example routes:

```
POST /api/users
GET /api/users/<email>

POST /api/save-consultation
GET /api/consultations/<email>

POST /api/book-appointment
GET /api/appointments/<email>

GET /api/doctors
GET /api/doctors/dashboard/<clerk_id>
```

The API handles validation, authentication checks, and database operations.

---

# Environment Variables

Frontend

```
VITE_BACKEND_URL=https://api.healthspectra.site
```

Backend

```
MYSQL_HOST
MYSQL_USER
MYSQL_PASSWORD
MYSQL_DB
OPENAI_API_KEY
GROQ_API_KEY
ELEVENLABS_API_KEY
```

---

# Deployment

The system is deployed across multiple services.

Frontend hosting
Vercel

Backend API
Render

Database
MySQL

Architecture flow:

```
Patient Frontend
healthspectra.site
        │
        ▼
Doctor Portal
doctor.healthspectra.site
        │
        ▼
Backend API
api.healthspectra.site
        │
        ▼
MySQL Database
```

---

# Future Improvements

Planned enhancements include:

* real-time doctor queue updates
* video consultation support
* AI medical report analysis
* prescription generation
* payment integration
* patient medical history tracking

---

# Author

Sachin Prajapati

Full-stack developer focused on building scalable AI-driven SaaS platforms and healthcare technology solutions.

HealthSpectra demonstrates a full production system integrating AI, authentication, appointment management, and a multi-portal architecture.
