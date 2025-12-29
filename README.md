# CipherSQLStudio

CipherSQLStudio is an interactive SQL learning platform where students can practice SQL queries, get real-time feedback, and receive AI-powered hints.

## 🚀 Tech Stack

### Frontend
- **React.js** (Vite)
- **Sass (SCSS)** for styling
- **Monaco Editor** for SQL code execution
- **Axios** for API requests

### Backend
- **Node.js & Express.js**
- **MongoDB** (Atlas) - Stores Assignments and User Progress
- **PostgreSQL** (Local) - Sandbox database for executing student queries
- **Google Gemini API** (via Axios) - AI-powered Hint Generation

### Technology Choices

**Why MongoDB?**
- Flexible schema for storing diverse assignment structures
- Easy to add new fields without migrations
- Perfect for storing JSON-like assignment data with varying table structures

**Why PostgreSQL for Sandbox?**
- Industry-standard SQL database for authentic learning experience
- Supports complex queries (JOINs, aggregations, subqueries)
- Isolated sandbox environment prevents data corruption

**Why Gemini API?**
- Advanced AI for context-aware SQL hints
- Understands both query syntax and logical errors
- Free tier suitable for educational projects

**Why React + Vite?**
- Fast development with hot module replacement
- Modern build tooling with minimal configuration
- Excellent developer experience


## ✨ Features

- **Interactive SQL Editor**: Write and run queries directly in the browser.
- **Real-time Execution**: Queries are executed securely against a PostgreSQL sandbox.
- **AI Hints**: Stuck on a query? Get a helpful, context-aware hint from Gemini AI (with rate limit handling).
- **Assignment System**: Structured assignments with descriptions, schemas, and sample data.
- **Robust Error Handling**: Friendly error messages and toast notifications.

## 🔄 Data Flow
![DataFlow Digram](https://github.com/user-attachments/assets/34414b97-b4ad-4869-bd07-973b5c1ceafa)


### Application Flow
1. **Select Assignment** → Fetch from MongoDB
2. **Load Sample Data** → Query PostgreSQL  
3. **Write Query** → Submit to backend
4. **Execute Query** → PostgreSQL returns results
5. **Request Hint** → Backend calls Gemini API → Returns hint
6. **Save Progress** → Store in MongoDB (Optional)

### Architecture

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Frontend  │────────▶│    Backend   │────────▶│  MongoDB    │
│   (React)   │         │  (Express)   │         │ (Assignments)│
└─────────────┘         └──────────────┘         └─────────────┘
      │                         │
      │                         │
      │                         ▼
      │                 ┌─────────────┐
      │                 │ PostgreSQL  │
      │                 │  (Sandbox)  │
      │                 └─────────────┘
      │                         │
      │                         │
      └────────────────────────┬┘
                               │
                               ▼
                        ┌──────────────┐
                        │  Gemini API  │
                        │   (Hints)    │
                        └──────────────┘
```

### Data Storage

**MongoDB** - Stores application data:
- **Assignments Collection**: Questions, schemas, expected outputs
- **UserProgress Collection**: User attempts, completion status

**PostgreSQL** - Query execution sandbox:
- Pre-populated tables with sample data
- Isolated environment for safe query execution
- Read-only SELECT queries only


## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v16+)
- PostgreSQL (Local instance running)
- MongoDB Connection String (Atlas or Local)
- Google Gemini API Key

### 1. Clone the Repository
```bash
git clone <repository-url>
cd CipherSQLStudio
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with the following variables:
```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/ciphersql_persistence
SANDBOX_DATABASE_URL=postgresql://user:password@localhost:5432/ciphersql_sandbox
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/ciphersql
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
```

**Seed the Database:**
Populate the MongoDB assignments and PostgreSQL sandbox data:
```bash
npm run seed
```

**Start the Server:**
```bash
npm start
```
The server will run on `http://localhost:5000`.

### 3. Frontend Setup
Navigate to the frontend directory and install dependencies:
```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/` if needed (defaults are usually fine for dev):
```env
VITE_API_URL=http://localhost:5000/api
```

**Start the Application:**
```bash
npm run dev
```
The application will open at `http://localhost:5173`.

## 📂 Project Structure

```
CipherSQLStudio/
├── backend/
│   ├── config/         # Database configurations
│   ├── controllers/    # Request handlers
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── services/       # Business logic (e.g., hint generation)
│   ├── utils/          # Error handling & helpers
│   ├── seed.js         # Database seeder script
│   └── server.js       # Entry point
│
└── frontend/
    ├── src/
    │   ├── api/        # Axios setup & endpoints
    │   ├── components/ # Reusable UI components
    │   ├── pages/      # Page views (AssignmentList, AssignmentAttempt)
    │   ├── styles/     # SCSS styling
    │   └── App.jsx     # Main React component
```
