# 🚗 Smart Parking AI-DWDM

### Intelligent Parking Management, Data Warehousing & Data Mining System

Smart Parking AI-DWDM is a full-stack smart parking management system that combines **real-time parking management**, **MongoDB**, **MySQL Data Warehouse**, **ETL**, **analytics**, **parking recommendations**, and **machine learning/data mining**.

The system helps parking administrators monitor parking slots, manage vehicle entry and exit, analyze historical parking data, and generate intelligent parking insights.

---

## 📌 Project Overview

Traditional parking systems often depend on manual monitoring and provide limited information about parking utilization.

This project provides an integrated solution where:

- 🚘 Vehicles can be registered at entry.
- 🅿️ Parking slots can be monitored in real time.
- 🚗 Vehicle exits can be processed automatically.
- 🍃 Parking transactions are stored in MongoDB.
- 🔄 Completed transactions are automatically transferred through ETL.
- 🗄️ Historical data is stored in a MySQL Data Warehouse.
- 📊 Analytics are generated from parking data.
- 💡 Available parking slots can be recommended.
- 🤖 Machine learning modules provide a foundation for advanced parking intelligence.

---

# 🎯 Objectives

The main objectives of the project are:

1. Develop a smart parking management system.
2. Monitor parking slot availability in real time.
3. Manage vehicle entry and exit transactions.
4. Store operational parking data using MongoDB.
5. Build a MySQL-based Data Warehouse.
6. Implement an automated ETL pipeline.
7. Generate parking analytics and reports.
8. Provide intelligent parking slot recommendations.
9. Integrate machine learning and data mining capabilities.
10. Provide a user-friendly web dashboard.

---

# 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      React UI        │
                    │      Vite Frontend   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Node.js + Express  │
                    │      REST APIs        │
                    └──────────┬───────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
                 ▼                           ▼
        ┌─────────────────┐        ┌─────────────────┐
        │ MongoDB Atlas   │        │ Recommendation  │
        │                 │        │ & Analytics     │
        │ Parking Records │        └─────────────────┘
        │ Parking Slots   │
        └────────┬────────┘
                 │
                 │ Automatic ETL
                 ▼
        ┌─────────────────────┐
        │ MySQL Data Warehouse│
        │                     │
        │ Dimension Tables    │
        │ Fact Parking Table  │
        └──────────┬──────────┘
                   │
                   ▼
        ┌─────────────────────┐
        │ Analytics / ML      │
        │                     │
        │ Peak Hours          │
        │ Revenue             │
        │ Duration            │
        │ Demand Prediction   │
        └─────────────────────┘

🛠️ Technology Stack
Frontend
- React.js
- Vite
- JavaScript
- HTML
- CSS
Backend
- Node.js
- Express.js
- REST APIs
- CORS
- dotenv
Databases
MongoDB Atlas
Used as the operational database for:
- Parking slots
- Vehicle parking records
- Entry and exit information
MySQL
Used as the Data Warehouse for:
- Historical parking transactions
- Analytical queries
- Fact and dimension tables
Data Warehousing & Data Mining
- ETL
- Data Warehouse
- Fact Tables
- Dimension Tables
- OLAP-style analytical queries
- Parking analytics
Machine Learning
Python-based modules are included for:
- Classification
- Clustering
- Demand Prediction
📂 Project Structure
Smart-Parking-AI-DWDM/
│
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── mysql.js
│   │
│   ├── models/
│   │   ├── ParkingRecord.js
│   │   └── ParkingSlot.js
│   │
│   ├── routes/
│   │   ├── analyticsRoutes.js
│   │   ├── parkingRecordRoutes.js
│   │   ├── parkingRoutes.js
│   │   ├── recommendationRoutes.js
│   │   └── mlRoutes.js
│   │
│   ├── services/
│   │   ├── analyticsService.js
│   │   ├── etlService.js
│   │   └── recommendationService.js
│   │
│   ├── .env
│   ├── package.json
│   ├── server.js
│   ├── testMysql.js
│   ├── testETL.js
│   ├── mongoDiagnostic.js
│   └── runETL.js
│
├── datawarehouse/
│   ├── schema/
│   │   ├── dim_date.sql
│   │   ├── dim_location.sql
│   │   ├── dim_time.sql
│   │   └── dim_vehicle.sql
│   │
│   └── queries/
│       ├── occupancy.sql
│       ├── peak_hours.sql
│       └── revenue.sql
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Alerts.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── EntryForm.jsx
│   │   │   ├── ExitForm.jsx
│   │   │   ├── Heatmap.jsx
│   │   │   ├── Logs.jsx
│   │   │   ├── MLInsights.jsx
│   │   │   ├── ParkingMap.jsx
│   │   │   └── Recommendation.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
└── ml/
    ├── dataset/
    │   └── parking_data.csv
    ├── classification.py
    ├── clustering.py
    ├── demand_prediction.py
    └── requirements.txt

