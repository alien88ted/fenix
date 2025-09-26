# Fenix Wallet Setup Guide

## Prerequisites

- Node.js 18+ and npm/yarn
- Git

## Quick Start

### 1. Clone the repository
```bash
git clone <repository-url>
cd minimal-portfolio
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
# Required: Privy Configuration
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here
PRIVY_APP_SECRET=your_privy_app_secret_here

# Optional: Database (defaults to SQLite for development)
# DATABASE_URL=postgresql://...
```

#### Getting Privy Credentials:

1. Go to [Privy Dashboard](https://dashboard.privy.io)
2. Create a new app or select existing one
3. Copy your **App ID** from the dashboard
4. Go to Settings → API Keys
5. Copy your **App Secret**

### 4. Initialize the database

```bash
# Generate Prisma client
npx prisma generate

# Create database and apply schema
npx prisma db push

# (Optional) View database in Prisma Studio
npx prisma studio
```

### 5. Run the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing

### Component Tests
Navigate to [http://localhost:3000/test](http://localhost:3000/test) to test individual components.

### Full Flow Test
Navigate to [http://localhost:3000/test/flow](http://localhost:3000/test/flow) to run comprehensive end-to-end tests.

## Features

- **Privy Authentication**: Social logins, email, and embedded wallets
- **Multi-chain Support**: Ethereum, Polygon, Arbitrum, Optimism, Base
- **Secure Wallet Management**: Embedded wallets with export capability
- **Transaction History**: Track all wallet transactions
- **Theme Support**: Dark/Light mode with smooth transitions
- **Mobile-First Design**: Responsive and optimized for mobile

## Troubleshooting

### Common Issues

1. **"PRIVY_APP_SECRET is not defined"**
   - Make sure you've added `PRIVY_APP_SECRET` to your `.env.local` file
   - Restart the development server after adding environment variables

2. **"Database connection failed"**
   - Run `npx prisma db push` to create the database
   - Check that the database file exists at `prisma/dev.db`

3. **"No wallets syncing"**
   - Ensure you have embedded wallets enabled in your Privy dashboard
   - Check that the user has created an embedded wallet during login

4. **API 500 Errors**
   - Check that both `NEXT_PUBLIC_PRIVY_APP_ID` and `PRIVY_APP_SECRET` are set
   - Verify the credentials are correct in the Privy dashboard

### Debug Mode

To see detailed logs:
1. Open browser developer console
2. Run the flow test at `/test/flow`
3. Export the logs and review any errors

## Production Deployment

### Environment Variables for Production

```env
# Required
NEXT_PUBLIC_PRIVY_APP_ID=your_production_app_id
PRIVY_APP_SECRET=your_production_secret

# Recommended for production
DATABASE_URL=your_production_database_url
NEXTAUTH_SECRET=generate_random_string

# Optional: Custom RPC endpoints for better performance
NEXT_PUBLIC_ETHEREUM_RPC_URL=your_infura_or_alchemy_url
```

### Database Migration

For production, use a managed PostgreSQL service like:
- PlanetScale
- Supabase
- Neon
- Railway

Update your `prisma/schema.prisma` provider to `postgresql` and run migrations:
```bash
npx prisma migrate deploy
```

## Support

For issues or questions:
1. Check the [Privy Documentation](https://docs.privy.io)
2. Review the test results at `/test/flow`
3. Export and share the test logs for debugging