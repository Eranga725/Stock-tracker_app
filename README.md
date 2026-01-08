# Real-Time Stock Market Dashboard

This is a full-stack web application that provides real-time stock market data, allowing users to search for stocks, view interactive charts, and manage their personal watchlist.

## Features

- **User Authentication:** Secure sign-up and sign-in functionality.
- **Stock Search:** Search for stocks using their symbols.
- **Interactive Charts:** View historical and real-time stock data with interactive charts provided by TradingView.
- **Watchlist:** Add and remove stocks from a personal watchlist.
- **Real-time Data:** (Assumed, based on project name) Fetches and displays up-to-date stock information from the Finnhub API.
- **Email Notifications:** (Inferred from Nodemailer usage) Sends email notifications.

## Technologies Used

- **Frontend:**
  - [Next.js](https://nextjs.org/) (React Framework)
  - [TypeScript](https://www.typescriptlang.org/)
  - [Tailwind CSS](https://tailwindcss.com/)
  - [shadcn/ui](https://ui.shadcn.com/) (UI Components)
  - [TradingView](https://www.tradingview.com/widget/) (Advanced Charting Library)

- **Backend:**
  - [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
  - [MongoDB](https://www.mongodb.com/) (Database)
  - [Mongoose](https://mongoosejs.com/) (Object Data Modeling)
  - [Better-Auth](https://authjs.dev/) (Authentication)
  - [Inngest](https://www.inngest.com/) (Background Jobs/Cron)
  - [Nodemailer](https://nodemailer.com/) (Email Sending)

- **API:**
  - [Finnhub API](https://finnhub.io/) (Stock Market Data)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/try/download/community) (or a MongoDB Atlas account)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd real-time-stock-market
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a file named `.env.local` in the root of your project and add the following variables.

    ```env
    # MongoDB
    MONGODB_URI=your_mongodb_connection_string

    # Better Auth (NextAuth.js)
    # Generate a secret: openssl rand -base64 32
    BETTER_AUTH_SECRET=your_auth_secret
    BETTER_AUTH_URL=http://localhost:3000

    # Finnhub API
    # Get your API key from https://finnhub.io/
    NEXT_PUBLIC_FINNHUB_API_KEY=your_finnhub_public_key
    FINNHUB_API_KEY=your_finnhub_secret_key
    
    # Gemini API
    GEMINI_API_KEY=your_gemini_api_key

    # Nodemailer (for sending emails)
    NODEMAILER_EMAIL=your_email@example.com
    NODEMAILER_PASSWORD=your_email_password
    ```

### Running the Application

Once the setup is complete, you can run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https.io/docs/app/building-your-application/deploying) for more details.