🚘 Main Features
1. Dashboard
The dashboard provides a live overview of the parking system.
It displays:
- Total parking slots
- Available slots
- Occupied slots
- Parking slot status
- Vehicle information
2. Parking Slot Management
Parking slots are classified as:
AVAILABLE
    ↓
Vehicle enters
    ↓
OCCUPIED
    ↓
Vehicle exits
    ↓
AVAILABLE

The dashboard automatically refreshes parking slot information.
3. Vehicle Entry
The entry module allows the administrator to enter:
- Vehicle Number
- Parking Slot
- Parking Area
Example:
Vehicle Number : AP39AB1234
Parking Slot   : A01
Parking Area   : A

The information is stored in MongoDB.
4. Vehicle Exit
The administrator enters the vehicle number.
The system:
1. Finds the active parking record.
2. Records the exit time.
3. Calculates parking duration.
4. Calculates the parking amount.
5. Updates the parking slot.
6. Automatically triggers ETL.
🔄 Automatic ETL
One of the major features of this project is the automated ETL pipeline.
MongoDB
   │
   │ Extract
   ▼
Parking Records
   │
   │ Transform
   ▼
Date / Time / Location / Vehicle
   │
   │ Validate
   ▼
Duplicate Check
   │
   │ Load
   ▼
MySQL Data Warehouse
   │
   ▼
Analytics

The ETL process is automatically executed after a vehicle exits.
This reduces the need for manual data transfer.
🗄️ Data Warehouse
The MySQL Data Warehouse contains dimension and fact tables.
Dimension Tables
dim_date
dim_time
dim_location
dim_vehicle

Fact Table
fact_parking

The fact table contains important transaction information such as:
- Entry time
- Exit time
- Duration
- Amount
- Parking slot
- Vehicle
- Location
- Parking status
📊 Analytics
The backend provides several analytics APIs.
GET /api/analytics/total
GET /api/analytics/revenue
GET /api/analytics/average-duration
GET /api/analytics/peak-hours
GET /api/analytics/vehicles
GET /api/analytics/live

These APIs support analysis of:
- Total parking transactions
- Revenue
- Average parking duration
- Peak parking hours
- Vehicle types
- Live occupancy
💡 Parking Recommendation
The recommendation module checks currently available parking slots.
The system:
Fetch parking slots
        ↓
Filter available slots
        ↓
Sort by area and slot number
        ↓
Select recommended slot
        ↓
Return recommendation

Example response:
{
  "success": true,
  "recommended": true,
  "recommendation": {
    "slotNumber": "A02",
    "area": "A",
    "floor": "Floor 1",
    "status": "available",
    "reason": "This slot is currently available."
  }
}

🤖 Machine Learning
The project contains a Python ML layer:
ml/
├── classification.py
├── clustering.py
├── demand_prediction.py
└── dataset/
    └── parking_data.csv

Classification
Can be used to classify parking-related states or demand categories.
Clustering
Can be used to identify similar parking usage patterns.
Demand Prediction
Can be extended to predict future parking demand.
🧪 Testing
The project was tested for:
- MongoDB connectivity
- MySQL connectivity
- Parking slot APIs
- Vehicle entry
- Vehicle exit
- Automatic ETL
- Analytics APIs
- Recommendation API
- React frontend
Example development-test results:
Test	Result
MongoDB Connection	✅ PASS
MySQL Connection	✅ PASS
Vehicle Entry	✅ PASS
Vehicle Exit	✅ PASS
Automatic ETL	✅ PASS
Analytics	✅ PASS
Recommendation	✅ PASS
Frontend	✅ PASS


