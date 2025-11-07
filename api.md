# JWT_Task API Documentation

Base URL

-   Local: http://localhost:5001/api

Authentication

-   Scheme: Bearer Token in the Authorization header
-   Header: Authorization: Bearer <JWT>
-   Obtain token via POST /auth/login or POST /auth/signup.

Environment variables

-   Server
    -   PORT: default 5001
    -   DB_URL: Mongo connection string
    -   JWT_SECRET: secret used to sign/verify tokens
-   Frontend
    -   VITE_API_URL: should be http://localhost:5001/api for local dev

Errors

-   General error shape: { "message": "..." }
-   Common status codes: 200, 201, 400 (validation), 401 (unauthorized), 404 (not found), 500 (server error)

Endpoints

Auth

1. POST /auth/signup

-   Body
    {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "secret123"
    }

-   Response (201)
    {
    "user": { "id": "<mongoId>", "name": "John Doe", "email": "john@example.com" },
    "token": "<jwt>"
    }

2. POST /auth/login

-   Body
    {
    "email": "john@example.com",
    "password": "secret123"
    }

-   Response (200)
    {
    "user": { "id": "<mongoId>", "name": "John Doe", "email": "john@example.com" },
    "token": "<jwt>"
    }

User (requires Authorization header)

1. GET /user/me

-   Response (200)
    {
    "\_id": "<mongoId>",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "...",
    "updatedAt": "..."
    }

Tasks (requires Authorization header)

1. POST /tasks

-   Body
        {
        "title": "Buy milk",
        "description": "2% organic"
        }

-   Response (201)
    {
    "\_id": "<mongoId>",
    "userId": "<mongoId>",
    "title": "Buy milk",
    "description": "2% organic",
    "completed": false,
    "createdAt": "...",
    "updatedAt": "..."
    }

-   Possible 400: { "message": "Title required" }

2. GET /tasks

-   Response (200)
    [
    { "_id": "...", "title": "...", "completed": false, ... },
    { "_id": "...", "title": "...", "completed": true, ... }
    ]

3. PUT /tasks/:id

-   Params: id = 24-char Mongo ObjectId
-   Body (any subset)
    {
    "title": "Buy bread",
    "description": "Sourdough",
    "completed": true
    }

-   Response (200)
    { "\_id": "...", "title": "Buy bread", "completed": true, ... }

-   Possible 400: { "message": "Invalid id" } or { "message": "Title required" }
-   Possible 404: { "message": "Not found" }

4. DELETE /tasks/:id

-   Params: id = 24-char Mongo ObjectId
-   Response (200)
    { "message": "Deleted" }

-   Possible 400: { "message": "Invalid id" }
-   Possible 404: { "message": "Not found" }

Quick cURL examples

Signup

```bash
curl -X POST http://localhost:5001/api/auth/signup \
	-H 'Content-Type: application/json' \
	-d '{"name":"John Doe","email":"john@example.com","password":"secret123"}'
```

Login

```bash
curl -X POST http://localhost:5001/api/auth/login \
	-H 'Content-Type: application/json' \
	-d '{"email":"john@example.com","password":"secret123"}'
```

Get my profile

```bash
curl http://localhost:5001/api/user/me \
	-H 'Authorization: Bearer <jwt>'
```

Create a task

```bash
curl -X POST http://localhost:5001/api/tasks \
	-H 'Authorization: Bearer <jwt>' \
	-H 'Content-Type: application/json' \
	-d '{"title":"Buy milk","description":"2% organic"}'
```

Postman collection

-   Import docs/JWT_Task.postman_collection.json into Postman.
-   Set collection variable token after login (the collection includes a test to auto-save the token from login/signup responses).
