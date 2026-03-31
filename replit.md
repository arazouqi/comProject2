# comProject2 - ClassIn Attendance System

## Project Overview
A school attendance management system with:
- **Website** (teacher/admin role): Generate QR codes for attendance events
- **Mobile app** (Expo/React Native): Students scan QR codes to mark attendance

## Architecture

### Server (`/server`)
- Node.js + Express.js backend
- Serves static frontend files from `/website/frontend`
- MongoDB Atlas database (hardcoded connection string in `util/database.js`)
- Runs on port 5000

### Website Frontend (`/website/frontend`)
- Static HTML/CSS files served by the Express server
- Pages: `signin.html`, `admindashboard.html`, `teacherdashboard.html`, `studentdashboard.html`
- Uses relative URLs for API calls (`/api/...`)

### Mobile App (`/mobile`)
- Expo/React Native app
- Students use it to scan QR codes for attendance

## Running the App

### Development (Replit)
The "Start application" workflow runs: `cd server && npm start`
Access the site at the Replit preview URL → `/signin.html`

### Test Accounts
- **Teacher**: username `Nabibby`, password `1234`
- **Student**: username `Big Z`, password `1234`
- **Admin**: username `Luca`, password `1234`

## Key Files
- `server/server.js` - Entry point, listens on port 5000
- `server/app.js` - Express app setup, routes, static files
- `server/util/database.js` - MongoDB Atlas connection
- `server/util/mailer.js` - Email notifications (requires SMTP env vars)
- `server/routes/` - API route handlers (auth, users, events)
- `server/schemas/` - Mongoose schemas (user, event)
- `server/jobs/lowAttendanceJob.js` - Cron job for low attendance emails

## Environment Variables
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` - For email notifications (optional)

## Dependencies
- express, cors, express-session, mongoose, node-cron, nodemailer, dotenv