📈 Sample Analytics
During development testing, representative values included:
Total Records       : 18
Total Revenue       : ₹200
Average Duration    : 7.87 minutes
Available Slots     : 10
Occupied Slots      : 0

These are development-test values and will change as new parking transactions are added.

⚙️ Installation & Setup
1. Clone the Repository
git clone https://github.com/Revathikommu/Smart-Parking-AI-DWDM.git

cd Smart-Parking-AI-DWDM

🔧 Backend Setup
Open a terminal:
cd backend

Install dependencies:
npm install

Create a .env file inside the backend folder.
Example:
PORT=5000

MONGO_URI=your_mongodb_connection_string

MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=smart_parking_dw

⚠️ Never upload your .env file to GitHub.
Start the backend:
node server.js

Backend will run on:
http://localhost:5000

🎨 Frontend Setup
Open another terminal:
cd frontend

Install dependencies:
npm install

Start the React development server:
npm run dev

Frontend will run on:
http://localhost:5173

🗄️ MySQL Data Warehouse Setup
Open MySQL Workbench and create the database:
CREATE DATABASE smart_parking_dw;

Then execute the SQL files inside:
datawarehouse/schema/

This creates the required warehouse tables.
🔐 Environment Variables
The project requires environment variables for database connections.
PORT=5000
MONGO_URI=your_mongodb_uri

MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=smart_parking_dw

Do not commit:
.env

to GitHub.
🚀 Running the Complete Project
You need two terminals.
Terminal 1 — Backend
cd Smart-Parking-AI-DWDM/backend
node server.js

Terminal 2 — Frontend
cd Smart-Parking-AI-DWDM/frontend
npm run dev

Then open:
http://localhost:5173

🔌 API Overview
Parking
GET  /api/parking/slots
POST /api/parking/entry
POST /api/parking/exit
GET  /api/parking/records

Analytics
GET /api/analytics/total
GET /api/analytics/revenue
GET /api/analytics/average-duration
GET /api/analytics/peak-hours
GET /api/analytics/vehicles
GET /api/analytics/live

Recommendation
GET /api/recommendation

Machine Learning
/api/ml

🔮 Future Scope
The system can be enhanced with:
- 📷 Automatic Number Plate Recognition
- 📡 IoT-based parking sensors
- 💳 Online parking payments
- 🤖 Advanced demand prediction
- 🗺️ Interactive parking maps
- 🔔 Real-time notifications
- 👤 User authentication
- ☁️ Cloud deployment
- 📱 Mobile application
- 🔄 Real-time WebSocket updates
- 🧠 Advanced AI-based slot recommendation
👨‍💻 Project Team
Project: Smart Parking AI-DWDM
Domain:
Data Warehousing & Data Mining + Artificial Intelligence
Institution: PVPSIT
Department: Computer Science & Engineering
Academic Year: 2025–26
Team Members
[Student Name] – [Roll Number]
[Student Name] – [Roll Number]
[Student Name] – [Roll Number]

📚 Learning Outcomes
Through this project, we worked with:
- Full-stack web development
- REST API development
- MongoDB
- MySQL
- Data Warehousing
- ETL
- Data Mining
- Machine Learning
- React
- Node.js
- Database integration
- Software architecture
- Git & GitHub
⭐ Project Highlights
✅ Full-Stack Smart Parking System
✅ MongoDB Atlas Integration
✅ MySQL Data Warehouse
✅ Automatic ETL
✅ Real-Time Slot Monitoring
✅ Vehicle Entry / Exit
✅ Parking Analytics
✅ Smart Recommendation
✅ Machine Learning Layer
✅ React Dashboard

📄 Documentation
Project documentation and presentation are available as part of the project deliverables.
📜 License
This project is developed as an academic project for educational purposes.
⭐ If you find this project useful, consider giving the repository a star!

### 📌 How to add it to your GitHub

