"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserDropdown } from "@/components/user-dropdown"
import { FenixLogo } from "@/components/fenix-logo"
import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon, TrendingDownIcon } from "lucide-react"

// Mock data for stocks and crypto
const popularStocks = [
  { symbol: "AAPL", name: "Apple Inc.", price: 178.45, change: 2.34, changePercent: 1.33, logo: "🍎" },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 142.67, change: -1.23, changePercent: -0.85, logo: "🔍" },
  { symbol: "MSFT", name: "Microsoft", price: 378.91, change: 5.67, changePercent: 1.52, logo: "🪟" },
  { symbol: "TSLA", name: "Tesla Inc.", price: 242.84, change: 8.91, changePercent: 3.81, logo: "⚡" },
  { symbol: "AMZN", name: "Amazon", price: 145.78, change: -2.45, changePercent: -1.65, logo: "📦" },
  { symbol: "META", name: "Meta Platforms", price: 312.45, change: 4.56, changePercent: 1.48, logo: "👥" },
]

const popularCrypto = [
  { symbol: "BTC", name: "Bitcoin", price: 42856.78, change: 1234.56, changePercent: 2.97, logo: "₿" },
  { symbol: "ETH", name: "Ethereum", price: 2234.45, change: -45.67, changePercent: -2.00, logo: "Ξ" },
  { symbol: "USDT", name: "Tether", price: 1.00, change: 0.00, changePercent: 0.00, logo: "₮" },
  { symbol: "BNB", name: "Binance Coin", price: 312.45, change: 8.91, changePercent: 2.93, logo: "🔶" },
  { symbol: "SOL", name: "Solana", price: 98.67, change: 5.43, changePercent: 5.82, logo: "◉" },
  { symbol: "XRP", name: "Ripple", price: 0.62, change: 0.03, changePercent: 5.08, logo: "✕" },
]

const watchlist = [
  { symbol: "NVDA", name: "NVIDIA", price: 495.22, change: 12.34, changePercent: 2.56, type: "stock", logo: "🎮" },
  { symbol: "ADA", name: "Cardano", price: 0.58, change: 0.04, changePercent: 7.41, type: "crypto", logo: "₳" },
]

