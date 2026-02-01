# 🚗 Transport Facility App

A modern ride-sharing application built with Angular that allows employees to offer and book rides within an organization.

**🔗 Live Demo:** [https://ayushsingh-7.github.io/Transport-facility-app-infrrd/](https://ayushsingh-7.github.io/Transport-facility-app-infrrd/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Demo Video](#demo-video)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [System Design (HLD)](#system-design-hld)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Setup & Installation](#setup--installation)
- [Scope of Improvement](#scope-of-improvement)
- [What's Not Implemented](#whats-not-implemented)

---

## 🎯 Overview

Transport Facility App is an internal ride-sharing platform designed for organizations. Employees can:

- **Offer rides** to share their commute with colleagues
- **Browse available rides** with advanced filtering options
- **Book seats** on available rides
- **Track their rides** (offered and booked)

---

## 🎬 Demo Video

Check out the app in action! Watch the complete walkthrough of all features:

https://github.com/user-attachments/assets/1f3d168d-3750-479a-87f9-f1473ec71f15

**Demo includes:**

- ✅ Offering a new ride with form validation
- ✅ Browsing available rides with filters
- ✅ Booking a ride with employee ID verification
- ✅ Viewing your rides (offered and booked)
- ✅ Real-time seat availability updates
- ✅ Empty state handling

---

## ✨ Features

### Core Features

| Feature                  | Description                                                                             |
| ------------------------ | --------------------------------------------------------------------------------------- |
| **Offer a Ride**         | Employees can offer rides with vehicle details, pickup/destination, and available seats |
| **Browse Rides**         | View all available rides with filters for vehicle type, time, and location              |
| **Book a Ride**          | Book seats on available rides with validation checks                                    |
| **My Rides**             | View rides offered and booked by searching employee ID                                  |
| **Time-based Filtering** | Filter rides within ±60 minutes of selected schedule time                               |
| **Real-time Updates**    | Seat availability updates in real-time when bookings are made                           |

### Validations Implemented

- ✅ **Indian Number Plate Validation** (6 patterns: Standard, Electric, Temporary, Government, Bharat Series, Two-wheeler)
- ✅ **Duplicate Employee Check** - Same employee cannot offer more than one ride
- ✅ **Duplicate Booking Check** - Same employee cannot book the same ride twice
- ✅ **Own Ride Booking Prevention** - Employees cannot book their own offered rides
- ✅ **Past Time Restriction** - Cannot select past time for schedule/departure
- ✅ **Seat Availability Check** - Join button disabled when no seats available

### UI/UX Features

- 🚗 fully responsive UI across devices mobile tablet large monitor and laptops
- 🎬 Animated booking result modals (Success/Failure)
- 🚗 Vehicle-specific icons (Car/Bike)
- 🕐 Default schedule time set to current time
- 🔄 Empty state with call-to-action when no rides match

---

## 🛠 Tech Stack

### Framework & Libraries....NO CSS LIBRARY USED as mentioned in problem statement

| Technology     | Version | Purpose                    |
| -------------- | ------- | -------------------------- |
| **Angular**    | 15.2.x  | Frontend Framework         |
| **TypeScript** | 4.9.x   | Programming Language       |
| **RxJS**       | 7.8.x   | Reactive State Management  |
| **SCSS**       | -       | Styling (CSS Preprocessor) |

### UI Components

| Component             | Purpose                          |
| --------------------- | -------------------------------- |
| **Material Icons**    | Icon library for UI elements     |
| **Custom Components** | Ride cards, Modals, Empty states |

### State Management

| Approach                   | Description                                    |
| -------------------------- | ---------------------------------------------- |
| **BehaviorSubject (RxJS)** | Centralized state management via GlobalService |
| **localStorage**           | Data persistence across sessions               |

## 🔄 How It Works

### 1. Offering a Ride

```
User clicks "Offer Ride" → Opens AddRideModal → Fills form with validations(Reactive forms used)
→ On submit, GlobalService.addRide() is called → Ride saved to localStorage()
→ All subscribed components receive updated rides list
```

### 2. Browsing Rides

```
User navigates to Browse → BookRidesComponent loads
→ Subscribes to GlobalService.rides$ → Displays rides with current time filter (±60 min)
→ User can filter by vehicle type, time, or search
```

### 3. Booking a Ride

```
User clicks "Book ride" on ride card → BookRideModal opens
→ User enters Employee ID → Validation checks run:
  • Not own ride? ✓
  • Not already booked? ✓
  • Seats available? ✓
→ GlobalService.bookRide() updates seat count
→ BookingResultModal shows success/failure
```

### 4. Viewing My Rides

```
User enters Employee ID → Searches in both rides$ and bookedRides$
→ Combines results with status labels
→ Displays in grid layout
```

---

## 🚀 Setup & Installation

### Prerequisites

- Node.js (v16+)
- Angular CLI (v15.2.x)

### Installation

```bash
# Clone the repository
git clone https://github.com/AyushSingh-7/Transport-facility-app-infrrd.git

# Navigate to project
cd Transport-facility-app-infrrd

# Install dependencies
npm install

# Start development server
ng serve

# Open browser
http://localhost:4200
```

### Build for Production

```bash
# Build with base-href for GitHub Pages
ng build --output-path docs --base-href /Transport-facility-app-infrrd/
```

---

## 🔮 Scope of Improvement

### Backend Integration

| Improvement           | Description                                  |
| --------------------- | -------------------------------------------- |
| **REST API**          | Replace localStorage with actual backend API |
| **Database**          | PostgreSQL/MongoDB for persistent storage    |
| **Authentication**    | JWT-based user authentication                |
| **Real-time Updates** | WebSocket for live ride updates              |

### Feature Enhancements

| Feature                | Description                                        |
| ---------------------- | -------------------------------------------------- |
| **User Profiles**      | Employee profiles with ride history                |
| **Notifications**      | Email/Push notifications for booking confirmations |
| **Rating System**      | Rate drivers and passengers                        |
| **Route Optimization** | Google Maps integration for route display          |
| **Recurring Rides**    | Schedule daily/weekly recurring rides              |
| **Chat Feature**       | In-app messaging between riders                    |
| **Cancellation**       | Allow ride/booking cancellations                   |
| **Waiting List**       | Queue for fully booked rides                       |

### Technical Improvements

| Area                 | Improvement                                   |
| -------------------- | --------------------------------------------- |
| **State Management** | Migrate to NgRx for complex state             |
| **Testing**          | Increase unit test coverage (currently basic) |
| **E2E Tests**        | Add Cypress/Playwright tests                  |
| **PWA**              | Convert to Progressive Web App                |
| **Performance**      | Lazy loading for all routes                   |

---

## 📝 Development Commands

```bash
# Development server
ng serve

# Build
ng build

# Run unit tests
ng test

# Lint
ng lint

# Generate component
ng generate component component-name
```

---

## 👨‍💻 Author

**Ayush Singh**

---
