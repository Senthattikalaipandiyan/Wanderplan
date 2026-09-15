# WanderPlan Project Overview

## 1. Project Purpose

WanderPlan is a travel planning application with a React frontend and an Express/MongoDB backend.

Main goals:
- help travelers browse and book trips
- allow managers to organize trips, activities, and expenses
- enable admins to manage users, destinations, and system data
- support role-based access for travelers, managers, and admins

## 2. Architecture

The project is divided into two folders:
- `client/` — React frontend app
- `server/` — Express backend API

Frontend and backend communicate using REST API endpoints under `/api/*`.

## 3. Client (Frontend) Structure

Important files and folders:
- `client/package.json` — frontend dependencies and scripts
- `client/src/index.js` — React entry point that renders `<App />`
- `client/src/App.jsx` — main router and protected routes by role
- `client/src/api/axios.js` — Axios instance with JWT token interceptor
- `client/src/context/AuthContext.jsx` — authentication state and helpers
- `client/src/components/common/ProtectedRoute.jsx` — route guard for secure pages
- `client/src/pages/` — page components for public and role dashboards
  - `HomePage.jsx`, `LoginPage.jsx`, `SignupPage.jsx`
  - `traveler/` pages for traveler experience
  - `manager/` pages for manager experience
  - `admin/` pages for admin experience

### Frontend flow

1. `index.js` mounts the React app.
2. `App.jsx` sets up `BrowserRouter` and routes.
3. Public routes include `/`, `/login`, `/signup`.
4. `/traveler-dashboard/*`, `/manager-dashboard/*`, and `/admin-dashboard/*` are protected by role.
5. `AuthContext` loads the current user from local storage and `/auth/me`.
6. `api/axios.js` adds the JWT token to every request.

## 4. Server (Backend) Structure

Important files and folders:
- `server/package.json` — backend dependencies and scripts
- `server/server.js` — main Express app setup and route registration
- `server/config/db.js` — MongoDB connection setup
- `server/routes/` — API routing definitions
- `server/controllers/` — business logic for each route
- `server/models/` — MongoDB schemas and data models
- `server/middleware/` — authentication and role-checking logic

### Main server routes

- `/api/auth` — signup, login, profile, current user
- `/api/trips` — trip data and search
- `/api/bookings` — booking operations
- `/api/expenses` — expense reporting
- `/api/manager` — manager-specific actions
- `/api/admin` — admin-specific actions
- `/api/suggestions` — travel suggestions
- `/api/pdf` — generate PDF documents (likely itineraries or reports)

### Server flow

1. `server.js` loads environment variables, middleware, and routes.
2. `config/db.js` connects to MongoDB.
3. Middleware handles CORS, JSON parsing, and errors.
4. Routes delegate requests to controllers.
5. Controllers use models to query or update MongoDB.

## 5. Authentication & Roles

Users are stored in `server/models/User.js`.

User fields include:
- `name`, `email`, `password`
- `role` = `traveler`, `manager`, or `admin`
- profile fields like `phone`, `nationality`, `passportNumber`

Auth flow:
- signup and login generate a JWT token.
- frontend stores token in `localStorage`.
- `api/axios.js` attaches `Authorization: Bearer <token>`.
- protected backend routes verify the token.
- frontend protected routes ensure only allowed roles can access pages.

## 6. Quick explanation of the most important files

### `client/src/index.js`
- imports React and root CSS
- renders the app into `#root`
- this is the launch point for the SPA

### `client/src/App.jsx`
- sets up page routing
- wraps app in `AuthProvider`
- defines public and protected pages
- redirects users to a role-specific dashboard

### `client/src/context/AuthContext.jsx`
- stores `user` and `loading` state
- loads session info from local storage
- defines `login`, `signup`, `logout`, and `updateProfile`

### `client/src/api/axios.js`
- creates Axios instance with base API URL
- adds JWT token to requests
- logs out user if API returns 401

### `server/server.js`
- initializes Express app
- configures CORS and JSON parsing
- loads MongoDB connection
- mounts API routes
- starts the server on port 5000

### `server/config/db.js`
- connects to MongoDB using `process.env.MONGO_URI`
- logs success or exits on failure

### `server/routes/authRoutes.js`
- handles auth-specific endpoints
- protects `/me` and `/profile`

### `server/models/User.js`
- defines user schema and validation
- hashes passwords before save
- provides a password compare method

## 7. How frontend and backend connect

- Frontend calls backend URLs like `http://localhost:5000/api/auth/login`
- `client/package.json` uses `proxy` to forward `/api` calls in development
- backend routes return JSON responses
- frontend `AuthContext` and page components consume those JSON APIs

## 8. Interview talking points

- This is a travel management system with role-based dashboards.
- React handles UI, routing, and state.
- Express handles API, auth, database, and business logic.
- MongoDB stores users, trips, bookings, expenses, suggestions.
- Security uses JWT tokens and protected routes.
- Different user roles control access to traveler, manager, and admin features.

## 9. How to run the app

### Backend
1. Open `server/`
2. install dependencies: `npm install`
3. create `.env` with `MONGO_URI`, `CLIENT_URL`, `PORT`
4. start: `npm run dev`

### Frontend
1. Open `client/`
2. install dependencies: `npm install`
3. start: `npm start`

## 10. Best way to explain this project in interview

1. Start with the goal: travel planning for travelers, managers, and admins.
2. Mention architecture: React frontend, Express backend, MongoDB.
3. Explain auth: signup/login, JWT token, role-based pages.
4. Describe main modules: trips, bookings, expenses, suggestions, admin management.
5. Close with how data flows: UI → API → database → UI.
