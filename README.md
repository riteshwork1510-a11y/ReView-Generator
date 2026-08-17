# AI Review Generator

A comprehensive full-stack web application designed for creating and managing Business Digital Cards that prompt users to leave Google Reviews.

## 🚀 Overview

The **AI Review Generator** is a production-ready system consisting of:
- A responsive, modern frontend built with **Next.js**, **React**, and **Tailwind CSS**.
- A robust, high-performance backend built with **Python**, **FastAPI**, and **MongoDB**.
- Clean code architecture enforcing rigorous error handling, request validation, and user accessibility.

## 🏗 Production Architecture

The deployment architecture ensures strict separation of concerns and maximum security:

```
                 Internet
                    │ (HTTPS)
                    ▼
              Next.js Frontend (app.yourdomain.com)
                    │
                    │ (HTTPS API calls)
                    ▼
              FastAPI Backend (api.yourdomain.com)
                    │
                    │ (Private Network)
                    ▼
                 MongoDB Database
```

- **Frontend and Backend** are completely decoupled and scaled independently.
- **MongoDB** is securely locked behind a private network. It is never exposed to the public internet or accessible via the browser.

## 📦 Deployment Configuration

### 1. MongoDB Configuration
Deploy a MongoDB cluster (e.g., via MongoDB Atlas).
- Ensure the connection string (`MONGODB_URI`) is generated securely.
- Restrict network access to only allow IP addresses from your Backend deployment platform.
- The `MONGODB_DATABASE` should be set to `ai_review_generator`.

### 2. Backend Deployment (FastAPI)
The backend is designed for Linux-based App Services or Docker containers.
1. Provide the following environment variables:
   - `MONGODB_URI=mongodb+srv://...`
   - `MONGODB_DATABASE=ai_review_generator`
   - `FRONTEND_ORIGIN=https://app.yourdomain.com` (Ensures strict CORS policy).
2. Install dependencies via the lockfile/pinned requirements:
   `pip install -r requirements.txt`
3. Start the application using Uvicorn (do NOT use `--reload` in production):
   `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. **Health Check**: The platform can monitor the API availability using the lightweight `GET /health` endpoint.

### 3. Frontend Deployment (Next.js)
The frontend is optimized for platforms like Vercel or Node.js hosting.
1. Provide the following environment variable:
   - `NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com`
2. Install dependencies via:
   `npm ci`
3. Create the production build:
   `npm run build`
4. Start the frontend server:
   `npm run start`

## 🌐 Custom Domain Setup

For a professional production release, configure custom domains for both services:
- **Frontend**: Configure your DNS provider to point `app.yourdomain.com` to your frontend hosting provider.
- **Backend**: Configure `api.yourdomain.com` to point to your backend hosting provider.

*Ensure both domains are secured with HTTPS (TLS) certificates. The application architecture prohibits plain HTTP API calls in production.*

## 🔒 Security Summary
- **CORS Configured**: Restricted exclusively to the configured frontend origin. No wildcard `*` allowed.
- **No Stack Traces**: All backend exceptions are caught globally and normalized into safe user-facing errors (`error_code`).
- **No Exposed Secrets**: Tested against Git and bundle extraction. `.env` files are never tracked.
- **Data Safety**: Injection attacks are mitigated by Pydantic V2 validations and PyMongo drivers. 

## 🛠 Troubleshooting

If issues arise during or after deployment, check the following common scenarios:

- **Frontend cannot reach backend**: Ensure `NEXT_PUBLIC_API_BASE_URL` is exactly matching the backend domain.
- **CORS error in Browser Console**: Verify `FRONTEND_ORIGIN` in the backend environment matches the exact URL of the frontend (including `https://` and without trailing slashes).
- **MongoDB connection failure**: Check the backend deployment logs. Ensure the `MONGODB_URI` is correct and the database firewall rules allow the backend's IP address.
- **Backend Unhealthy**: Verify the backend logs during startup. Check if `GET /health` returns `{"status": "ok"}`.
- **Production build failure**: Inspect the deployment build logs. Ensure the correct Node.js version (18+) and Python version (3.11+) are used.
