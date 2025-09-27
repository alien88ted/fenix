"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserDropdown } from "@/components/user-dropdown"
import { FenixLogo } from "@/components/fenix-logo"
import { 
  PiggyBankIcon, 
  TargetIcon, 
  TrendingUpIcon,
  CalendarIcon,
  PlusIcon,
  HomeIcon,
  CarIcon,
  PlaneIcon,
  GraduationCapIcon,
  HeartIcon,
  ShoppingBagIcon
} from "lucide-react"

interface SavingsGoal {
  id: string
  name: string
  icon: React.ReactNode
  targetAmount: number
  currentAmount: number
  deadline: string
  monthlyContribution: number
  color: string
  category: string
}

const savingsGoals: SavingsGoal[] = [
  {
    id: "1",
    name: "Dream Home",
    icon: <HomeIcon className="w-5 h-5" />,
    targetAmount: 50000,
    currentAmount: 12500,
    deadline: "2026-12-31",
    monthlyContribution: 1500,
    color: "from-blue-500 to-blue-600",
    category: "Property"
  },
  {
    id: "2",
    name: "New Car",
    icon: <CarIcon className="w-5 h-5" />,
    targetAmount: 25000,
    currentAmount: 8750,
    deadline: "2025-06-30",
    monthlyContribution: 800,
    color: "from-green-500 to-green-600",
    category: "Vehicle"
  },
  {
    id: "3",
    name: "Vacation Fund",
    icon: <PlaneIcon className="w-5 h-5" />,
    targetAmount: 5000,
    currentAmount: 3200,
    deadline: "2024-08-15",
    monthlyContribution: 300,
    color: "from-purple-500 to-purple-600",
    category: "Travel"
  },
  {
    id: "4",
    name: "Emergency Fund",
    icon: <HeartIcon className="w-5 h-5" />,
    targetAmount: 10000,
    currentAmount: 7500,
    deadline: "2024-12-31",
    monthlyContribution: 500,
    color: "from-red-500 to-red-600",
    category: "Safety"
  }
]

