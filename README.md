# 🚀 Full-Stack MERN Portfolio & Social Platform

A production-ready, full-stack web application built to showcase modern development skills. This platform goes beyond a static portfolio by integrating a fully functional social feed, secure authentication, role-based access control, and AI-powered content generation.

**Live Frontend (Vercel):** [https://thefolio-mern-zitch-dev.vercel.app/]
**Live Backend (Render):** [https://zitchportfolio-backend.onrender.com]

## 🛠️ Tech Stack & Architecture

* **Frontend:** React.js, Axios, CSS/Tailwind (Deployed on Vercel)
* **Backend:** Node.js, Express.js (Deployed on Render)
* **Database:** MongoDB Atlas (NoSQL)
* **Media Storage:** Cloudinary
* **AI Integration:** Google Gemini 1.5 Flash API

## ✨ Key Features

### Security & Identity
* **JWT & OTP:** Secure user sessions using JSON Web Tokens, coupled with One-Time Password (OTP) email verification for account creation.
* **Role-Based Access Control (RBAC):** Distinct `member` and `admin` roles dictating permissions across the application.
* **Rate Limiting:** Backend logic preventing API abuse (e.g., users are limited to changing their profile picture once every 24 hours).

### Content & Social Engine
* **Global Feed:** Real-time aggregation of user posts with category tagging (Project, Learning, Update).
* **Dynamic Media:** Seamless image uploads processed and hosted via Cloudinary.
* **Micro-interactions:** Author badges in comments, dynamic "time ago" timestamps, and post reactions.

### 🤖 The "Magic Polish" AI
Integrated a custom writing assistant powered by the Gemini API. Users can draft raw thoughts, click a button, and the backend proxies a request to instantly rewrite the text into professional, engaging copy.

### 🛡️ Admin God Mode
A dedicated moderation layer allowing administrators to view live platform statistics (total registered users) and actively moderate/delete content from the global feed to ensure community safety.

### 🎨 Dynamic 2D Theme Engine
A two-dimensional theme system allowing users to toggle between Light and Dark modes while selecting from 7 custom accent colors (Red, Green, Blue, Purple, Yellow, Orange, and Monochrome). Preferences are persisted in local storage for a seamless experience across sessions.

## 💻 Local Development Setup

To run this project locally, you will need two terminal windows (one for the frontend, one for the backend).

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd portfolio-backend
npm install
\`\`\`
Create a `.env` file in the `portfolio-backend` directory with the following variables:
\`\`\`text
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GEMINI_API_KEY=your_gemini_key
\`\`\`
Start the server:
\`\`\`bash
npm run dev
\`\`\`

### 3. Frontend Setup
\`\`\`bash
cd MY-PORTFOLIO2
npm install
\`\`\`
Create a `.env` file in the root directory with the following variable:
\`\`\`text
REACT_APP_BACKEND_URL=http://localhost:5000
\`\`\`
Start the React app:
\`\`\`bash
npm start
\`\`\`

## 👨‍💻 About the Developer
Built by **Emmanuel John P. Bernal (Zitch)**, a 3rd-year BS Computer Science student at DMMMSU. Passionate about "vibe coding," rapid prototyping, and building robust full-stack architectures.
