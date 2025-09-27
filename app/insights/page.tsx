"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserDropdown } from "@/components/user-dropdown"
import { FenixLogo } from "@/components/fenix-logo"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUpIcon, 
  TrendingDownIcon,
  DollarSignIcon,
  CreditCardIcon,
  ShoppingBagIcon,
  HomeIcon,
  CarIcon,
  UtensilsIcon,
  ActivityIcon,
  CalendarIcon,
  PieChartIcon
} from "lucide-react"

// Mock data for analytics
const monthlySpending = [
  { month: "Jan", amount: 2450, budget: 3000 },
  { month: "Feb", amount: 2780, budget: 3000 },
  { month: "Mar", amount: 2200, budget: 3000 },
  { month: "Apr", amount: 2950, budget: 3000 },
  { month: "May", amount: 2650, budget: 3000 },
  { month: "Jun", amount: 2300, budget: 3000 },
]

const spendingCategories = [
  { name: "Food & Dining", amount: 450, percentage: 22, icon: <UtensilsIcon className="w-4 h-4" />, color: "from-blue-500 to-blue-600" },
  { name: "Shopping", amount: 380, percentage: 18, icon: <ShoppingBagIcon className="w-4 h-4" />, color: "from-purple-500 to-purple-600" },
  { name: "Transport", amount: 320, percentage: 15, icon: <CarIcon className="w-4 h-4" />, color: "from-green-500 to-green-600" },
  { name: "Housing", amount: 850, percentage: 40, icon: <HomeIcon className="w-4 h-4" />, color: "from-orange-500 to-orange-600" },
  { name: "Others", amount: 100, percentage: 5, icon: <CreditCardIcon className="w-4 h-4" />, color: "from-gray-500 to-gray-600" },
]

const insights = [
  {
    type: "saving",
    title: "Great job saving!",
    description: "You saved 15% more than last month",
    icon: "💰",
    trend: "up"
  },
  {
    type: "spending",
    title: "Spending Alert",
    description: "Food expenses increased by 20% this week",
    icon: "🍔",
    trend: "up"
  },
  {
    type: "investment",
    title: "Portfolio Growth",
    description: "Your investments grew by 8.5% this month",
    icon: "📈",
    trend: "up"
  },
  {
    type: "tip",
    title: "Money Tip",
    description: "Consider the 50/30/20 budget rule",
    icon: "💡",
    trend: "neutral"
  }
]

