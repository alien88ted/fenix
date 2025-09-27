"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserDropdown } from "@/components/user-dropdown"
import { FenixLogo } from "@/components/fenix-logo"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  TrendingUpIcon, 
  TrendingDownIcon,
  BanknoteIcon,
  BuildingIcon,
  PhoneIcon,
  WalletIcon,
  SendIcon,
  AlertCircleIcon,
  GlobeIcon
} from "lucide-react"

// Lebanese market data
const lebaneseStocks = [
  { symbol: "BLOM", name: "BLOM Bank", price: 5.25, change: -0.15, changePercent: -2.78, sector: "Banking" },
  { symbol: "AUDI", name: "Bank Audi", price: 4.80, change: 0.10, changePercent: 2.13, sector: "Banking" },
  { symbol: "BEMO", name: "BEMO Bank", price: 1.85, change: -0.05, changePercent: -2.63, sector: "Banking" },
  { symbol: "HOLC", name: "Holcim Lebanon", price: 18.50, change: 0.35, changePercent: 1.93, sector: "Industrial" },
  { symbol: "SOLA", name: "Solidere A", price: 12.75, change: -0.25, changePercent: -1.92, sector: "Real Estate" },
  { symbol: "SOLB", name: "Solidere B", price: 12.60, change: -0.20, changePercent: -1.56, sector: "Real Estate" },
]

const exchangeRates = [
  { currency: "USD/LBP", rate: 89500, change: 500, changePercent: 0.56, flag: "🇺🇸" },
  { currency: "EUR/LBP", rate: 97250, change: -250, changePercent: -0.26, flag: "🇪🇺" },
  { currency: "GBP/LBP", rate: 113500, change: 750, changePercent: 0.66, flag: "🇬🇧" },
  { currency: "AED/LBP", rate: 24350, change: 150, changePercent: 0.62, flag: "🇦🇪" },
]

const localServices = [
  { name: "OMT Transfer", icon: "💸", description: "Send/receive money locally", available: true },
  { name: "Touch Recharge", icon: "📱", description: "Top up Touch mobile", available: true },
  { name: "Alfa Recharge", icon: "📞", description: "Top up Alfa mobile", available: true },
  { name: "EDL Payment", icon: "💡", description: "Pay electricity bills", available: true },
  { name: "Ogero Payment", icon: "☎️", description: "Pay internet/phone bills", available: true },
  { name: "Water Authority", icon: "💧", description: "Pay water bills", available: false },
]

const lebaneseBanks = [
  { name: "Bank of Beirut", swift: "BRBBLBBX", connected: true },
  { name: "Fransabank", swift: "FRNBBBX", connected: true },
  { name: "Credit Libanais", swift: "CLIBLBBX", connected: false },
  { name: "SGBL", swift: "SGLILBBX", connected: true },
  { name: "Byblos Bank", swift: "BYBALBBX", connected: true },
]

