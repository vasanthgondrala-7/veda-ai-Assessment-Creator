# Veda AI

A full-stack application split into `frontend` and `backend` directories.

## Project Structure

- `/frontend` - React application using Vite, Tailwind CSS, and Zustand.
- `/backend` - Express API server integrating with Google/Gemini SDK.

## Running Locally

1. Install dependencies in the root (which has a combined `package.json` for the development environment).
   ```bash
   npm install
   ```

2. Start the development server (runs both frontend and backend concurrently via Vite middleware in the Express server).
   ```bash
   npm run dev
   ```

3. Build for production.
   ```bash
   npm run build
   ```

4. Start the production server.
   ```bash
   npm run start
   ```

## Environment Variables

Check `.env.example` for required environment variables.

## How to Push to GitHub

1. Initialize a git repository in the root folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
2. Create a new repository on GitHub.
3. Link your local repository to GitHub and push:
   ```bash
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
   ```

## Deployment Options

Because this app has both a Node.js Express backend and a React frontend, here is the recommended way to deploy it:

### Option 1: Render (Recommended for Full-Stack)
Render can natively host this full-stack setup using the root `package.json`.
1. Go to [Render](https://render.com/) and create a new **Web Service**.
2. Connect your GitHub repository.
3. Set the **Build Command** to: `npm install && npm run build`
4. Set the **Start Command** to: `npm run start`
5. Add your environment variables (like `GEMINI_API_KEY`) in the Render dashboard.

### Option 2: Vercel (Frontend) & Railway (Backend)
If you prefer Vercel for the frontend:
1. **Frontend on Vercel**: Import the GitHub repo into Vercel. Set the Root Directory to `frontend`. Vercel will automatically detect Vite and build it.
2. **Backend on Railway/Render**: You will need to separate the Express server to its own repository or explicitly point the service to the `backend` folder, and update the frontend's API URL to point to the new backend URL.
