# Project Management System

A full-stack Project Management System built with React, Node.js, Express, and MongoDB. This application allows users to create projects, and manage tasks within those projects including features like status, priority, due dates, sorting, and filtering.

## Tech Stack

-   **Frontend:** React (Vite), Tailwind CSS, React Router DOM, Axios, React Hot Toast
-   **Backend:** Node.js, Express.js, MongoDB (Mongoose), dotenv, CORS

## Prerequisites

Before you begin, ensure you have the following installed:
-   [Node.js](https://nodejs.org/en/) (v16 or higher recommended)
-   [npm](https://www.npmjs.com/) (usually comes with Node.js)
-   [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)

## Project Structure

The repository is structured into two main directories:
-   `frontend/`: The React application.
-   `backend/`: The Express API server.

---

## Setup Instructions

### 1. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Install the dependencies:
    ```bash
    npm install
    ```

3.  Create a `.env` file in the `backend` root directory and add the following environment variables. Provide your MongoDB connection string and the port you want the server to run on:
    ```env
    PORT=5000
    MONGODB_URI=your_mongodb_connection_string_here
    # e.g., mongodb://localhost:27017/project-management
    ```

4.  Start the backend development server:
    ```bash
    npm run dev
    ```
    The server should now be running (typically on `http://localhost:5000`).

### 2. Frontend Setup

1.  Open a new terminal window and navigate to the frontend directory from the project root:
    ```bash
    cd frontend
    ```

2.  Install the dependencies:
    ```bash
    npm install
    ```

3.  Create a `.env` file in the `frontend` root directory and add the API base URL:
    ```env
    VITE_API_URL=http://localhost:5000/api
    # Replace with your backend URL if different
    ```

4.  Start the React development server:
    ```bash
    npm run dev
    ```
    The frontend should now be running (typically on `http://localhost:5173`).

---

## Features

-   **Projects:** Create, view, and delete projects. Pagination implemented (10 projects per page).
-   **Tasks:** Add tasks to specific projects with title, description, priority, status, and due date.
-   **Task Management:**
    -   Update task status (To Do, In Progress, Done).
    -   Edit and delete tasks.
    -   Filter tasks by their current status.
    -   Sort tasks by due date (Oldest/Newest).
-   **Responsive UI:** Clean and modern interface built with Tailwind CSS.

## Available Scripts

### Backend (`/backend`)
-   `npm start`: Runs the server using node.
-   `npm run dev`: Runs the server using nodemon for automatic restarts.

### Frontend (`/frontend`)
-   `npm run dev`: Starts the Vite development server.
-   `npm run build`: Builds the app for production.
-   `npm run lint`: Runs ESLint to check for code issues.
-   `npm run preview`: Locally preview the production build.