From your project root:

```powershell
cd C:\Smart-Parking-AI-DWDM

Create/open:
README.md

Paste the above content and save.
Then:
git add README.md
git commit -m "Add professional project README"
git push origin main

Your GitHub repository will then have a much more professional project description.






    








nenu em add cheyali read me file lo correct ga evuu





 






Yes 👍 README.md lo exactly em pettalo nenu clean ga final version istanu.
Meeru entire content ni copy → README.md lo paste → save cheyyandi.
Important: .env, passwords, MongoDB URI, MySQL password README lo pettakandi.

# 🚗 Smart Parking AI-DWDM

### Intelligent Parking Management, Data Warehousing & Data Mining System

Smart Parking AI-DWDM is a full-stack smart parking management system that combines real-time parking management, MongoDB, MySQL Data Warehouse, ETL, analytics, parking recommendations, and machine learning.

The system allows administrators to monitor parking slots, manage vehicle entry and exit, store parking transactions, analyze historical data, and generate intelligent parking insights.

---

## 📌 Project Overview

Traditional parking systems often depend on manual monitoring and provide limited analytical information.

This project provides an integrated smart parking solution with:

- 🚘 Vehicle Entry and Exit Management
- 🅿️ Real-Time Parking Slot Monitoring
- 🍃 MongoDB Atlas for Operational Data
- 🔄 Automatic ETL Pipeline
- 🗄️ MySQL Data Warehouse
- 📊 Parking Analytics
- 💡 Smart Parking Recommendation
- 🤖 Machine Learning and Data Mining
- 💻 React-based Web Dashboard

---

## 🎯 Objectives

The main objectives of this project are:

1. To develop a smart parking management system.
2. To monitor parking slot availability in real time.
3. To manage vehicle entry and exit transactions.
4. To store operational parking data using MongoDB.
5. To build a MySQL-based Data Warehouse.
6. To implement an automatic ETL process.
7. To analyze historical parking data.
8. To provide parking slot recommendations.
9. To integrate Machine Learning and Data Mining techniques.
10. To provide an easy-to-use web dashboard.

---

## 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      React + Vite    │
                    │     Web Dashboard    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Node.js + Express  │
                    │      REST APIs       │
                    └──────────┬───────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    ▼                     ▼
          ┌─────────────────┐    ┌─────────────────┐
          │  MongoDB Atlas  │    │ Recommendation  │
          │                 │    │   & Analytics   │
          │ Parking Records │    └─────────────────┘
          │ Parking Slots   │
          └────────┬────────┘
                   │
                   │ Automatic ETL
                   ▼
          ┌─────────────────────┐
          │ MySQL Data Warehouse│
          │                     │
          │ Dimension Tables    │
          │ Fact Parking Table  │
          └──────────┬──────────┘
                     │
                     ▼
          ┌─────────────────────┐
          │ Analytics & ML      │
          │                     │
          │ Peak Hours          │
          │ Revenue             │
          │ Duration            │
          │ Demand Prediction   │
          └─────────────────────┘

🛠️ Technology Stack
Frontend
- React.js
- Vite
- JavaScript
- HTML
- CSS
Backend
- Node.js
- Express.js
- REST APIs
- CORS
- dotenv
Databases
- MongoDB Atlas
- MySQL
Data Warehousing
- MySQL Data Warehouse
- Fact Tables
- Dimension Tables
- ETL
- Analytical Queries
Machine Learning
- Python
- Classification
- Clustering
- Demand Prediction
Development Tools
- Visual Studio Code
- MySQL Workbench
- MongoDB Atlas
- Git
- GitHub
📂 Project Structure
Smart-Parking-AI-DWDM/
│
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── mysql.js
│   │
│   ├── models/
│   │   ├── ParkingRecord.js
│   │   └── ParkingSlot.js
│   │
│   ├── routes/
│   │   ├── analyticsRoutes.js
│   │   ├── parkingRecordRoutes.js
│   │   ├── parkingRoutes.js
│   │   ├── recommendationRoutes.js
│   │   └── mlRoutes.js
│   │
│   ├── services/
│   │   ├── analyticsService.js
│   │   ├── etlService.js
│   │   └── recommendationService.js
│   │
│   ├── .env
│   ├── package.json
│   ├── server.js
│   ├── testMysql.js
│   ├── testETL.js
│   ├── mongoDiagnostic.js
│   └── runETL.js
│
├── datawarehouse/
│   ├── schema/
│   │   ├── dim_date.sql
│   │   ├── dim_location.sql
│   │   ├── dim_time.sql
│   │   ├── dim_vehicle.sql
│   │   └── fact_parking.sql
│   │
│   └── queries/
│       ├── occupancy.sql
│       ├── peak_hours.sql
│       └── revenue.sql
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Alerts.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── EntryForm.jsx
│   │   │   ├── ExitForm.jsx
│   │   │   ├── Heatmap.jsx
│   │   │   ├── Logs.jsx
│   │   │   ├── MLInsights.jsx
│   │   │   ├── ParkingMap.jsx
│   │   │   └── Recommendation.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
└── ml/
    ├── dataset/
    │   └── parking_data.csv
    ├── classification.py
    ├── clustering.py
    ├── demand_prediction.py
    └── requirements.txt

🚘 Features
1. Dashboard
The dashboard provides a live overview of the parking system.
It displays:
- Total Parking Slots
- Available Slots
- Occupied Slots
- Parking Slot Status
- Vehicle Information
2. Parking Slot Management
The system maintains the status of each parking slot.
AVAILABLE
    │
    │ Vehicle Entry
    ▼
OCCUPIED
    │
    │ Vehicle Exit
    ▼
AVAILABLE

3. Vehicle Entry
The administrator can enter:
- Vehicle Number
- Parking Slot
- Parking Area
Example:
Vehicle Number : AP39AB1234
Parking Slot   : A01
Parking Area   : A

The transaction is stored in MongoDB.
4. Vehicle Exit
The administrator enters the vehicle number.
The system:
1. Finds the active parking record.
2. Records the exit time.
3. Calculates parking duration.
4. Calculates the parking amount.
5. Updates the parking slot status.
6. Automatically triggers the ETL process.
🔄 ETL Process
The project implements an automatic ETL pipeline.
MongoDB
   │
   │ Extract
   ▼
Parking Records
   │
   │ Transform
   ▼
Date / Time / Location / Vehicle
   │
   │ Validate
   ▼
Duplicate Check
   │
   │ Load
   ▼
MySQL Data Warehouse
   │
   ▼
Analytics

The ETL process is automatically executed after vehicle exit.
🗄️ Data Warehouse
The MySQL Data Warehouse contains dimension and fact tables.
Dimension Tables
dim_date
dim_time
dim_location
dim_vehicle

Fact Table
fact_parking

The fact table stores:
- Parking ID
- Date
- Time
- Location
- Vehicle
- Slot Number
- Entry Time
- Exit Time
- Duration
- Amount
- Parking Status
📊 Analytics
The project provides APIs for parking analytics.
GET /api/analytics/total

GET /api/analytics/revenue

GET /api/analytics/average-duration

GET /api/analytics/peak-hours

GET /api/analytics/vehicles

GET /api/analytics/live

The analytics module provides information about:
- Total Parking Transactions
- Revenue
- Average Parking Duration
- Peak Parking Hours
- Vehicle Information
- Live Parking Occupancy
💡 Smart Parking Recommendation
The recommendation module identifies currently available parking slots.
Fetch Parking Slots
        ↓
Filter Available Slots
        ↓
Sort by Area
        ↓
Sort by Slot Number
        ↓
Select Recommended Slot
        ↓
Display Recommendation

The recommendation contains:
- Slot Number
- Area
- Floor
- Status
- Recommendation Reason
🤖 Machine Learning & Data Mining
The project includes a Python-based ML layer.
ml/
├── classification.py
├── clustering.py
├── demand_prediction.py
└── dataset/
    └── parking_data.csv

Classification
Used as a foundation for classifying parking-related states or categories.
Clustering
Can be used to identify similar parking usage patterns.
Demand Prediction
Can be extended to predict future parking demand and support capacity planning.
🧪 Testing
The following components were tested during development:
Component	Status
MongoDB Connection	✅ PASS
MySQL Connection	✅ PASS
Parking Slot API	✅ PASS
Vehicle Entry	✅ PASS
Vehicle Exit	✅ PASS
Automatic ETL	✅ PASS
Analytics APIs	✅ PASS
Recommendation API	✅ PASS
React Frontend	✅ PASS


📈 Sample Development Results
Representative development-test values:
Total Records       : 18
Total Revenue       : ₹200
Average Duration    : 7.87 minutes
Available Slots     : 10
Occupied Slots      : 0

These values can change as new parking transactions are added.

⚙️ Installation
Step 1 — Clone Repository
git clone https://github.com/Revathikommu/Smart-Parking-AI-DWDM.git

cd Smart-Parking-AI-DWDM

🔧 Backend Setup
cd backend

Install dependencies:
npm install

Create a .env file inside the backend folder.
PORT=5000

MONGO_URI=your_mongodb_connection_string

MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=smart_parking_dw

⚠️ Never upload .env or database passwords to GitHub.
Start the backend:
node server.js

Backend:
http://localhost:5000

🎨 Frontend Setup
Open another terminal.
cd frontend

Install dependencies:
npm install

Start the frontend:
npm run dev

Frontend:
http://localhost:5173

🗄️ MySQL Data Warehouse Setup
Open MySQL Workbench and create the database:
CREATE DATABASE smart_parking_dw;

Then execute the SQL files located inside:
datawarehouse/schema/

🔐 Environment Variables
The following environment variables are required:
PORT=5000

MONGO_URI=your_mongodb_uri

MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=smart_parking_dw

Do not commit .env to GitHub.
🚀 Running the Project
Terminal 1 — Backend
cd Smart-Parking-AI-DWDM/backend
node server.js

Terminal 2 — Frontend
cd Smart-Parking-AI-DWDM/frontend
npm run dev

Open:
http://localhost:5173

🔌 API Endpoints
Parking
GET  /api/parking/slots
POST /api/parking/entry
POST /api/parking/exit
GET  /api/parking/records

Analytics
GET /api/analytics/total
GET /api/analytics/revenue
GET /api/analytics/average-duration
GET /api/analytics/peak-hours
GET /api/analytics/vehicles
GET /api/analytics/live

Recommendation
GET /api/recommendation

🔮 Future Scope
Future enhancements can include:
- 📷 Automatic Number Plate Recognition
- 📡 IoT-based Parking Sensors
- 💳 Online Parking Payment
- 🤖 Advanced Parking Demand Prediction
- 🗺️ Interactive Parking Maps
- 🔔 Real-Time Notifications
- 👤 User Authentication
- ☁️ Cloud Deployment
- 📱 Mobile Application
- 🔄 WebSocket-Based Real-Time Updates
- 🧠 Advanced AI-Based Slot Recommendation
📚 Learning Outcomes
This project provided practical experience in:
- Full-Stack Web Development
- React.js
- Node.js
- Express.js
- MongoDB
- MySQL
- Data Warehousing
- ETL
- Data Mining
- Machine Learning
- REST APIs
- Database Integration
- Git & GitHub
👨‍💻 Project Information
Project Name: Smart Parking AI-DWDM
Domain: Data Warehousing & Data Mining + Artificial Intelligence
Institution: PVPSIT
Department: Computer Science & Engineering
Academic Year: 2025–26
Team Members
[Student Name] – [Roll Number]
[Student Name] – [Roll Number]
[Student Name] – [Roll Number]

⭐ Project Highlights
✅ Full-Stack Smart Parking System
✅ Real-Time Parking Slot Monitoring
✅ MongoDB Atlas Integration
✅ MySQL Data Warehouse
✅ Automatic ETL
✅ Vehicle Entry & Exit
✅ Parking Analytics
✅ Smart Slot Recommendation
✅ Machine Learning Layer
✅ React Dashboard

📄 Documentation
The project includes:
- Project Report
- Project Presentation
- Data Warehouse Schema
- Source Code
- Machine Learning Modules
📜 License
This project is developed as an academic project for educational purposes.
