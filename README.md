1. Prerequisites
Node.js (v18.0.0 or higher)

npm or yarn or pnpm

2. Installation
Clone the repository and install the dependencies:

git clone https://github.com/your-username/flowva-dashboard.git
cd flowva-dashboard
pnpm install

3. Environment Configuration
Create a .env file in the root directory and add your authentication provider keys (if using Supabase, Firebase, etc.):

VITE_AUTH_API_KEY=********
VITE_BASE_URL=**********

4. Running the Project
Start the development server:

pnpm run dev

The application will be available at http://localhost:5173

5. Building for Production
To create an optimized production build:

pnpm run build

Deployment Note
When deploying this project, you must manually add your Supabase credentials to your hosting provider's Environment Variables section. 

| Variable Name | Value |
| :--- | :--- |
| `VITE_SUPABASE_URL` | Your Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase Anon Key |

**Important:** Local `.env` files are ignored by git for security. Ensure these are set in your CI/CD pipeline.
