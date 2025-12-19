# TrackBuddy - Corporate Wellness Platform

## Project Structure

```
Tracker_Buddy/
├── backend/
│   ├── server.js          # Express server
│   ├── package.json       # Backend dependencies
│   ├── start.bat         # Start backend server
│   └── data/             # Data storage folder
├── frontend/
│   ├── index.html        # Main entry point
│   ├── css/
│   │   └── styles.css    # All styles
│   ├── js/
│   │   ├── auth.js
│   │   ├── dashboard.js
│   │   ├── fitness.js
│   │   ├── hydration.js
│   │   ├── nutrition.js
│   │   ├── profile.js
│   │   ├── reports.js
│   │   └── user-manager.js
│   └── pages/
│       ├── dashboard.html
│       ├── fitness.html
│       ├── hydration.html
│       ├── nutrition.html
│       ├── profile.html
│       ├── reports.html
│       ├── signin.html
│       ├── register.html
│       └── reset.html
└── README.md

## How to Run

### Backend
1. Open command prompt in `backend` folder
2. Run `start.bat` or:
   ```
   npm install
   npm start
   ```
3. Server runs on http://localhost:3000

### Frontend
1. Open `frontend/index.html` in browser
2. Or use a local server like Live Server extension in VS Code

## Features
- Nutrition tracking with local backend storage
- User authentication
- Dashboard with health metrics
- Fitness and hydration tracking
- Reports and analytics