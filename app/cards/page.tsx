"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserDropdown } from "@/components/user-dropdown"
import { FenixLogo } from "@/components/fenix-logo"
import { Switch } from "@/components/ui/switch"
import { 
  CreditCardIcon, 
  LockIcon, 
  ShieldCheckIcon, 
  WifiIcon,
  GlobeIcon,
  ShoppingCartIcon,
  BanknoteIcon,
  SettingsIcon,
  PlusIcon
} from "lucide-react"

interface CardData {
  id: string
  type: "virtual" | "physical"
  name: string
  number: string
  expiry: string
  cvv: string
  balance: number
  status: "active" | "frozen" | "pending"
  color: string
  limits: {
    daily: number
    monthly: number
    atm: number
    online: boolean
    international: boolean
    contactless: boolean
  }
}

const userCards: CardData[] = [
  {
    id: "1",
    type: "physical",
    name: "Fenix Black Card",
    number: "4532 •••• •••• 8976",
    expiry: "12/26",
    cvv: "•••",
    balance: 5000,
    status: "active",
    color: "from-gray-900 to-gray-700",
    limits: {
      daily: 2000,
      monthly: 10000,
      atm: 500,
      online: true,
      international: true,
      contactless: true
    }
  },
  {
    id: "2",
    type: "virtual",
    name: "Online Shopping Card",
    number: "5412 •••• •••• 3456",
    expiry: "08/25",
    cvv: "•••",
    balance: 1500,
    status: "active",
    color: "from-primary to-orange-600",
    limits: {
      daily: 500,
      monthly: 2000,
      atm: 0,
      online: true,
      international: false,
      contactless: false
    }
  }
]

