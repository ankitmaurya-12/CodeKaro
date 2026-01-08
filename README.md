# CodeKaro 🚀

**Real-time Collaborative Code Editor**

CodeKaro is a real-time collaborative code editor that allows multiple
users to join a shared room, write code together, and see live updates
instantly. The project is built to be scalable, extensible, and
deployment-ready for cloud platforms.

------------------------------------------------------------------------

## ✨ Features

-   🔗 Real-time collaboration using **Socket.IO**
-   🧑‍🤝‍🧑 Multiple users per room
-   ⌨️ Live code synchronization
-   ✍️ Typing indicator
-   🆔 Room-based collaboration
-   📋 Copy Room ID functionality
-   🎨 Monaco Editor (VS Code-like experience)
-   🌐 CORS-enabled backend for flexible deployment

------------------------------------------------------------------------

## 🛠 Tech Stack

### Frontend

-   React (Vite)
-   Socket.IO Client
-   Monaco Editor
-   CSS (with nesting support)

### Backend

-   Node.js
-   Express.js
-   Socket.IO
-   In-memory room & user management

------------------------------------------------------------------------

## 📁 Project Structure

    CodeKaro/
    ├── frontend/
    │   ├── src/
    │   ├── package.json
    │   └── vite.config.js
    │
    ├── backend/
    │   ├── server.js
    │   ├── package.json
    │   └── .env.example
    │
    ├── README.md
    └── .gitignore

------------------------------------------------------------------------

## 🚀 Getting Started (Local Setup)

### 1️⃣ Clone the repository

``` bash
git clone https://github.com/your-username/CodeKaro.git
cd CodeKaro
```

------------------------------------------------------------------------

### 2️⃣ Backend Setup

``` bash
cd backend
npm install
npm start
```

<!-- Server will start on:

    http://localhost:9000 -->

------------------------------------------------------------------------

### 3️⃣ Frontend Setup

``` bash
cd frontend
npm install
npm run dev
```

<!-- Frontend will run on:

    http://localhost:5173

------------------------------------------------------------------------

## 🔌 Environment Variables

Create a `.env` file in `backend/` using `.env.example` as reference.

    PORT=9000

------------------------------------------------------------------------ -->

<!-- ## 🌍 Deployment Strategy

### Current

-   **Frontend**: Vercel
-   **Backend**: Render / Railway / Fly.io (recommended for WebSockets)

### Future (AWS)

-   Frontend → S3 + CloudFront
-   Backend → EC2 / ECS
-   Load Balancer → ALB
-   Scaling → Redis + Socket.IO adapter -->

------------------------------------------------------------------------

## 🧠 Future Enhancements

-   🔐 Authentication & Authorization
-   🎭 User roles (admin, editor, viewer)
-   🌓 Theme switching (dark/light)
-   💾 Persistent storage (DB)
-   🆔 UUID-based room management
-   📊 Analytics dashboard
-   ⚖️ Load balancer support
-   ☁️ Full AWS deployment

------------------------------------------------------------------------

<!-- ## 📌 Why Monorepo?

This project uses a **monorepo structure** to keep frontend and backend
in sync during development. It allows easier scaling and clean
separation of concerns, while still enabling future service splitting if
needed.

------------------------------------------------------------------------ -->

<!-- ## 👨‍💻 Author

**Ankit Maurya**\
- GitHub: https://github.com/ankitmaurya-12

------------------------------------------------------------------------ -->

## 📜 License

This project is licensed under the MIT License.