export default function InvestPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedAsset, setSelectedAsset] = useState<any>(null)
  const [tradeMode, setTradeMode] = useState<"buy" | "sell">("buy")
  const [amount, setAmount] = useState("")
  const [shares, setShares] = useState("")

  const handleAssetClick = (asset: any) => {
    setSelectedAsset(asset)
    setAmount("")
    setShares("")
  }

  const handleTrade = () => {
    // Simulate trade execution
    alert(`${tradeMode === "buy" ? "Bought" : "Sold"} ${shares || "0"} shares of ${selectedAsset?.symbol} for $${amount || "0"}`)
    setSelectedAsset(null)
    setAmount("")
    setShares("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Header */}
      <header className="glass border-b border-border/20 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/")}
                className="p-2 rounded-lg hover:bg-secondary/50 modern-button transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <FenixLogo size={32} className="logo-hover" />
              <div className="h-6 w-px bg-border/30" />
              <h1 className="text-lg font-semibold">Invest</h1>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <UserDropdown />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="stocks">Stocks</TabsTrigger>
            <TabsTrigger value="crypto">Crypto</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Market Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="modern-card hover:scale-105 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">S&P 500</span>
                    <TrendingUpIcon className="w-4 h-4 text-success" />
                  </div>
                  <p className="text-2xl font-bold">4,567.18</p>
                  <p className="text-sm text-success">+1.23%</p>
                </CardContent>
              </Card>
              <Card className="modern-card hover:scale-105 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">NASDAQ</span>
                    <TrendingUpIcon className="w-4 h-4 text-success" />
                  </div>
                  <p className="text-2xl font-bold">14,234.56</p>
                  <p className="text-sm text-success">+2.15%</p>
                </CardContent>
              </Card>
              <Card className="modern-card hover:scale-105 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Bitcoin</span>
                    <TrendingUpIcon className="w-4 h-4 text-success" />
                  </div>
                  <p className="text-2xl font-bold">$42,856</p>
                  <p className="text-sm text-success">+2.97%</p>
                </CardContent>
              </Card>
              <Card className="modern-card hover:scale-105 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">ETH</span>
                    <TrendingDownIcon className="w-4 h-4 text-destructive" />
                  </div>
                  <p className="text-2xl font-bold">$2,234</p>
                  <p className="text-sm text-destructive">-2.00%</p>
                </CardContent>
              </Card>
            </div>

            {/* Your Watchlist */}
            <Card className="modern-card">
              <CardHeader>
                <CardTitle className="text-xl">Your Watchlist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {watchlist.map((item) => (
                    <div
                      key={item.symbol}
                      onClick={() => handleAssetClick(item)}
                      className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg hover:bg-secondary/30 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.logo}</span>
                        <div>
                          <p className="font-semibold">{item.symbol}</p>
                          <p className="text-sm text-muted-foreground">{item.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${item.price.toFixed(2)}</p>
                        <p className={`text-sm ${item.change > 0 ? "text-success" : "text-destructive"}`}>
                          {item.change > 0 ? "+" : ""}{item.changePercent.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="modern-card bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-xl">Popular Stocks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {popularStocks.slice(0, 3).map((stock) => (
                      <div
                        key={stock.symbol}
                        onClick={() => handleAssetClick(stock)}
                        className="flex items-center justify-between p-3 hover:bg-white/50 dark:hover:bg-black/20 rounded-lg transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{stock.logo}</span>
                          <span className="font-medium">{stock.symbol}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${stock.price}</p>
                          <p className={`text-xs ${stock.change > 0 ? "text-success" : "text-destructive"}`}>
                            {stock.change > 0 ? "+" : ""}{stock.changePercent}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="modern-card bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
                <CardHeader>
                  <CardTitle className="text-xl">Trending Crypto</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {popularCrypto.slice(0, 3).map((crypto) => (
                      <div
                        key={crypto.symbol}
                        onClick={() => handleAssetClick(crypto)}
                        className="flex items-center justify-between p-3 hover:bg-white/50 dark:hover:bg-black/20 rounded-lg transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{crypto.logo}</span>
                          <span className="font-medium">{crypto.symbol}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${crypto.price.toFixed(2)}</p>
                          <p className={`text-xs ${crypto.change > 0 ? "text-success" : "text-destructive"}`}>
                            {crypto.change > 0 ? "+" : ""}{crypto.changePercent}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Stocks Tab */}
          <TabsContent value="stocks" className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Stocks Market</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Filter</Button>
                <Button variant="outline" size="sm">Sort</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularStocks.map((stock) => (
                <Card
                  key={stock.symbol}
                  onClick={() => handleAssetClick(stock)}
                  className="modern-card hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{stock.logo}</span>
                        <div>
                          <p className="font-bold text-lg">{stock.symbol}</p>
                          <p className="text-sm text-muted-foreground">{stock.name}</p>
                        </div>
                      </div>
                      {stock.change > 0 ? (
                        <ArrowUpIcon className="w-5 h-5 text-success" />
                      ) : (
                        <ArrowDownIcon className="w-5 h-5 text-destructive" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold">${stock.price}</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${stock.change > 0 ? "text-success" : "text-destructive"}`}>
                          {stock.change > 0 ? "+" : ""}{stock.change}
                        </span>
                        <span className={`text-sm px-2 py-0.5 rounded-full ${stock.change > 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                          {stock.change > 0 ? "+" : ""}{stock.changePercent}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Crypto Tab */}
          <TabsContent value="crypto" className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Cryptocurrency</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Filter</Button>
                <Button variant="outline" size="sm">Sort</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularCrypto.map((crypto) => (
                <Card
                  key={crypto.symbol}
                  onClick={() => handleAssetClick(crypto)}
                  className="modern-card hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{crypto.logo}</span>
                        <div>
                          <p className="font-bold text-lg">{crypto.symbol}</p>
                          <p className="text-sm text-muted-foreground">{crypto.name}</p>
                        </div>
                      </div>
                      {crypto.change > 0 ? (
                        <ArrowUpIcon className="w-5 h-5 text-success" />
                      ) : (
                        <ArrowDownIcon className="w-5 h-5 text-destructive" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold">${crypto.price.toLocaleString()}</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${crypto.change > 0 ? "text-success" : "text-destructive"}`}>
                          {crypto.change > 0 ? "+" : ""}${crypto.change.toFixed(2)}
                        </span>
                        <span className={`text-sm px-2 py-0.5 rounded-full ${crypto.change > 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                          {crypto.change > 0 ? "+" : ""}{crypto.changePercent}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            <Card className="modern-card bg-gradient-to-br from-primary/10 to-primary/5">
              <CardContent className="p-8">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold">$12,456.78</h2>
                  <p className="text-muted-foreground">Total Portfolio Value</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-success text-lg font-medium">+$1,234.56</span>
                    <span className="px-2 py-1 bg-success/10 text-success rounded-full text-sm">+10.98%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="modern-card">
                <CardHeader>
                  <CardTitle>Your Holdings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🍎</span>
                        <div>
                          <p className="font-semibold">AAPL</p>
                          <p className="text-sm text-muted-foreground">10 shares</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">$1,784.50</p>
                        <p className="text-sm text-success">+2.34%</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">₿</span>
                        <div>
                          <p className="font-semibold">BTC</p>
                          <p className="text-sm text-muted-foreground">0.25 BTC</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">$10,714.20</p>
                        <p className="text-sm text-success">+2.97%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="modern-card">
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Bought AAPL</p>
                        <p className="text-sm text-muted-foreground">2 days ago</p>
                      </div>
                      <p className="font-semibold text-primary">-$178.45</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Sold ETH</p>
                        <p className="text-sm text-muted-foreground">5 days ago</p>
                      </div>
                      <p className="font-semibold text-success">+$446.89</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Trade Modal */}
        {selectedAsset && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md modern-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Trade {selectedAsset.symbol}</CardTitle>
                  <button
                    onClick={() => setSelectedAsset(null)}
                    className="p-1 rounded-lg hover:bg-secondary/50 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg">
                  <span className="text-2xl">{selectedAsset.logo}</span>
                  <div className="flex-1">
                    <p className="font-semibold">{selectedAsset.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedAsset.symbol}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${selectedAsset.price}</p>
                    <p className={`text-sm ${selectedAsset.change > 0 ? "text-success" : "text-destructive"}`}>
                      {selectedAsset.change > 0 ? "+" : ""}{selectedAsset.changePercent}%
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => setTradeMode("buy")}
                    className={`flex-1 ${tradeMode === "buy" ? "bg-primary" : "bg-secondary"}`}
                  >
                    Buy
                  </Button>
                  <Button
                    onClick={() => setTradeMode("sell")}
                    className={`flex-1 ${tradeMode === "sell" ? "bg-primary" : "bg-secondary"}`}
                  >
                    Sell
                  </Button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Amount (USD)</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value)
                        setShares((parseFloat(e.target.value) / selectedAsset.price).toFixed(4))
                      }}
                      placeholder="0.00"
                      className="w-full mt-1 p-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Shares</label>
                    <input
                      type="number"
                      value={shares}
                      onChange={(e) => {
                        setShares(e.target.value)
                        setAmount((parseFloat(e.target.value) * selectedAsset.price).toFixed(2))
                      }}
                      placeholder="0.0000"
                      className="w-full mt-1 p-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleTrade}
                  className="w-full h-12 modern-button bg-primary hover:bg-primary/90"
                  disabled={!amount || parseFloat(amount) <= 0}
                >
                  {tradeMode === "buy" ? "Buy" : "Sell"} {selectedAsset.symbol}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}