# Digital Health Appointment & Recording System

A full-stack web application designed to streamline patient-provider interactions through a modern, web-based appointment scheduling and medical record management system. This project is built with a focus on a clean, scalable architecture and a professional user experience.

![Login Page Screenshot](https://drive.google.com/file/d/1Uqjn38ARlJjGWBS7U18KGACDD-cEb7Dj/view?usp=drive_link)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Running the Application](#running-the-application)
- [What's Next](#whats-next)

## Features

This application provides a comprehensive platform for both patients and healthcare providers with role-based access control.

#### Patient Features

- **Authentication:** Secure user registration and login.
- **Provider Discovery:** A public, searchable, and filterable directory of healthcare providers.
- **Provider Profiles:** Detailed provider pages with biography, specialty, and other information.
- **Appointment Management:** Intuitive interface to book, view, and cancel appointments.
- **Profile Management:** Ability for patients to view and update their own profile information.
- **View Medical Records:** Patients have read-only access to their own medical chart, including history, lab results, and prescriptions.

#### Provider Features

- **Secure Dashboard:** A central hub to view and manage upcoming appointments.
- **Patient Management:** A "My Patients" directory to view all unique patients and their complete history.
- **EHR/EMR System:** A detailed patient chart view with a tabbed interface for:
  - Viewing appointment history.
  - Creating, viewing, and updating clinical notes.
  - Adding and viewing medical history, lab results, and prescriptions.
- **Profile Customization:** Ability for providers to update their specialty, biography, and other public-facing information.

## Tech Stack

This project is a monorepo managed with `pnpm workspaces`, containing a frontend single-page application and a backend API.

#### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT (JSON Web Tokens)
- **File Storage (Local):** MinIO (S3-Compatible Object Storage)

#### Frontend

- **Framework:** React
- **Language:** TypeScript
- **Build Tool:** Vite
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS
- **Component Library:** shadcn/ui
- **Icons:** Lucide React
- **Form Management:** React Hook Form
- **Schema Validation:** Zod (used on both frontend and backend)

#### Development Environment

- **Containerization:** Docker & Docker Compose

## Project Structure

The project is organized as a monorepo with two primary applications.

```
/digital-health-app
|
|-- /apps
|   |-- /api      # The Node.js/Express.js backend API
|   |-- /web      # The React (Vite) frontend application
|
|-- /packages     # (Optional) For shared code, e.g., UI components
|
|-- docker-compose.yml  # Defines the development services (Postgres, MinIO)
|-- README.md           # You are here!
|-- package.json
|-- pnpm-workspace.yaml
```

## Prerequisites

Before you begin, ensure you have the following tools installed on your system:

1.  **Node.js:** (Recommended version: v18.x or later). We recommend using a version manager like [NVM](https://github.com/nvm-sh/nvm) or [NVM for Windows](https://github.com/coreybutler/nvm-windows).
2.  **pnpm:** A fast and efficient package manager. Install it globally after installing Node.js:
    ```bash
    npm install -g pnpm
    ```
3.  **Docker & Docker Compose:** Required to run the local development database and file storage. Download it from the [official Docker website](https://www.docker.com/products/docker-desktop/).

## Getting Started

Follow these steps to get the project running on your local machine.

### 1. Clone the Repository

First, clone this repository to your local machine.

```bash
git clone [TODO: PASTE YOUR REPOSITORY URL HERE]
cd digital-health-app
```

### 2. Install Dependencies

Install all project dependencies for both the frontend and backend from the root directory using `pnpm`.

```bash
pnpm install
```

### 3. Set Up Environment Variables

The backend API requires an `.env` file with credentials for the database and other services.

- Navigate to the API directory: `cd apps/api`
- Make a copy of the example environment file:
  - **Windows (CMD):** `copy .env.example .env`
  - **Windows (PowerShell):** `cp .env.example .env`
  - **Mac/Linux:** `cp .env.example .env`
- The default values in the `.env` file are already configured to work with the Docker Compose setup. You do not need to change them for local development.
- 

### 4. Start the Development Services

The database (PostgreSQL) and file storage (MinIO) run as Docker containers.

- From the **root** of the project directory, start the containers:
  ```bash
  docker compose up -d
  ```
- **Important:** Ensure Docker Desktop is running on your machine before you run this command.

### 5. Run the Database Migrations

With the database container running, you need to create the tables using Prisma.

- Navigate to the API directory: `cd apps/api`
- Run the migration command:
  ```bash
  pnpm prisma migrate dev
  ```
  This will sync your database schema with the Prisma models.

### 6. (One-Time Setup) Create the MinIO Bucket

You need to create the bucket where profile pictures will be stored.

1.  Open your web browser and navigate to the MinIO console: **`http://localhost:9001`**
2.  Log in with the default credentials:
    - **Username:** `minioadmin`
    - **Password:** `minioadminpassword`
3.  Click on **"Buckets"** in the sidebar.
4.  Click **"Create Bucket"** and name it **`profile-pictures`**.
5.  Click on the new bucket, go to the **"Access Policies"** tab, and set the policy to **`public`**.

## Running the Application

You need to run two processes simultaneously in two separate terminals.

#### Terminal 1: Start the Backend API

```bash
# Navigate to the API directory
cd apps/api

# Start the development server
pnpm dev
```

The API will be running at `http://localhost:3001`.

#### Terminal 2: Start the Frontend App

```bash
# Navigate to the web directory
cd apps/web

# Start the development server
pnpm dev
```

The React application will be running at `http://localhost:5173`. You can now open this URL in your browser to use the application.

## What's Next

This project is a solid foundation. Here are some of the planned next steps:

- [ ] **Implement Automated Tests:** Write Jest and Supertest integration tests for the backend to ensure reliability.
- [ ] **Harden API Validation:** Add Zod validation schemas to all remaining backend endpoints.
- [ ] **Implement Pagination:** Add pagination to the provider and appointment lists to handle large amounts of data.
- [ ] **Real-time Notifications:** Integrate WebSockets for real-time updates (e.g., instant notifications for new appointments).

---

