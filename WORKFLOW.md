# WanderPlan Workflow Document

## Overview
This document describes the complete workflow for the WanderPlan application, from startup to user actions and backend processing.

## 1. Start the Backend
1. Run `npm install` in `server/` if dependencies are not installed.
2. Start the backend using `npm run dev` or `npm start`.
3. `server/server.js` is the entry point.
4. It loads environment variables with `dotenv`.
5. It configures middleware:
   - `cors` for cross-origin requests
   - `express.json()` for JSON body parsing
   - `express.urlencoded()` for form data
6. It connects to MongoDB with `server/config/db.js`.
7. It registers API routes under `/api/*`.
8. It starts listening on `process.env.PORT` or `5000`.

## 2. Start the Frontend
1. Run `npm install` in `client/` if needed.
2. Start the frontend using `npm start`.
3. `client/src/index.js` renders the React application into the browser.
4. `client/src/App.jsx` sets up routing, authentication, and protected pages.

## 3. Initial App Load
1. Browser loads the React SPA.
2. `AuthProvider` from `client/src/context/AuthContext.jsx` mounts.
3. It checks `localStorage` for a saved JWT token.
4. If a token exists, it calls `/api/auth/me` to fetch the user profile.
5. If no token exists, the app remains on public pages until login.

## 4. Authentication Flow
1. Public pages available:
   - `/` → HomePage
   - `/login` → LoginPage
   - `/signup` → SignupPage
2. When user submits login or signup:
   - Frontend sends credentials to `/api/auth/login` or `/api/auth/signup`.
   - Backend validates credentials and returns a JWT token and user data.
   - Frontend stores the token in `localStorage`.
   - Frontend saves user data in context.

## 5. Role-Based Access
1. Users have a role: `traveler`, `manager`, or `admin`.
2. `App.jsx` defines protected routes for each role.
3. `ProtectedRoute` checks if the current user is allowed to access a page.
4. Unauthorized users are redirected to `/login`.
5. A logged-in user is redirected to their role dashboard.

## 6. API Request Handling
1. `client/src/api/axios.js` creates an Axios instance with base URL `http://localhost:5000/api`.
2. It attaches the JWT token to every request inside `Authorization: Bearer <token>`.
3. If the backend returns a `401 Unauthorized` response:
   - the token is removed from local storage
   - the user is redirected to `/login`

## 7. Role-Specific Workflows
- Traveler workflow:
  - search trips
  - view itineraries
  - create bookings
  - track expenses
- Manager workflow:
  - manage group trips
  - manage travelers
  - approve or organize travel plans
  - generate expense reports
- Admin workflow:
  - manage users
  - manage destinations and trips
  - view analytics and activity logs
  - generate reports

## 8. Backend Processing Flow
1. Frontend sends HTTP requests to endpoints like `/api/trips`, `/api/bookings`, `/api/expenses`, `/api/admin`.
2. Express routes dispatch requests to controller functions.
3. Controllers use Mongoose models to read or modify data in MongoDB.
4. Models include:
   - `User`
   - `Trip`
   - `Booking`
   - `Expense`
   - `Suggestion`
   - `Destination`
   - `Activity`
   - `GroupTrip`
5. Controllers send JSON responses back to the frontend.
6. The frontend updates the UI based on the response.

## 9. End of Session
1. The user can log out.
2. Logout removes the JWT token from `localStorage`.
3. User state is cleared in `AuthContext`.
4. The app redirects back to the login page.

## 10. Summary
- Start backend first, then frontend.
- React app boots and checks authentication.
- User logs in and receives a token.
- Protected pages are available based on role.
- Frontend uses Axios to communicate with backend APIs.
- Backend validates requests, uses models, and updates the database.
- User completes travel planning tasks and can log out.
