"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FenixLogo } from "@/components/fenix-logo"
import { Progress } from "@/components/ui/progress"
import { 
  CreditCardIcon, 
  TrendingUpIcon, 
  ShieldCheckIcon, 
  GlobeIcon,
  SparklesIcon,
  CheckCircleIcon
} from "lucide-react"

interface OnboardingStep {
  id: number
  title: string
  subtitle: string
  description: string
  icon: React.ReactNode
  features: string[]
  color: string
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: "Welcome to Fenix",
    subtitle: "Your Neo Bank for Lebanon",
    description: "Experience the future of banking with complete financial freedom",
    icon: <FenixLogo size={80} animate />,
    features: [
      "🏦 Full banking services",
      "🇱🇧 Lebanese market integration",
      "🔒 Bank-grade security",
      "⚡ Instant transactions"
    ],
    color: "from-primary/20 to-primary/10"
  },
  {
    id: 2,
    title: "Invest Globally",
    subtitle: "Stocks & Cryptocurrency",
    description: "Trade international stocks and crypto from Lebanon",
    icon: <TrendingUpIcon className="w-16 h-16" />,
    features: [
      "📈 US & International stocks",
      "₿ Major cryptocurrencies",
      "📊 Real-time market data",
      "💹 Portfolio analytics"
    ],
    color: "from-blue-500/20 to-blue-500/10"
  },
  {
    id: 3,
    title: "Smart Cards",
    subtitle: "Virtual & Physical",
    description: "Create instant virtual cards or order premium physical cards",
    icon: <CreditCardIcon className="w-16 h-16" />,
    features: [
      "💳 Instant virtual cards",
      "🎯 Spending controls",
      "🌍 International usage",
      "🔐 Freeze/unfreeze anytime"
    ],
    color: "from-purple-500/20 to-purple-500/10"
  },
  {
    id: 4,
    title: "Lebanese Services",
    subtitle: "Local Integration",
    description: "Seamlessly integrated with Lebanese banks and services",
    icon: <span className="text-6xl">🇱🇧</span>,
    features: [
      "🏛️ BSE stock trading",
      "💱 LBP/USD exchange",
      "📱 Touch & Alfa top-up",
      "💸 OMT transfers"
    ],
    color: "from-green-500/20 to-red-500/10"
  },
  {
    id: 5,
    title: "Bank-Grade Security",
    subtitle: "Your Money, Protected",
    description: "Enterprise-level security with complete user control",
    icon: <ShieldCheckIcon className="w-16 h-16" />,
    features: [
      "🔐 End-to-end encryption",
      "👤 Biometric authentication",
      "🛡️ Fraud protection",
      "🔑 Non-custodial wallet"
    ],
    color: "from-green-500/20 to-green-500/10"
  }
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentStep(currentStep + 1)
        setIsTransitioning(false)
      }, 150)
    } else {
      // Complete onboarding
      router.push("/")
    }
  }

  const handleSkip = () => {
    router.push("/")
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentStep(currentStep - 1)
        setIsTransitioning(false)
      }, 150)
    }
  }

  const step = onboardingSteps[currentStep]
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">
              Step {currentStep + 1} of {onboardingSteps.length}
            </span>
            <button
              onClick={handleSkip}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip
            </button>
          </div>
        </div>

        {/* Content Card */}
        <Card className={`modern-card overflow-hidden transition-all duration-300 ${
          isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}>
          <div className={`h-48 bg-gradient-to-br ${step.color} flex items-center justify-center relative overflow-hidden`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24" />
            </div>
            
            {/* Icon */}
            <div className="relative z-10 text-primary">
              {step.icon}
            </div>
          </div>

          <CardContent className="p-6 space-y-6">
            {/* Title and Description */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">{step.title}</h2>
              <p className="text-lg text-primary font-medium">{step.subtitle}</p>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>

            {/* Features */}
            <div className="space-y-3">
              {step.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CheckCircleIcon className="w-5 h-5 text-success flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex gap-3">
              {currentStep > 0 && (
                <Button
                  onClick={handlePrevious}
                  variant="outline"
                  className="flex-1 modern-button"
                >
                  Previous
                </Button>
              )}
              <Button
                onClick={handleNext}
                className="flex-1 modern-button bg-primary hover:bg-primary/90"
              >
                {currentStep === onboardingSteps.length - 1 ? (
                  <>
                    Get Started
                    <SparklesIcon className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  "Next"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {onboardingSteps.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsTransitioning(true)
                setTimeout(() => {
                  setCurrentStep(index)
                  setIsTransitioning(false)
                }, 150)
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentStep 
                  ? "w-8 bg-primary" 
                  : index < currentStep 
                  ? "bg-primary/50" 
                  : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}