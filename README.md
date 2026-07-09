# EcoAlert MERN App

EcoAlert is a complete MERN stack application for reporting and tracking environmental issues. The React frontend talks to an Express REST API, and the API stores users, reports, and tracking entries in MongoDB Atlas through Mongoose.

## Tech Stack

- MongoDB Atlas + Mongoose
- Express + Node.js
- React 18 + Vite + Tailwind CSS
- JWT authentication + bcrypt password hashing
- Axios for frontend API requests
- Multer for authenticated image uploads

## Project Structure

```text
src/
  components/
  contexts/
  pages/
  services/          # Axios API client and frontend data services

server/
  src/
    config/          # MongoDB connection
    controllers/     # Request handlers
    middleware/      # Auth, admin, upload, and error handling
    models/          # Mongoose schemas
    routes/          # Express route definitions
    utils/           # Token and serialization helpers
    app.js
    server.js
  uploads/
```

## Install Dependencies

Install frontend dependencies:

```bash
npm install
```

Install backend dependencies, including MongoDB/Mongoose packages:

```bash
npm --prefix server install
```

## Configure MongoDB Atlas

1. Create a free cluster at MongoDB Atlas.
2. Create a database user and save the username/password.
3. Add your IP address in Atlas under Network Access.
4. Copy the connection string and choose a database name, for example `ecoalert`.
5. Create the backend env file:

```bash
cp server/.env.example server/.env
```

6. Update `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/ecoalert?retryWrites=true&w=majority
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
ADMIN_EMAILS=femohammed@st.ug.edu.gh
```

Do not commit real `.env` files or secrets.

## Configure Frontend

Create the frontend env file:

```bash
cp .env.example .env.local
```

Default value:

```env
VITE_API_URL=http://localhost:5000/api
```

## Start the App

Start the backend:

```bash
npm run server:dev
```

Start the frontend in a second terminal:

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend health check: `http://localhost:5000/api/health`

## Authentication API

- `POST /api/auth/register`
- `POST /api/auth/signup` for older frontend compatibility
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `PUT /api/auth/profile`

Protected routes require:

```http
Authorization: Bearer <jwt_token>
```

## Main REST APIs

Reports:

- `GET /api/reports`
- `GET /api/reports/:id`
- `POST /api/reports`
- `PUT /api/reports/:id`
- `PUT /api/reports/:id/status`
- `DELETE /api/reports/:id`
- `POST /api/reports/:id/verify`
- `POST /api/reports/:id/comments`

Tracking:

- `GET /api/tracking`
- `POST /api/tracking`

Uploads:

- `POST /api/upload` with multipart field `image`

Admin users:

- `GET /api/users`
- `PUT /api/users/:id/role`

## Optional Seed Data

After configuring MongoDB Atlas:

```bash
npm run server:seed
```

The seed creates a demo user and sample reports.
