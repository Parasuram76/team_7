# Project Setup Instructions (Windows)

This guide provides step-by-step instructions to run the iMentor-Team-2 project on Windows.

## 1. Prerequisites
Ensure you have the following installed:
- **Node.js** (v18 recommended)
- **Python** (v3.10 recommended)
- **Docker Desktop** (Required for databases)
- **MongoDB Community Server** (Local database)
- **Tesseract OCR** (Add `tesseract` to your PATH)
- **FFmpeg** (Add `ffmpeg` to your PATH)

## 2. Environment Configuration

### Backend (`server/.env`)
Create a file named `.env` in the `server/` directory and paste the following content. **You must fill in the secrets.**

```env
PORT=2000
MONGO_URI="mongodb://localhost:27017/chatbot_gemini"

# --- Security ---
# Generate a strong string for JWT
JWT_SECRET="CHANGE_ME_TO_A_LONG_RANDOM_STRING"
# Generate a 64-char hex string (e.g. using openssl rand -hex 32 or an online generator)
ENCRYPTION_SECRET="CHANGE_ME_TO_A_64_CHAR_HEX_STRING"

# --- AI Providers ---
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
OLLAMA_API_BASE_URL="http://localhost:11434"
OLLAMA_DEFAULT_MODEL="qwen2.5:14b-instruct"

# --- Services ---
PYTHON_RAG_SERVICE_URL="http://127.0.0.1:2001"
REDIS_URL="redis://localhost:2005"
ELASTICSEARCH_URL="http://localhost:2006"
SENTRY_DSN="" 

# --- Admin ---
FIXED_ADMIN_USERNAME=admin@admin.com
FIXED_ADMIN_PASSWORD=admin123

# --- AWS (Optional) ---
S3_BUCKET_NAME=""
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_REGION="us-east-1"

# --- Email (For Nodemailer) ---
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
```

### Frontend (`frontend/.env`)
Create a file named `.env` in the `frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:2000/api
```

## 3. Install Dependencies

**Terminal 1: Node.js Backend**
```powershell
cd server
npm install
```

**Terminal 2: Frontend**
```powershell
cd frontend
npm install
```

**Terminal 3: Python RAG Service**
```powershell
cd server/rag_service
# Create virtual environment
python -m venv venv
# Activate it
.\venv\Scripts\activate
# Install requirements
pip install -r requirements.txt
# Download SpaCy model
python -m spacy download en_core_web_sm
```

## 4. Seed Database
Initialize the database with default LLM providers.

```powershell
cd server
node scripts/seedLLMs.js
```

## 5. Run the Application

You will need **4 separate terminals** running simultaneously.

**Terminal 1: Docker Services**
Ensure Docker Desktop is running, then start the containers:
```powershell
docker compose up -d
```

**Terminal 2: Python RAG Service**
```powershell
cd server/rag_service
.\venv\Scripts\activate
python app.py
```

**Terminal 3: Node.js Backend**
```powershell
cd server
npm start
```

**Terminal 4: Frontend**
```powershell
cd frontend
npm run dev
```

## 6. Access the App
Open your browser and visit:  
**http://localhost:2173** (or the port shown in your frontend terminal)
