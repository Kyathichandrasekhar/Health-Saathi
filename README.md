# 🏥 Health Saathi — Smart Hospital Queue Management System

A full-stack web application for hospital queue management, appointment booking, QR ticketing, and AI health assistance.

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + TypeScript, Tailwind CSS, Vite |
| **Backend (Node)** | Express.js — core routes, auth, payments, queue, QR |
| **Backend (FastAPI)** | Python FastAPI — AI assistant, predictions, analytics |
| **Database** | Firebase Firestore |
| **Auth** | Firebase Authentication |
| **Payments** | Razorpay (test mode) |
| **Real-time** | Socket.io (WebSocket queue updates) |
| **QR Codes** | qrcode.react (frontend) + qrcode (backend) |
| **DevOps** | Docker + Docker Compose |

## 📁 Project Structure

```
SmartHospitalApp/
├── frontend/                  # React + Tailwind (UI)
├── backend-node/              # 🟢 Main Backend (Node + Express)
├── backend-fastapi/           # 🟣 AI Backend (Python FastAPI)
├── firebase/                  # Firebase config (rules)
├── docker/                    # Dockerfiles & docker-compose
├── .env                       # Root environment variables
├── README.md
└── .gitignore
```

## 📦 Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+
- Firebase project (with Auth + Firestore enabled)

### 1. Clone & Configure
```bash
cp .env.example .env
# Fill in your Firebase + Razorpay keys
```

### 2. Frontend Setup
```bash
cd SmartHospitalApp/frontend
npm install
npm run dev        # starts at http://localhost:5173
```

### 3. Node Backend Setup
```bash
cd SmartHospitalApp/backend-node
npm install
npm run dev        # starts at http://localhost:8000
```

### 4. FastAPI Backend Setup
```bash
cd SmartHospitalApp/backend-fastapi
pip install -r requirements.txt
cd app
python main.py     # starts at http://localhost:8001
```

### 5. Docker (Optional)
```bash
cd SmartHospitalApp/docker
docker-compose up --build
```

### 6. Environment Variables
Edit `.env` in the project root:

| Variable | Description |
|----------|-------------|
| `VITE_FIREBASE_API_KEY` | Firebase web API key |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_RAZORPAY_KEY` | Razorpay test key |
| `RAZORPAY_KEY_ID` | Razorpay backend key |
| `RAZORPAY_KEY_SECRET` | Razorpay backend secret |
| `FIREBASE_SERVICE_ACCOUNT_PATH` | Path to Firebase service account JSON |
| `VITE_API_URL` | Node backend URL (default: `http://localhost:8000/api`) |
| `VITE_FASTAPI_URL` | FastAPI AI URL (default: `http://localhost:8001/api/v1`) |

> **Note:** The app runs in demo mode without real keys configured.

## 🎯 Features

1. **Home Page** — Map with nearby hospitals, search, ETA
2. **Auth** — Firebase login/signup with role selection (Patient/Admin)
3. **Booking** — Multi-step: Hospital → Doctor → Slot → Confirm
4. **Payment** — Razorpay integration (test mode)
5. **QR Ticket** — Digital ticket with QR code and token number
6. **Dashboard** — Appointments, queue status, travel alerts
7. **Admin Panel** — QR scanner, patient check-in, queue management
8. **Health Assistant** — AI symptom-based chat with remedies and food advice
9. **Queue System** — FIFO queue with live WebSocket position tracking
10. **Predictions** — Wait time estimation, hospital demand forecasting
11. **Analytics** — Hospital stats and trends

## 📡 API Endpoints

### Node Backend (`:8000`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/verify` | Verify Firebase token |
| GET | `/api/hospitals` | List all hospitals |
| GET | `/api/hospitals/nearby` | Nearby hospitals with ETA |
| GET | `/api/hospitals/{id}/doctors` | Doctors by hospital |
| GET | `/api/booking/slots` | Available time slots |
| POST | `/api/booking/create` | Create appointment |
| POST | `/api/payment/create-order` | Create Razorpay order |
| POST | `/api/payment/verify` | Verify payment |
| POST | `/api/queue/check-in` | Check in patient |
| GET | `/api/queue/status/{doctorId}` | Queue status |
| POST | `/api/qr/generate` | Generate QR code |
| POST | `/api/qr/validate` | Validate QR code |
| POST | `/api/assistant/chat` | Health assistant (proxied to FastAPI) |

### FastAPI AI Backend (`:8001`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | AI service health check |
| POST | `/api/v1/assistant/chat` | AI health assistant |
| POST | `/api/v1/prediction/wait-time` | Wait time prediction |
| POST | `/api/v1/prediction/demand` | Hospital demand prediction |
| GET | `/api/v1/analytics/hospital/{id}/stats` | Hospital analytics |
| GET | `/api/v1/analytics/trends` | Overall trends |
