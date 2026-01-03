## Project Overview

**HyFriend** is a modern, full-stack real-time chat application inspired by WhatsApp, featuring:
- One-on-one messaging
- Voice and video calls
- Emoji and media support (images, audio)
- User onboarding and profile management
- Multi-language support and translation
- Real-time notifications and message status
- Responsive design for mobile and desktop

The project is split into two main parts:
- **Frontend:** Built with Next.js, React, TailwindCSS, and integrates with Firebase for authentication, Socket.IO for real-time communication, and Zego for WebRTC-based calls.
- **Backend:** Node.js/Express server using PostgreSQL for data storage, Socket.IO for real-time events, and RESTful APIs for authentication, messaging, and user management.


---

## Technologies Used

### Frontend
- Next.js (React 18)
- TailwindCSS
- Firebase (authentication)
- Socket.IO client
- Zego WebRTC SDK (video/voice calls)
- Emoji picker, image/audio handling, toast notifications
- Google Generative AI (for translation or smart features)
- Lingva-scraper (language support)

### Backend
- Node.js with Express
- PostgreSQL (with direct queries, not Prisma)
- Socket.IO server
- Multer (file uploads)
- CORS, dotenv, nodemon

---

## Features

- **Authentication:** Email/password (Firebase), onboarding flow
- **Chat:** Real-time messaging, message reactions, replies, search, and deletion
- **Media:** Image and audio messages, file uploads
- **Calls:** Voice and video calls (WebRTC via Zego)
- **User Profiles:** Editable profiles, avatars, language selection
- **Notifications:** Real-time, with sound preferences
- **Responsive UI:** Mobile and desktop layouts

---

## Setup Instructions

### Prerequisites
- Node.js (v16+ recommended)
- PostgreSQL database

### Backend Setup

1. `cd hyfriend_server`
2. Install dependencies: `npm install`
3. Set up your `.env` file (see below for required variables)
4. Run database migrations (see `postgres/createTable.js`)
5. Start the server: `npm start`

#### Example `.env` for Backend
```
PORT=5000
DATABASE_URL=your_postgres_connection_string
CLIENT_URL=http://localhost:3000
ZEGO_APP_ID=your_zego_app_id
ZEGO_SERVER_ID=your_zego_server_secret
```

### Frontend Setup

1. `cd hyfriend_client`
2. Install dependencies: `npm install`
3. Set up your `.env.local` file (for Firebase and API endpoints)
4. Start the development server: `npm run dev`
5. Visit [http://localhost:3000](http://localhost:3000)

#### Example `.env.local` for Frontend
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_GEGO_APP_ID=your_zego_app_id
NEXT_PUBLIC_GEGO_SERVER_ID=your_zego_server_secret
NEXT_PUBLIC_GEMINI_AI_ID=your_google_gemini_api_key
```

---

## Folder Structure

- `hyfriend_client/` — Next.js frontend
- `hyfriend_server/` — Node.js/Express backend
- `hyfriend_server/postgres/` — Database schema and connection
- `hyfriend_server/uploads/` — Uploaded images and audio files

---

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Create a Pull Request