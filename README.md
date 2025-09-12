#  AgriMarketSoft:  AI-Enabled Farmer–Investor Marketplace

A comprehensive e-commerce platform that connects smallholder farmers in Africa with impact investors through AI-powered risk assessment and climate data analysis.

## Features

### Core Functionality
- **User Authentication & Profiles**: Secure sign-up/login for farmers, investors, and administrators
- **Project Proposal Submission**: Farmers can submit detailed mini-project proposals
- **AI-Powered Analysis**: Mistral AI integration for text analysis, risk assessment, and ROI predictions
- **Climate Data Integration**: Real-time climate data from Open-Meteo and NASA POWER APIs
- **Marketplace Browsing**: Search, filter, and sort projects based on AI scores and preferences
- **Payment Integration**: Secure payments through Stripe with escrow management
- **Comprehensive Dashboards**: Tailored dashboards for farmers, investors, and administrators

### AI & Data Features
- **Risk Scoring**: AI-driven risk assessment based on project details and climate data
- **ROI Predictions**: Machine learning models predict return on investment
- **Climate Risk Warnings**: Real-time climate risk assessment and mitigation recommendations

### Security & Reliability
- **Secure Escrow System**: Funds held securely until project milestones are met
- **JWT Authentication**: Secure token-based authentication
- **Data Validation**: Comprehensive input validation and sanitization
- **Error Handling**: Robust error handling throughout the application



### Technology Stack
- **Frontend**: Vite+React.js  with Tailwind CSS
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with Sequelize ORM (Prisma)
- **AI Integration**: Gemini AI API
- **Climate Data**: Open-Meteo and NASA POWER APIs 
- **Payment Processing**: Paystack
- **Authentication**: JWT (JSON Web Tokens)



## Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** 
- **npm** 
- **PostgreSQL** 


### API Keys Required
You'll need to obtain API keys for the following services:
- **Gemini AI Model**
- **Paystack**
- **Open-Meteo**
- **NASA POWER**

##  Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/JOSEPH-MUGO/AgriMarketSoft.git
cd ai-marketplace
```

### 2. Database Setup
```bash
Postgres
Create database AI_MARKETPLACE
user postgres
password yoour password
```

### 3. Backend Setup
```bash
cd backend

npm install

# environment variables I will send via whatsapp

```

#### Prisma: Generate Client and Apply Migrations
After configuring your database connection in the `.env` file (`DATABASE_URL=...`), generate the Prisma client and sync the schema with your database:

```bash
# from the backend directory
npx prisma generate

# optional but recommended on first setup to create tables
npx prisma migrate dev --name init

# optional: seed two admin users (password 121212)
npm run seed
```


### 5. Frontend Setup
```bash
cd frontend


npm install


```


#### Start Backend Server
```bash
cd backend
npm start
npm run dev

```

#### Start Frontend Development Server
```bash
cd frontend
npm run dev

```