export default function SavingsPage() {
  const router = useRouter()
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null)
  const [isCreatingGoal, setIsCreatingGoal] = useState(false)
  const [newGoalData, setNewGoalData] = useState({
    name: "",
    targetAmount: "",
    deadline: "",
    monthlyContribution: "",
    category: "Other"
  })

  const totalSaved = savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0)
  const totalTarget = savingsGoals.reduce((sum, goal) => sum + goal.targetAmount, 0)
  const monthlyTotal = savingsGoals.reduce((sum, goal) => sum + goal.monthlyContribution, 0)

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  const calculateTimeRemaining = (deadline: string) => {
    const now = new Date()
    const target = new Date(deadline)
    const months = (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth())
    
    if (months < 0) return "Completed"
    if (months === 0) return "This month"
    if (months === 1) return "1 month"
    if (months < 12) return `${months} months`
    
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12
    if (remainingMonths === 0) return `${years} year${years > 1 ? 's' : ''}`
    return `${years} year${years > 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`
  }

  const handleCreateGoal = () => {
    // Simulate goal creation
    setIsCreatingGoal(false)
    setNewGoalData({
      name: "",
      targetAmount: "",
      deadline: "",
      monthlyContribution: "",
      category: "Other"
    })
    alert("New savings goal created successfully!")
  }

  const goalCategories = [
    { name: "Property", icon: <HomeIcon className="w-4 h-4" /> },
    { name: "Vehicle", icon: <CarIcon className="w-4 h-4" /> },
    { name: "Travel", icon: <PlaneIcon className="w-4 h-4" /> },
    { name: "Education", icon: <GraduationCapIcon className="w-4 h-4" /> },
    { name: "Shopping", icon: <ShoppingBagIcon className="w-4 h-4" /> },
    { name: "Other", icon: <TargetIcon className="w-4 h-4" /> }
  ]

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
              <h1 className="text-lg font-semibold">Savings & Goals</h1>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <UserDropdown />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="modern-card bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <PiggyBankIcon className="w-8 h-8 text-primary" />
                <span className="text-sm text-muted-foreground">Total Saved</span>
              </div>
              <p className="text-3xl font-bold">${totalSaved.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">
                of ${totalTarget.toLocaleString()} goal
              </p>
              <Progress value={calculateProgress(totalSaved, totalTarget)} className="mt-3" />
            </CardContent>
          </Card>

          <Card className="modern-card bg-gradient-to-br from-success/10 to-success/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUpIcon className="w-8 h-8 text-success" />
                <span className="text-sm text-muted-foreground">Monthly Savings</span>
              </div>
              <p className="text-3xl font-bold">${monthlyTotal.toLocaleString()}</p>
              <p className="text-sm text-success mt-1">+12% from last month</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-2 bg-success/20 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-success rounded-full" />
                </div>
                <span className="text-xs text-muted-foreground">On track</span>
              </div>
            </CardContent>
          </Card>

          <Card className="modern-card bg-gradient-to-br from-warning/10 to-warning/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <TargetIcon className="w-8 h-8 text-warning" />
                <span className="text-sm text-muted-foreground">Active Goals</span>
              </div>
              <p className="text-3xl font-bold">{savingsGoals.length}</p>
              <p className="text-sm text-muted-foreground mt-1">2 completing soon</p>
              <Button 
                onClick={() => setIsCreatingGoal(true)}
                className="w-full mt-3 h-8 text-xs modern-button bg-warning/20 hover:bg-warning/30 text-warning-foreground"
                variant="outline"
              >
                <PlusIcon className="w-3 h-3 mr-1" />
                Add New Goal
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Savings Goals */}
        <Card className="modern-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Your Savings Goals</CardTitle>
              <Button
                onClick={() => setIsCreatingGoal(true)}
                className="modern-button bg-primary hover:bg-primary/90"
                size="sm"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                New Goal
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savingsGoals.map((goal) => (
                <div
                  key={goal.id}
                  onClick={() => setSelectedGoal(goal)}
                  className="p-4 border rounded-xl hover:bg-secondary/20 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${goal.color} text-white`}>
                        {goal.icon}
                      </div>
                      <div>
                        <p className="font-semibold">{goal.name}</p>
                        <p className="text-sm text-muted-foreground">{goal.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">${goal.currentAmount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">of ${goal.targetAmount.toLocaleString()}</p>
                    </div>
                  </div>

                  <Progress 
                    value={calculateProgress(goal.currentAmount, goal.targetAmount)} 
                    className="h-2 mb-3"
                  />

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <CalendarIcon className="w-3 h-3" />
                      <span>{calculateTimeRemaining(goal.deadline)}</span>
                    </div>
                    <span className="font-medium text-primary">
                      {calculateProgress(goal.currentAmount, goal.targetAmount).toFixed(0)}%
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-border/50">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Monthly contribution</span>
                      <span className="font-medium">${goal.monthlyContribution}/mo</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Savings Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-lg">Smart Savings Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">💡</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Automate your savings</p>
                  <p className="text-xs text-muted-foreground">Set up automatic transfers on payday</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">📈</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Round up purchases</p>
                  <p className="text-xs text-muted-foreground">Save spare change from every transaction</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">🎯</span>
                </div>
                <div>
                  <p className="text-sm font-medium">52-week challenge</p>
                  <p className="text-xs text-muted-foreground">Save incrementally each week</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-lg">Savings Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Best performing goal</span>
                  <span className="text-sm font-medium">Emergency Fund</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Average completion</span>
                  <span className="text-sm font-medium">62%</span>
                </div>
                <Progress value={62} className="h-2" />
              </div>
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">
                  You're saving 23% more than the average user. Keep it up! 🎉
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create New Goal Modal */}
        {isCreatingGoal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md modern-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Create New Goal</CardTitle>
                  <button
                    onClick={() => setIsCreatingGoal(false)}
                    className="p-1 rounded-lg hover:bg-secondary/50 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Goal Name</label>
                  <input
                    type="text"
                    value={newGoalData.name}
                    onChange={(e) => setNewGoalData({...newGoalData, name: e.target.value})}
                    placeholder="e.g., Dream Vacation"
                    className="w-full mt-1 p-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Category</label>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    {goalCategories.map((category) => (
                      <button
                        key={category.name}
                        onClick={() => setNewGoalData({...newGoalData, category: category.name})}
                        className={`p-2 rounded-lg border flex items-center justify-center gap-1 transition-all ${
                          newGoalData.category === category.name 
                            ? "bg-primary text-primary-foreground border-primary" 
                            : "hover:bg-secondary/50"
                        }`}
                      >
                        {category.icon}
                        <span className="text-xs">{category.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Target Amount</label>
                  <input
                    type="number"
                    value={newGoalData.targetAmount}
                    onChange={(e) => setNewGoalData({...newGoalData, targetAmount: e.target.value})}
                    placeholder="0.00"
                    className="w-full mt-1 p-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Target Date</label>
                  <input
                    type="date"
                    value={newGoalData.deadline}
                    onChange={(e) => setNewGoalData({...newGoalData, deadline: e.target.value})}
                    className="w-full mt-1 p-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Monthly Contribution</label>
                  <input
                    type="number"
                    value={newGoalData.monthlyContribution}
                    onChange={(e) => setNewGoalData({...newGoalData, monthlyContribution: e.target.value})}
                    placeholder="0.00"
                    className="w-full mt-1 p-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <Button
                  onClick={handleCreateGoal}
                  className="w-full h-12 modern-button bg-primary hover:bg-primary/90"
                  disabled={!newGoalData.name || !newGoalData.targetAmount}
                >
                  Create Goal
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Goal Details Modal */}
        {selectedGoal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md modern-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{selectedGoal.name}</CardTitle>
                  <button
                    onClick={() => setSelectedGoal(null)}
                    className="p-1 rounded-lg hover:bg-secondary/50 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`p-4 rounded-xl bg-gradient-to-br ${selectedGoal.color} text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-white/20 rounded-lg">
                        {selectedGoal.icon}
                      </div>
                      <div>
                        <p className="text-sm opacity-90">{selectedGoal.category}</p>
                        <p className="text-2xl font-bold">${selectedGoal.currentAmount.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  <Progress 
                    value={calculateProgress(selectedGoal.currentAmount, selectedGoal.targetAmount)} 
                    className="h-3 bg-white/20"
                  />
                  <div className="flex items-center justify-between mt-2 text-sm">
                    <span className="opacity-90">Progress</span>
                    <span className="font-bold">
                      {calculateProgress(selectedGoal.currentAmount, selectedGoal.targetAmount).toFixed(0)}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-secondary/20 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Target Amount</p>
                    <p className="font-bold">${selectedGoal.targetAmount.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-secondary/20 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Time Remaining</p>
                    <p className="font-bold">{calculateTimeRemaining(selectedGoal.deadline)}</p>
                  </div>
                  <div className="p-3 bg-secondary/20 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Monthly Saving</p>
                    <p className="font-bold">${selectedGoal.monthlyContribution}</p>
                  </div>
                  <div className="p-3 bg-secondary/20 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Still Needed</p>
                    <p className="font-bold">
                      ${(selectedGoal.targetAmount - selectedGoal.currentAmount).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button className="w-full modern-button bg-primary hover:bg-primary/90">
                    Add Funds
                  </Button>
                  <Button variant="outline" className="w-full modern-button">
                    Edit Goal
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}