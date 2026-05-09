# PlotBuddy 🏡

Matching landowners with temporary business needs like garages, godowns, or fabrication units in the Delhi NCR area. PlotBuddy is a MERN stack marketplace that allows landowners to list their idle plots for commercial leasing and enables potential tenants to search, filter, and view detailed listings.

---

## 🚀 Key Features

### 🏢 Administrative Power
- **Dedicated Admin Dashboard**: A specialized interface (`/admin`) for platform oversight.
- **User Management**: Administrators can list, edit, delete, or temporarily deactivate users.
- **Plot Management**: Direct control over all listings, including the ability to assign plots to specific users and toggle publication status.
- **Platform Analytics**: High-level overview of total users, active listings, and platform growth.

### 🔐 Robust Authentication
- **Dual-Method Auth**: Support for both traditional Email/Password registration and seamless Google SSO.
- **Role-Based Access**: Strict separation between `administrator` and `user` roles to secure sensitive actions.
- **Secure Sessions**: JWT-based authentication with protected frontend routes.

### 📍 Advanced Listing Management
- **Multi-Step Registration**: Intuitive 3-step listing process with live preview.
- **Location Intelligence**: Support for manual addresses, exact Google Maps links, and coordinate-based regional validation (Delhi NCR).
- **Amenities Tracking**: Categorize plots by availability of Fencing, Water, and Electricity.

### 🎨 Premium UI/UX
- **Modular Architecture**: Reusable components for Headers, Footers, and Layouts.
- **Responsive Design**: Tailored experiences for both desktop and mobile users using Tailwind CSS v4.
- **Dynamic Interactions**: Micro-animations, hover effects, and real-time state updates.

---

## 💻 Developer Documentation

### Tech Stack
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS v4, Lucide React, Axios, React Router 6.
- **Backend**: Node.js, Express.js, Mongoose (MongoDB).
- **Auth**: JSON Web Tokens (JWT), Google OAuth 2.0.
- **Media**: Cloudinary (via Multer).

### 1. Installation

Clone the repository and install dependencies:

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Environment Variables

Create `.env` files in both directories:

**Server (`server/.env`):**
```env
PORT=5001
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

**Client (`client/.env`):**
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### 3. Running Locally

**Start Backend:**
```bash
cd server
npm start # or npx nodemon index.js
```

**Start Frontend:**
```bash
cd client
npm run dev
```

### 4. Project Structure
```
plotbuddy/
├── server/
│   ├── middleware/        # Auth & Admin protection
│   ├── models/            # User & Land schemas
│   ├── routes/            # Land, User, & Admin APIs
│   └── index.js           # Express entry point
└── client/
    ├── src/
    │   ├── admin/         # Admin isolated codebase
    │   │   ├── layouts/   # Admin sidebar layout
    │   │   └── pages/     # Dashboard, Users, Plots
    │   ├── components/    # Reusable UI (Header, Footer, Form)
    │   ├── context/       # Auth state management
    │   └── pages/         # Public-facing pages
```

---

## ⚖️ License
This project is for demonstration and commercial use. All rights reserved. © 2026 PlotBuddy.
