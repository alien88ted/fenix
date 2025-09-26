# Fenix Wallet Setup Guide

## 🚀 Quick Start

1. **Clone and Install**
   ```bash
   git clone https://github.com/alien88ted/fenix.git
   cd fenix
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   ```

3. **Configure Privy Authentication**
   - Go to [dashboard.privy.io](https://dashboard.privy.io)
   - Create a new app or select existing
   - Copy your App ID (starts with 'cl...')
   - Add to `.env.local`:
     ```
     NEXT_PUBLIC_PRIVY_APP_ID=cl_your_app_id_here
     ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🔗 PLASMA/XPL Network Integration

### Current Status
✅ **Implemented:**
- PLASMA API integration framework
- Real-time balance fetching
- Transaction history
- Send/receive functionality
- Network status indicators

### PLASMA Network Configuration

The app is configured to work with PLASMA/XPL network:

**Network Details:**
- Chain ID: `1007`
- RPC URL: `https://rpc.plasma.network`
- Explorer: `https://explorer.plasma.network`

### Setting up PLASMA API

1. **Get PLASMA API Key** (Optional)
   ```bash
   # Add to .env.local
   NEXT_PUBLIC_PLASMA_API_KEY=your_api_key_here
   ```

2. **The app will automatically:**
   - Try official PLASMA API first
   - Fallback to direct RPC calls
   - Generate realistic demo data if APIs unavailable

### Real Data Integration

The `PlasmaAPI` class (`lib/plasma-api.ts`) handles:

**Balance Fetching:**
```typescript
await plasmaAPI.getBalance(walletAddress)
```

**Transaction History:**
```typescript
await plasmaAPI.getTransactions(walletAddress, 10)
```

**Sending Transactions:**
```typescript
await plasmaAPI.sendTransaction(from, to, amount)
```

### Customizing for Your Network

To modify for different networks, update `lib/plasma-api.ts`:

```typescript
const PLASMA_NETWORK: PlasmaNetworkInfo = {
  name: 'YOUR_NETWORK',
  chainId: YOUR_CHAIN_ID,
  rpcUrl: 'https://your-rpc-url.com',
  explorerUrl: 'https://your-explorer.com'
};
```

## 🎯 Features Implemented

### ✅ Core Wallet Functions
- **Authentication**: Privy-powered secure login
- **Balance Display**: Real-time PLASMA network balance
- **Send USDT**: 4-step transaction flow with validation
- **Receive**: QR codes and address sharing
- **Transaction History**: Real blockchain data

### ✅ Advanced Services
- **Cash In/Out**: Agent finder (demo UI complete)
- **Pay Merchant**: QR scanner integration ready
- **Bills & Top-up**: Utility payment interface

### ✅ UI/UX Excellence
- **2025 Design System**: Apple-inspired clean aesthetics
- **Smooth Transitions**: 150ms polished animations
- **Mobile-First**: Responsive PWA-ready design
- **Dark/Light Mode**: Theme switching with persistence

## 🔧 Development

### Key Files
- `app/page.tsx` - Main wallet interface
- `lib/plasma-api.ts` - Blockchain integration
- `app/providers.tsx` - Privy configuration
- `app/globals.css` - Design system

### Testing Real Transactions

1. **Demo Mode**: Works immediately with simulated data
2. **Testnet Mode**: Configure testnet RPC in `plasma-api.ts`
3. **Mainnet Mode**: Use production PLASMA RPC endpoints

### Adding New Features

The codebase is designed for easy extension:

```typescript
// Add new service flows in app/page.tsx
{currentView === "newservice" && (
  <YourNewServiceComponent />
)}
```

## 🛠 Troubleshooting

### Common Issues

1. **Privy not loading**: Check App ID in `.env.local`
2. **Balance not updating**: Check RPC URL connectivity
3. **Transactions failing**: Verify wallet has sufficient gas

### Debugging

Enable console logs in `plasma-api.ts` to see:
- API requests and responses
- Transaction status updates
- Network connectivity issues

## 🚀 Production Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Environment Variables for Production
```bash
NEXT_PUBLIC_PRIVY_APP_ID=your_production_privy_id
NEXT_PUBLIC_PLASMA_API_KEY=your_production_api_key
```

## 📝 Next Steps

1. **Test with real PLASMA testnet**
2. **Add more service providers**
3. **Implement push notifications**
4. **Add multi-token support**

---

**Need Help?**
- Check the console for detailed error logs
- Verify all environment variables are set
- Test with demo data first before live integration