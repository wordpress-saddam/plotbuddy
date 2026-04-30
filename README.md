# PlotBuddy 🏡

Matching landowners with temporary business needs like garages, godowns, or fabrication units in the Delhi NCR area. PlotBuddy is a MERN stack marketplace that allows landowners to list their idle plots for commercial leasing, and allows potential tenants to search, filter, and view detailed listings.

---

## 📖 User Documentation

### For Landowners (Listing a Plot)
1. **Access the Portal:** Open the application in your browser (default: `http://localhost:5173`).
2. **Start Registration:** On the Home page, fill out the "Basic Info" on the registration card:
   - **Plot Title:** A catchy name for your listing (e.g., "Spacious Corner Plot").
   - **Area:** Total size in square yards.
   - **Monthly Rent:** Your expected monthly lease price in ₹.
3. **Set Location:** Click "Continue to Location". Enter the exact latitude and longitude of your plot. (Must be within Delhi NCR: Lat `28.2 - 28.9`, Lng `76.8 - 77.6`).
4. **Add Media & Amenities:** Click "Continue to Media". 
   - Check the boxes for any available amenities (Fencing, Water, Electricity).
   - Click the photo upload box to attach images of your plot (at least one image is required).
5. **Publish:** Click "Publish Listing". Your plot is now live and will appear on the Home page and the Browse Plots page!

### For Tenants (Browsing Plots)
1. **View Recent Listings:** Scroll down on the Home page to see newly added plots.
2. **Search and Filter:** Click "Browse Plots" in the top navigation bar.
   - Use the left sidebar to filter plots by Maximum Rent, Minimum Area, or specific Amenities.
   - Click "Apply Filters" to instantly update the list.
3. **View Details:** Click "Details" on any plot card to open the dedicated Plot Detail page. Here you can view the image gallery, full specifications, and contact information.

---

## 💻 Developer Documentation

### Tech Stack
- **Frontend:** React, Vite, TypeScript, Tailwind CSS v4, React Router DOM, Lucide React (Icons), Axios.
- **Backend:** Node.js, Express.js, Mongoose (MongoDB).
- **File Storage:** Cloudinary (via Multer).

### Prerequisites
- Node.js (v20.19+ or v22.12+)
- MongoDB Atlas account (or local MongoDB server)
- Cloudinary account (for image hosting)

### 1. Installation

Clone the repository and install dependencies for both the `client` and `server` folders:

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Environment Variables (Backend)

In the `server` directory, create a `.env` file with the following variables:

```env
PORT=5001
MONGODB_URI=mongodb+srv://<db_user>:<db_password>@cluster.mongodb.net/?appName=plotbuddy
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

*(Note: The server runs on port 5001 by default to avoid conflicts with macOS AirTunes on port 5000).*

### 3. Running the Application

You will need to run the backend and frontend simultaneously in two separate terminal windows.

**Start the Backend Server:**
```bash
cd server
npx nodemon index.js
# You should see: "Server is running on port 5001" and "MongoDB Connected successfully!"
```

**Start the Frontend Server:**
```bash
cd client
npm run dev
# You should see: "Local: http://localhost:5173/"
```

### 4. API Endpoints

- `POST /api/lands/register` - Creates a new plot listing. Requires `multipart/form-data` for image uploads.
- `GET /api/lands` - Returns all plots. Accepts query parameters: `minArea`, `maxRent`, `fencing`, `water`, `electricity`, `limit`.
- `GET /api/lands/:id` - Returns a specific plot by its MongoDB Object ID.

### 5. Directory Structure
```
plotbuddy/
├── server/
│   ├── config/
│   │   └── cloudinary.js      # Multer & Cloudinary setup
│   ├── models/
│   │   └── Land.js            # Mongoose Schema
│   ├── routes/
│   │   └── landRoutes.js      # API endpoint logic
│   ├── index.js               # Express server entry point
│   └── .env                   # Secrets (Not committed)
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── RegistrationForm.tsx
    │   │   └── PreviewCard.tsx
    │   ├── pages/
    │   │   ├── Home.tsx
    │   │   ├── PlotsList.tsx
    │   │   └── PlotDetail.tsx
    │   ├── App.tsx            # Global routing and layout
    │   ├── index.css          # Tailwind config and theme
    │   └── main.tsx           # React entry point
    └── vite.config.ts         # Vite & Tailwind configuration
```