export default function LebanonPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedService, setSelectedService] = useState<any>(null)

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
              <h1 className="text-lg font-semibold flex items-center gap-2">
                Lebanon Market
                <span className="text-2xl">🇱🇧</span>
              </h1>
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
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="stocks">BSE Stocks</TabsTrigger>
            <TabsTrigger value="exchange">Exchange</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="banks">Banks</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Market Alert */}
            <Alert className="border-warning/50 bg-warning/10">
              <AlertCircleIcon className="h-4 w-4 text-warning" />
              <AlertDescription>
                <strong>Market Update:</strong> Lebanese Pound trading at 89,500 LBP/USD. 
                Banking restrictions still in effect. International transfers may be delayed.
              </AlertDescription>
            </Alert>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="modern-card hover:scale-105 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <BanknoteIcon className="w-5 h-5 text-muted-foreground" />
                    <span className="text-xs text-destructive">-0.56%</span>
                  </div>
                  <p className="text-2xl font-bold">89,500</p>
                  <p className="text-sm text-muted-foreground">LBP/USD Rate</p>
                </CardContent>
              </Card>

              <Card className="modern-card hover:scale-105 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingDownIcon className="w-5 h-5 text-muted-foreground" />
                    <span className="text-xs text-destructive">-1.2%</span>
                  </div>
                  <p className="text-2xl font-bold">BSE 20</p>
                  <p className="text-sm text-muted-foreground">Beirut Index</p>
                </CardContent>
              </Card>

              <Card className="modern-card hover:scale-105 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <BuildingIcon className="w-5 h-5 text-muted-foreground" />
                    <span className="text-xs text-success">Active</span>
                  </div>
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-sm text-muted-foreground">Connected Banks</p>
                </CardContent>
              </Card>

              <Card className="modern-card hover:scale-105 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <WalletIcon className="w-5 h-5 text-muted-foreground" />
                    <span className="text-xs text-primary">Fresh USD</span>
                  </div>
                  <p className="text-2xl font-bold">$2,500</p>
                  <p className="text-sm text-muted-foreground">Available</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="modern-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2 modern-button"
                    onClick={() => setActiveTab("exchange")}
                  >
                    <GlobeIcon className="w-5 h-5" />
                    <span className="text-xs">Exchange Currency</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2 modern-button"
                    onClick={() => setActiveTab("services")}
                  >
                    <SendIcon className="w-5 h-5" />
                    <span className="text-xs">OMT Transfer</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2 modern-button"
                    onClick={() => setActiveTab("services")}
                  >
                    <PhoneIcon className="w-5 h-5" />
                    <span className="text-xs">Mobile Top-up</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2 modern-button"
                    onClick={() => setActiveTab("banks")}
                  >
                    <BuildingIcon className="w-5 h-5" />
                    <span className="text-xs">Bank Transfer</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* BSE Stocks Tab */}
          <TabsContent value="stocks" className="space-y-6">
            <Card className="modern-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Beirut Stock Exchange</CardTitle>
                  <span className="text-sm text-muted-foreground">Last updated: 2 mins ago</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lebaneseStocks.map((stock) => (
                    <div
                      key={stock.symbol}
                      className="flex items-center justify-between p-4 hover:bg-secondary/20 rounded-lg transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">{stock.symbol.slice(0, 2)}</span>
                        </div>
                        <div>
                          <p className="font-semibold">{stock.symbol}</p>
                          <p className="text-sm text-muted-foreground">{stock.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${stock.price.toFixed(2)}</p>
                        <div className="flex items-center justify-end gap-1">
                          {stock.change > 0 ? (
                            <TrendingUpIcon className="w-3 h-3 text-success" />
                          ) : (
                            <TrendingDownIcon className="w-3 h-3 text-destructive" />
                          )}
                          <span className={`text-sm ${stock.change > 0 ? "text-success" : "text-destructive"}`}>
                            {stock.change > 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Alert>
              <AlertCircleIcon className="h-4 w-4" />
              <AlertDescription>
                Trading on BSE is limited. Most transactions require broker approval and may take 2-3 business days to settle.
              </AlertDescription>
            </Alert>
          </TabsContent>

          {/* Exchange Tab */}
          <TabsContent value="exchange" className="space-y-6">
            <Card className="modern-card">
              <CardHeader>
                <CardTitle>Live Exchange Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {exchangeRates.map((rate) => (
                    <div
                      key={rate.currency}
                      className="p-4 border rounded-lg hover:bg-secondary/20 transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{rate.flag}</span>
                          <span className="font-semibold">{rate.currency}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {rate.change > 0 ? (
                            <TrendingUpIcon className="w-3 h-3 text-success" />
                          ) : (
                            <TrendingDownIcon className="w-3 h-3 text-destructive" />
                          )}
                          <span className={`text-sm ${rate.change > 0 ? "text-success" : "text-destructive"}`}>
                            {rate.changePercent > 0 ? "+" : ""}{rate.changePercent}%
                          </span>
                        </div>
                      </div>
                      <p className="text-2xl font-bold">{rate.rate.toLocaleString()} LBP</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Change: {rate.change > 0 ? "+" : ""}{rate.change} LBP
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Exchange Calculator */}
            <Card className="modern-card">
              <CardHeader>
                <CardTitle>Currency Converter</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">From</label>
                    <div className="flex gap-2 mt-1">
                      <input
                        type="number"
                        placeholder="0.00"
                        className="flex-1 p-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <select className="px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary">
                        <option>USD</option>
                        <option>LBP</option>
                        <option>EUR</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">To</label>
                    <div className="flex gap-2 mt-1">
                      <input
                        type="number"
                        placeholder="0.00"
                        className="flex-1 p-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        readOnly
                      />
                      <select className="px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary">
                        <option>LBP</option>
                        <option>USD</option>
                        <option>EUR</option>
                      </select>
                    </div>
                  </div>
                  <Button className="w-full modern-button bg-primary hover:bg-primary/90">
                    Convert
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <Card className="modern-card">
              <CardHeader>
                <CardTitle>Local Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {localServices.map((service) => (
                    <Button
                      key={service.name}
                      variant="outline"
                      className={`h-20 justify-start gap-4 modern-button ${
                        !service.available ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={!service.available}
                      onClick={() => service.available && setSelectedService(service)}
                    >
                      <span className="text-2xl">{service.icon}</span>
                      <div className="text-left">
                        <p className="font-medium">{service.name}</p>
                        <p className="text-xs text-muted-foreground">{service.description}</p>
                      </div>
                      {!service.available && (
                        <span className="ml-auto text-xs bg-muted px-2 py-1 rounded">Coming Soon</span>
                      )}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Service Modal */}
            {selectedService && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <Card className="w-full max-w-md modern-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{selectedService.name}</CardTitle>
                      <button
                        onClick={() => setSelectedService(null)}
                        className="p-1 rounded-lg hover:bg-secondary/50 transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center py-4">
                      <span className="text-4xl">{selectedService.icon}</span>
                      <p className="text-sm text-muted-foreground mt-2">{selectedService.description}</p>
                    </div>
                    
                    {selectedService.name.includes("OMT") && (
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Recipient Name"
                          className="w-full p-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <input
                          type="text"
                          placeholder="Phone Number"
                          className="w-full p-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <input
                          type="number"
                          placeholder="Amount (USD)"
                          className="w-full p-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    )}

                    {selectedService.name.includes("Recharge") && (
                      <div className="space-y-3">
                        <input
                          type="tel"
                          placeholder="Phone Number (03 or 70/71/76/78/79/81)"
                          className="w-full p-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <div className="grid grid-cols-3 gap-2">
                          {["$5", "$10", "$20"].map((amount) => (
                            <Button key={amount} variant="outline" className="modern-button">
                              {amount}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={() => {
                        alert(`${selectedService.name} service initiated!`)
                        setSelectedService(null)
                      }}
                      className="w-full modern-button bg-primary hover:bg-primary/90"
                    >
                      Confirm
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Banks Tab */}
          <TabsContent value="banks" className="space-y-6">
            <Card className="modern-card">
              <CardHeader>
                <CardTitle>Connected Lebanese Banks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lebaneseBanks.map((bank) => (
                    <div
                      key={bank.swift}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/20 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <BuildingIcon className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{bank.name}</p>
                          <p className="text-xs text-muted-foreground">SWIFT: {bank.swift}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {bank.connected ? (
                          <>
                            <div className="w-2 h-2 bg-success rounded-full" />
                            <span className="text-sm text-success">Connected</span>
                          </>
                        ) : (
                          <>
                            <div className="w-2 h-2 bg-muted rounded-full" />
                            <span className="text-sm text-muted-foreground">Not Connected</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Alert>
              <AlertCircleIcon className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> International transfers are subject to Central Bank regulations. 
                Fresh USD accounts have different rules than existing accounts. Please check with your bank for current policies.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}