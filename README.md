# MongoDB, Express, and Node.js Application

A complete web application with MongoDB, Express, and Node.js featuring user authentication, role-based authorization, EJS templates, and CRUD operations.

## Features

- User authentication with JWT
- Role-based authorization (admin and analyst roles)
- CRUD operations for users (admin only)
- Input validation
- Error handling
- Rate limiting for auth routes
- Request logging
- EJS templating for web interfaces
- Responsive design with Bootstrap
- User-friendly login and registration forms
- Admin dashboard with user statistics
- User dashboard for regular users

## Project Structure

```
├── config
│   └── db.js
├── controllers
│   ├── authController.js
│   └── userController.js
├── middleware
│   ├── auth.js
│   ├── errorHandler.js
│   └── validator.js
├── models
│   └── User.js
├── public
│   ├── css
│   │   └── style.css
│   └── js
│       └── main.js
├── routes
│   ├── auth.js
│   ├── users.js
│   └── webRoutes.js
├── views
│   ├── admin
│   │   └── dashboard.ejs
│   ├── auth
│   │   ├── login.ejs
│   │   └── register.ejs
│   ├── dashboard
│   │   └── index.ejs
│   ├── partials
│   │   ├── footer.ejs
│   │   └── header.ejs
│   └── index.ejs
├── .env
├── .env.example
├── package.json
├── README.md
└── server.js
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/gmouheb/user-management-men
   cd user-management-men
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the values in `.env` with your configuration

   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/your_database_name
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   NODE_ENV=development
   ```

4. Start the server:
   ```
   # Development mode with nodemon
   npm run dev

   # Production mode
   npm start
   ```

## Web Interface Documentation

The application includes a complete web interface built with EJS templates and Bootstrap. The following pages are available:

### Home Page
- **URL**: `/`
- **Access**: Public
- **Description**: Landing page with information about the application and links to login or register.

### Authentication Pages

#### Login Page
- **URL**: `/login`
- **Access**: Public
- **Description**: Form for users to log in with their email and password.
- **Features**:
  - Input validation
  - Error messages
  - Redirect to appropriate dashboard based on user role

#### Registration Page
- **URL**: `/register`
- **Access**: Public
- **Description**: Form for new users to create an account.
- **Features**:
  - Input validation
  - Error messages
  - Role selection (analyst or admin)
  - Redirect to appropriate dashboard based on user role

### User Dashboards

#### User Dashboard
- **URL**: `/dashboard`
- **Access**: Private (any authenticated user)
- **Description**: Dashboard for regular users (analysts) with account information and quick actions.
- **Features**:
  - Account information display
  - Quick action links
  - Responsive design

#### Admin Dashboard
- **URL**: `/admin`
- **Access**: Private (admin users only)
- **Description**: Dashboard for administrators with user management and system statistics.
- **Features**:
  - User statistics (total users, admins, analysts)
  - Recent user activity
  - User management links
  - Responsive design

## API Documentation

### Authentication Routes

#### Register a new user
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Auth required**: No
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "analyst" // Optional, defaults to "analyst"
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

#### Login
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Auth required**: No
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Note**: This route has rate limiting (5 requests per 15 minutes)

#### Get current user
- **URL**: `/api/auth/me`
- **Method**: `GET`
- **Auth required**: Yes (JWT token in Authorization header)
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "_id": "60f1a5b5c5b5b5b5b5b5b5b5",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "analyst",
      "createdAt": "2023-05-17T12:00:00.000Z",
      "updatedAt": "2023-05-17T12:00:00.000Z"
    }
  }
  ```

### User Management Routes (Admin Only)

#### Get all users
- **URL**: `/api/users`
- **Method**: `GET`
- **Auth required**: Yes (JWT token with admin role)
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "count": 2,
    "data": [
      {
        "_id": "60f1a5b5c5b5b5b5b5b5b5b5",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "analyst",
        "createdAt": "2023-05-17T12:00:00.000Z",
        "updatedAt": "2023-05-17T12:00:00.000Z"
      },
      {
        "_id": "60f1a5b5c5b5b5b5b5b5b5b6",
        "name": "Admin User",
        "email": "admin@example.com",
        "role": "admin",
        "createdAt": "2023-05-17T12:00:00.000Z",
        "updatedAt": "2023-05-17T12:00:00.000Z"
      }
    ]
  }
  ```

#### Get single user
- **URL**: `/api/users/:id`
- **Method**: `GET`
- **Auth required**: Yes (JWT token with admin role)
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "_id": "60f1a5b5c5b5b5b5b5b5b5b5",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "analyst",
      "createdAt": "2023-05-17T12:00:00.000Z",
      "updatedAt": "2023-05-17T12:00:00.000Z"
    }
  }
  ```

#### Create user
- **URL**: `/api/users`
- **Method**: `POST`
- **Auth required**: Yes (JWT token with admin role)
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "password123",
    "role": "analyst"
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "success": true,
    "data": {
      "_id": "60f1a5b5c5b5b5b5b5b5b5b7",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "analyst",
      "createdAt": "2023-05-17T12:00:00.000Z",
      "updatedAt": "2023-05-17T12:00:00.000Z"
    }
  }
  ```

#### Update user
- **URL**: `/api/users/:id`
- **Method**: `PUT`
- **Auth required**: Yes (JWT token with admin role)
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Body**:
  ```json
  {
    "name": "Jane Smith",
    "role": "admin"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "_id": "60f1a5b5c5b5b5b5b5b5b5b7",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "admin",
      "createdAt": "2023-05-17T12:00:00.000Z",
      "updatedAt": "2023-05-17T12:30:00.000Z"
    }
  }
  ```

#### Delete user
- **URL**: `/api/users/:id`
- **Method**: `DELETE`
- **Auth required**: Yes (JWT token with admin role)
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {}
  }
  ```

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "error": "Error message"
}
```

Common error status codes:
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Not authorized to access the resource
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Server Error`: Server error

## License

ISC
