# AgroVision — System Architecture

## Overview

```
┌─────────────────────────────────────────────┐
│              Mobile (Expo RN)                │
│  Screens → Expo Router → Features → Store   │
└────────────────────┬────────────────────────┘
                     │ REST / WebSocket
┌────────────────────▼────────────────────────┐
│           Server (Express API)               │
│  Routes → Controllers → Services → Models   │
└──────┬───────────────────────────┬──────────┘
       │                           │
┌──────▼──────┐           ┌────────▼────────┐
│  MongoDB    │           │  AI Service      │
│  (primary)  │           │  (FastAPI/Python)│
└─────────────┘           └─────────────────┘
```

## Services

| Service  | Port | Description |
|----------|------|-------------|
| Server   | 5000 | Express REST API |
| Client   | 3000 | React Web App |
| AI       | 8000 | FastAPI ML Service |
| MongoDB  | 27017 | Primary Database |

## Authentication
JWT-based auth via `Authorization: Bearer <token>` header.

## File Uploads
Cloudinary via Multer middleware. Max 5MB per file.
