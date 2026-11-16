# Staff Management System

A Staff Management System developed for the BCA Department of Bishop Heber College as my final-year BCA project. The application helps department staff maintain their professional profiles and makes their academic and professional information accessible to students and visitors.

## Live Application

**[Open Staff Management System](https://staff-management-system-arun-karthiks-projects-27b07dca.vercel.app/)**

## Project Overview

The original project was built with PHP and MySQL. It has since been migrated to a modern web stack while retaining the original PHP implementation in the `php-source/` directory for reference.

The migrated application uses:

- **Frontend:** Next.js, React, TypeScript
- **Styling and UI:** Tailwind CSS and reusable UI components
- **Backend:** Next.js Route Handlers / API routes
- **Database:** MongoDB with Mongoose
- **Authentication:** NextAuth credentials authentication
- **Email:** Nodemailer
- **Reports:** PDF report generation
- **Deployment:** Vercel

## Features

- Staff authentication and profile management
- Public staff profile viewing
- Academic qualifications and professional experience
- Research information and publications
- Awards, books, conferences and workshops
- Extension activities and resource-person details
- Profile information management through dedicated sections
- PDF report generation
- Scheduled email reminders to encourage staff to keep their profiles updated

## Migration: PHP to Next.js

The original BCA department project was developed using:

- HTML, CSS and JavaScript
- PHP and MySQL
- Bootstrap
- PHPMailer
- DOMPDF

The migrated application has been rebuilt using Next.js and TypeScript, with MongoDB replacing the original MySQL data layer. The legacy PHP source and database dump are retained under `php-source/`.

| Original implementation | Migrated implementation |
| --- | --- |
| PHP | Next.js / TypeScript |
| MySQL | MongoDB / Mongoose |
| PHP pages and scripts | React pages and Next.js Route Handlers |
| PHPMailer | Nodemailer |
| DOMPDF | PDF report generation in the Next.js application |
| Bootstrap UI | Tailwind CSS and reusable components |

## Repository Structure

```text
staff-management/
├── php-source/                 # Original PHP + MySQL implementation
│   ├── projectImg/             # Screenshots of the original project
│   └── bhc.sql                 # Original database dump
├── migrate-seed.js             # Data migration / seed utility
└── staff-management-system/    # Migrated Next.js application
```

## Screenshots — Original PHP Application

The following screenshots show the original PHP implementation. Images are stored in `php-source/projectImg/`.

| Login / Profile | Staff and public views |
| --- | --- |
| ![Project screenshot 1](php-source/projectImg/1.png) | ![Project screenshot 2](php-source/projectImg/2.png) |
| ![Project screenshot 3](php-source/projectImg/3.png) | ![Project screenshot 4](php-source/projectImg/4.png) |
| ![Project screenshot 5](php-source/projectImg/5.png) | ![Project screenshot 6](php-source/projectImg/6.png) |
| ![Project screenshot 7](php-source/projectImg/7.png) | ![Project screenshot 8](php-source/projectImg/8.png) |
| ![Project screenshot 9](php-source/projectImg/9.png) | ![Project screenshot 10](php-source/projectImg/10.png) |
| ![Project screenshot 11](php-source/projectImg/11.png) | ![Project screenshot 12](php-source/projectImg/12.png) |
| ![Project screenshot 13](php-source/projectImg/13.png) | ![Project screenshot 14](php-source/projectImg/14.png) |
| ![Project screenshot 15](php-source/projectImg/15.png) | ![Project screenshot 16](php-source/projectImg/16.png) |
| ![Project screenshot 17](php-source/projectImg/17.png) | ![Project screenshot 18](php-source/projectImg/18.png) |
| ![Project screenshot 19](php-source/projectImg/19.png) | ![Project screenshot 20](php-source/projectImg/20.png) |
| ![Project screenshot 21](php-source/projectImg/21.png) | |

## Running the Migrated Application Locally

1. Open the migrated application directory:

   ```bash
   cd staff-management-system
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file using `.env.example` as a reference. Configure the required MongoDB, authentication and email environment variables.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:5005](http://localhost:5005).

> Do not commit real credentials, API keys, database connection strings or production environment files. Login credentials are intentionally not published in this repository.

## Academic Project

- **Project:** Staff Management System
- **Department:** BCA Department, Bishop Heber College
- **Project Type:** Final-Year Undergraduate Project