export default function CardsPage() {
  const router = useRouter()
  const [selectedCard, setSelectedCard] = useState<CardData>(userCards[0])
  const [showCardDetails, setShowCardDetails] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [isCreatingCard, setIsCreatingCard] = useState(false)
  const [cardSettings, setCardSettings] = useState(selectedCard.limits)

  const handleFreezeCard = () => {
    const newStatus = selectedCard.status === "active" ? "frozen" : "active"
    setSelectedCard({ ...selectedCard, status: newStatus })
  }

  const handleSettingChange = (setting: keyof typeof cardSettings, value: boolean | number) => {
    setCardSettings({ ...cardSettings, [setting]: value })
  }

  const handleCreateCard = () => {
    setIsCreatingCard(true)
    // Simulate card creation
    setTimeout(() => {
      setIsCreatingCard(false)
      alert("New virtual card created successfully!")
    }, 2000)
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
              <h1 className="text-lg font-semibold">Cards</h1>
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
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="limits">Limits</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Cards Carousel */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Your Cards</h2>
                <Button
                  onClick={handleCreateCard}
                  className="modern-button bg-primary hover:bg-primary/90"
                  disabled={isCreatingCard}
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  {isCreatingCard ? "Creating..." : "New Card"}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userCards.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => setSelectedCard(card)}
                    className={`relative cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                      selectedCard.id === card.id ? "ring-2 ring-primary ring-offset-2" : ""
                    }`}
                  >
                    <div className={`relative h-56 rounded-2xl bg-gradient-to-br ${card.color} p-6 text-white overflow-hidden`}>
                      {/* Card Background Pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-20 translate-x-20" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-16 -translate-x-16" />
                      </div>

                      {/* Card Content */}
                      <div className="relative z-10 h-full flex flex-col justify-between">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs opacity-80 mb-1">{card.name}</p>
                            <p className="text-lg font-bold tracking-wider">{card.number}</p>
                          </div>
                          {card.type === "virtual" ? (
                            <WifiIcon className="w-8 h-8 opacity-80" />
                          ) : (
                            <CreditCardIcon className="w-8 h-8 opacity-80" />
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-6">
                            <div>
                              <p className="text-xs opacity-60">Valid Thru</p>
                              <p className="text-sm font-medium">{card.expiry}</p>
                            </div>
                            <div>
                              <p className="text-xs opacity-60">CVV</p>
                              <p className="text-sm font-medium">{card.cvv}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs opacity-60">Balance</p>
                              <p className="text-xl font-bold">${card.balance.toLocaleString()}</p>
                            </div>
                            <div className={`px-2 py-1 rounded-full text-xs ${
                              card.status === "active" ? "bg-green-500/20 text-green-100" : 
                              card.status === "frozen" ? "bg-blue-500/20 text-blue-100" : 
                              "bg-yellow-500/20 text-yellow-100"
                            }`}>
                              {card.status.charAt(0).toUpperCase() + card.status.slice(1)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add New Card */}
                <div
                  onClick={handleCreateCard}
                  className="relative h-56 rounded-2xl border-2 border-dashed border-border/50 hover:border-primary/50 bg-card/50 flex items-center justify-center cursor-pointer transition-all hover:bg-secondary/20"
                >
                  <div className="text-center space-y-2">
                    <PlusIcon className="w-12 h-12 mx-auto text-muted-foreground" />
                    <p className="text-sm font-medium text-muted-foreground">Create New Card</p>
                    <p className="text-xs text-muted-foreground">Virtual or Physical</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <Card className="modern-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    onClick={handleFreezeCard}
                    variant="outline"
                    className="h-20 flex-col gap-2 modern-button"
                  >
                    <LockIcon className="w-5 h-5" />
                    <span className="text-xs">
                      {selectedCard.status === "active" ? "Freeze Card" : "Unfreeze Card"}
                    </span>
                  </Button>
                  <Button
                    onClick={() => setShowCardDetails(!showCardDetails)}
                    variant="outline"
                    className="h-20 flex-col gap-2 modern-button"
                  >
                    <CreditCardIcon className="w-5 h-5" />
                    <span className="text-xs">View Details</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2 modern-button"
                  >
                    <ShieldCheckIcon className="w-5 h-5" />
                    <span className="text-xs">Report Lost</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2 modern-button"
                  >
                    <SettingsIcon className="w-5 h-5" />
                    <span className="text-xs">Settings</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Card Details */}
            {showCardDetails && (
              <Card className="modern-card bg-gradient-to-br from-primary/5 to-primary/10">
                <CardHeader>
                  <CardTitle>Card Details - {selectedCard.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Card Number</p>
                        <p className="font-mono font-medium">{selectedCard.number}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Expiry Date</p>
                        <p className="font-medium">{selectedCard.expiry}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Card Type</p>
                        <p className="font-medium capitalize">{selectedCard.type}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Available Balance</p>
                        <p className="text-2xl font-bold">${selectedCard.balance.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            selectedCard.status === "active" ? "bg-success" : 
                            selectedCard.status === "frozen" ? "bg-blue-500" : 
                            "bg-warning"
                          }`} />
                          <p className="font-medium capitalize">{selectedCard.status}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card className="modern-card">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { merchant: "Amazon", amount: -89.99, date: "Today, 2:30 PM", icon: "🛒" },
                    { merchant: "Starbucks", amount: -12.50, date: "Today, 9:15 AM", icon: "☕" },
                    { merchant: "Salary Deposit", amount: 3500.00, date: "Yesterday", icon: "💰" },
                    { merchant: "Netflix", amount: -15.99, date: "2 days ago", icon: "📺" },
                    { merchant: "Gas Station", amount: -45.00, date: "3 days ago", icon: "⛽" },
                  ].map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-4 hover:bg-secondary/20 rounded-lg transition-all">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{transaction.icon}</span>
                        <div>
                          <p className="font-medium">{transaction.merchant}</p>
                          <p className="text-sm text-muted-foreground">{transaction.date}</p>
                        </div>
                      </div>
                      <p className={`font-bold ${transaction.amount > 0 ? "text-success" : "text-foreground"}`}>
                        {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Limits Tab */}
          <TabsContent value="limits" className="space-y-6">
            <Card className="modern-card">
              <CardHeader>
                <CardTitle>Spending Limits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">Daily Limit</p>
                      <p className="text-sm text-muted-foreground">${cardSettings.daily}</p>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="5000"
                      value={cardSettings.daily}
                      onChange={(e) => handleSettingChange("daily", parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">Monthly Limit</p>
                      <p className="text-sm text-muted-foreground">${cardSettings.monthly}</p>
                    </div>
                    <input
                      type="range"
                      min="500"
                      max="20000"
                      value={cardSettings.monthly}
                      onChange={(e) => handleSettingChange("monthly", parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">ATM Withdrawal</p>
                      <p className="text-sm text-muted-foreground">${cardSettings.atm}</p>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={cardSettings.atm}
                      onChange={(e) => handleSettingChange("atm", parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="modern-card">
              <CardHeader>
                <CardTitle>Transaction Types</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GlobeIcon className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Online Payments</p>
                      <p className="text-sm text-muted-foreground">Enable online transactions</p>
                    </div>
                  </div>
                  <Switch
                    checked={cardSettings.online}
                    onCheckedChange={(checked) => handleSettingChange("online", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShoppingCartIcon className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">International Transactions</p>
                      <p className="text-sm text-muted-foreground">Use card abroad</p>
                    </div>
                  </div>
                  <Switch
                    checked={cardSettings.international}
                    onCheckedChange={(checked) => handleSettingChange("international", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <WifiIcon className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Contactless Payments</p>
                      <p className="text-sm text-muted-foreground">Tap to pay</p>
                    </div>
                  </div>
                  <Switch
                    checked={cardSettings.contactless}
                    onCheckedChange={(checked) => handleSettingChange("contactless", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="modern-card">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <LockIcon className="w-4 h-4 mr-2" />
                  Change PIN
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ShieldCheckIcon className="w-4 h-4 mr-2" />
                  Set Transaction Alerts
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CreditCardIcon className="w-4 h-4 mr-2" />
                  Request New Card
                </Button>
                <Button variant="destructive" className="w-full justify-start">
                  <BanknoteIcon className="w-4 h-4 mr-2" />
                  Report Card Stolen
                </Button>
              </CardContent>
            </Card>

            <Card className="modern-card bg-gradient-to-br from-success/10 to-success/5 border-success/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <ShieldCheckIcon className="w-5 h-5 text-success mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium text-success">Your card is protected</p>
                    <p className="text-sm text-muted-foreground">
                      All transactions are monitored 24/7 for suspicious activity. 
                      You're covered by our zero liability fraud protection.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}