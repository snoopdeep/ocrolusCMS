# Ocrolus Assignment 

A containerized Node.js application with MongoDB database support.

## Prerequisites

- [Node.js](https://nodejs.org/) v18+ (for Method 1)
- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) (for Methods 2 & 3)

---
### API Documentation 
```bash 
https://documenter.getpostman.com/view/32714719/2sB2qfAK3s
```

## 🚀 Three Ways to Run the Application

Choose the method that best fits your needs:

### Method 1: Run Locally
### Method 2: Docker with Cloud Database
### Method 3: Docker with Separate Database Container

---

## 📋 Method 1: Run Locally

**Requirements:** Node.js installed locally

### Steps:

1. **Clone the repository**
   ```bash
   git clone https://github.com/snoopdeep/ocrolusCMS.git
   cd ocrolusCMS
   ```

2. **Get environment file**
```bash
   touch .env
   ```
   - Place the `.env` file in the project root directory

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Run the application**
   ```bash
   npm start
   ```

5. **Access the application**
   - Access the backend service at: **http://localhost:3000**
   - Uses cloud MongoDB database with existing data

---

## 🐳 Method 2: Docker with Cloud Database

**Requirements:** Docker and Docker Compose

### Steps:

1. **Clone the repository**
   ```bash
   git clone https://github.com/snoopdeep/ocrolusCMS.git
   cd ocrolusCMS
   ```

2. **Get environment file**
```bash
   touch .env
   ```
   - Place the `.env` file in the project root directory

3. **Run the container**
   ```bash
   docker-compose -f docker-compose.cloud.yml up --build
   ```

4. **Access the application**
   - Access the backend service at: **http://localhost:3000**
   - Uses cloud MongoDB database with existing data

5. **Stop the container**
   ```bash
   docker-compose -f docker-compose.cloud.yml down
   ```

---

## 🗄️ Method 3: Docker with Separate Database Container

**Requirements:** Docker and Docker Compose

### Steps:

1. **Clone the repository**
   ```bash
   git clone https://github.com/snoopdeep/ocrolusCMS.git
   cd ocrolusCMS
   ```

2. **Setup local environment**
   ```bash
   cp .env.example .env
   ```

3. **Edit the `.env` file**
   Open `.env` and configure:
   ```env
   PORT=3000
   MONGODB_URL=mongodb://mongo:27017/ocrolusDb
   JWT_SECRET_STRING=your-secure-secret-key-here
   ```
   > ⚠️ **Important:** Replace `your-secure-secret-key-here` with a strong, unique secret

4. **Run with separate database container**
   ```bash
   docker-compose up --build
   ```

5. **Access the application**
   - Access the backend service at: **http://localhost:3000**
   - Uses local MongoDB database

6. **Stop the containers**
   ```bash
   # Stop containers 
   docker-compose down
   
   # Stop containers and remove all data
   docker-compose down -v
   ```

---

## 🛠️ Database Migration Guide

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Get environment file**
```bash
   touch .env
   ```
   - Place the `.env` file in the project root directory
   
2. **Available Migration Commands:**

   - **Check migration status:**
     ```bash
     npm run migrate:status
     ```

   - **Apply all pending migrations:**
     ```bash
     npm run migrate:up
     ```

   - **Rollback a specific migration:**
     ```bash
     npm run migrate:down <migration_name>
     ```
     Example:
     ```bash
     npm run migrate:down 001_add_article_views_field
     ```

## ✅ Example

```bash
npm run migrate:status           # See current migration state
npm run migrate:up               # Apply the migration
npm run migrate:status           # Confirm it's applied
npm run migrate:down 001_add_article_views_field  # Roll it back
npm run migrate:status           # Confirm it's rolled back
```
---