export default function InsightsPage() {
  const router = useRouter()
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [activeTab, setActiveTab] = useState("overview")

  const totalSpending = spendingCategories.reduce((sum, cat) => sum + cat.amount, 0)
  const averageDaily = (totalSpending / 30).toFixed(2)
  const savingsRate = 23 // percentage

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
              <h1 className="text-lg font-semibold">Insights & Analytics</h1>
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
            <TabsTrigger value="spending">Spending</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="modern-card hover:scale-105 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSignIcon className="w-5 h-5 text-muted-foreground" />
                    <span className="text-xs text-success">+12%</span>
                  </div>
                  <p className="text-2xl font-bold">${totalSpending.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Monthly Spending</p>
                </CardContent>
              </Card>

              <Card className="modern-card hover:scale-105 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUpIcon className="w-5 h-5 text-muted-foreground" />
                    <span className="text-xs text-success">+8%</span>
                  </div>
                  <p className="text-2xl font-bold">$4,500</p>
                  <p className="text-sm text-muted-foreground">Monthly Income</p>
                </CardContent>
              </Card>

              <Card className="modern-card hover:scale-105 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <ActivityIcon className="w-5 h-5 text-muted-foreground" />
                    <span className="text-xs text-primary">{savingsRate}%</span>
                  </div>
                  <p className="text-2xl font-bold">$1,035</p>
                  <p className="text-sm text-muted-foreground">Saved This Month</p>
                </CardContent>
              </Card>

              <Card className="modern-card hover:scale-105 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <CalendarIcon className="w-5 h-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Daily</span>
                  </div>
                  <p className="text-2xl font-bold">${averageDaily}</p>
                  <p className="text-sm text-muted-foreground">Average Spending</p>
                </CardContent>
              </Card>
            </div>

            {/* AI Insights */}
            <Card className="modern-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🤖</span>
                  AI-Powered Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {insights.map((insight, index) => (
                    <div
                      key={index}
                      className="p-4 bg-secondary/20 rounded-lg hover:bg-secondary/30 transition-all cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{insight.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-sm">{insight.title}</p>
                            {insight.trend === "up" && <TrendingUpIcon className="w-3 h-3 text-success" />}
                            {insight.trend === "down" && <TrendingDownIcon className="w-3 h-3 text-destructive" />}
                          </div>
                          <p className="text-xs text-muted-foreground">{insight.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Spending by Category */}
            <Card className="modern-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Spending Breakdown</CardTitle>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="text-sm px-3 py-1 rounded-lg bg-secondary/20 border border-border/30 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {spendingCategories.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${category.color} text-white`}>
                            {category.icon}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{category.name}</p>
                            <p className="text-xs text-muted-foreground">${category.amount} spent</p>
                          </div>
                        </div>
                        <span className="font-semibold">{category.percentage}%</span>
                      </div>
                      <Progress value={category.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Spending Tab */}
          <TabsContent value="spending" className="space-y-6">
            <Card className="modern-card">
              <CardHeader>
                <CardTitle>Monthly Spending Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Simple Bar Chart */}
                  <div className="flex items-end justify-between gap-2 h-48">
                    {monthlySpending.map((month, index) => {
                      const height = (month.amount / 3000) * 100
                      const isOverBudget = month.amount > month.budget
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                          <div className="w-full bg-secondary/20 rounded-t-lg relative" style={{ height: "100%" }}>
                            <div
                              className={`absolute bottom-0 w-full rounded-t-lg transition-all duration-500 hover:opacity-80 ${
                                isOverBudget ? "bg-destructive" : "bg-primary"
                              }`}
                              style={{ height: `${height}%` }}
                            />
                          </div>
                          <div className="text-center">
                            <p className="text-xs font-medium">{month.month}</p>
                            <p className="text-xs text-muted-foreground">${month.amount}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="flex items-center justify-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-primary rounded" />
                      <span>Within Budget</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-destructive rounded" />
                      <span>Over Budget</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card className="modern-card">
              <CardHeader>
                <CardTitle>Recent Large Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { merchant: "Apple Store", amount: -999, date: "2 days ago", category: "Shopping" },
                    { merchant: "Whole Foods", amount: -234, date: "3 days ago", category: "Food" },
                    { merchant: "Shell Gas Station", amount: -89, date: "4 days ago", category: "Transport" },
                    { merchant: "Netflix", amount: -15.99, date: "5 days ago", category: "Entertainment" },
                  ].map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-3 hover:bg-secondary/20 rounded-lg transition-all">
                      <div>
                        <p className="font-medium">{transaction.merchant}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{transaction.date}</span>
                          <span className="text-xs px-2 py-0.5 bg-secondary rounded-full">{transaction.category}</span>
                        </div>
                      </div>
                      <p className="font-bold text-destructive">
                        ${Math.abs(transaction.amount).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Income Tab */}
          <TabsContent value="income" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="modern-card">
                <CardHeader>
                  <CardTitle>Income Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Salary</span>
                        <span className="text-sm font-bold">$3,500</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Investments</span>
                        <span className="text-sm font-bold">$650</span>
                      </div>
                      <Progress value={14} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Freelance</span>
                        <span className="text-sm font-bold">$350</span>
                      </div>
                      <Progress value={8} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="modern-card">
                <CardHeader>
                  <CardTitle>Income Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center py-8">
                      <p className="text-4xl font-bold text-success">+15%</p>
                      <p className="text-sm text-muted-foreground mt-2">Compared to last year</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-secondary/20 rounded-lg">
                        <p className="text-xl font-bold">$4,500</p>
                        <p className="text-xs text-muted-foreground">This Month</p>
                      </div>
                      <div className="text-center p-3 bg-secondary/20 rounded-lg">
                        <p className="text-xl font-bold">$3,913</p>
                        <p className="text-xs text-muted-foreground">Last Month</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Income Forecast */}
            <Card className="modern-card bg-gradient-to-br from-success/10 to-success/5 border-success/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5" />
                  Income Forecast
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Next Month</p>
                    <p className="text-2xl font-bold">$4,650</p>
                    <p className="text-xs text-success">+3.3%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Q3 2024</p>
                    <p className="text-2xl font-bold">$14,200</p>
                    <p className="text-xs text-success">+5.2%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Year End</p>
                    <p className="text-2xl font-bold">$56,800</p>
                    <p className="text-xs text-success">+12.5%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <Card className="modern-card">
              <CardHeader>
                <CardTitle>Financial Health Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="relative inline-flex items-center justify-center">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        className="text-secondary"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={351.86}
                        strokeDashoffset={351.86 * (1 - 0.82)}
                        className="text-primary transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute">
                      <p className="text-3xl font-bold">82</p>
                      <p className="text-xs text-muted-foreground">Excellent</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-8">
                    <div>
                      <p className="text-sm font-medium">Spending</p>
                      <p className="text-xs text-muted-foreground">Well controlled</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Savings</p>
                      <p className="text-xs text-muted-foreground">Above average</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Investments</p>
                      <p className="text-xs text-muted-foreground">Growing steadily</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="modern-card">
              <CardHeader>
                <CardTitle>Personalized Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🎯</span>
                      <div>
                        <p className="font-medium">Increase Emergency Fund</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Consider adding $200 more to reach 6 months of expenses
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">💎</span>
                      <div>
                        <p className="font-medium">Optimize Investment Portfolio</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Diversify with 20% international stocks for better returns
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">⚡</span>
                      <div>
                        <p className="font-medium">Reduce Dining Expenses</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          You could save $150/month by cooking more at home
                        </p>
                      </div>
                    </div>
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