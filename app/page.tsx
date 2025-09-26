"use client"

import { useState, useEffect } from "react"
import { usePrivy, useLogin, useLogout, useWallets } from "@privy-io/react-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export default function FenixWallet() {
  const { ready, authenticated, user } = usePrivy()
  const { login } = useLogin({
    onComplete: async (user, isNewUser) => {
      // Verify with backend
      try {
        const response = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken: await user.getIdToken() }),
        })

        if (response.ok) {
          console.log('User verified with backend')
        }
      } catch (error) {
        console.error('Backend verification failed:', error)
      }
    },
  })
  const { logout } = useLogout()
  const { wallets } = useWallets()

  const [balance] = useState("1,247.50")
  const [isDark, setIsDark] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentView, setCurrentView] = useState("home") // home, send, receive, services
  const [sendStep, setSendStep] = useState(1) // 1: form, 2: confirm, 3: processing, 4: success
  const [sendData, setSendData] = useState({ address: "", amount: "", memo: "" })
  const [errors, setErrors] = useState({})
  const [copied, setCopied] = useState(false)
  const [walletAddress] = useState("0x742d35Cc32C15e8A4BfFB9a1BfFbF2c8f9A1bC3d")

  useEffect(() => {
    const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
    setIsDark(isDarkMode)
    document.documentElement.classList.toggle("dark", isDarkMode)
    setTimeout(() => setIsLoading(false), 300)
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark", !isDark)
  }

  const validateSendForm = () => {
    const newErrors = {}
    if (!sendData.address.trim()) {
      newErrors.address = "Address is required"
    } else if (!sendData.address.match(/^0x[a-fA-F0-9]{40}$/)) {
      newErrors.address = "Invalid wallet address"
    }

    if (!sendData.amount.trim()) {
      newErrors.amount = "Amount is required"
    } else if (isNaN(parseFloat(sendData.amount)) || parseFloat(sendData.amount) <= 0) {
      newErrors.amount = "Invalid amount"
    } else if (parseFloat(sendData.amount) > parseFloat(balance.replace(',', ''))) {
      newErrors.amount = "Insufficient balance"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSendContinue = () => {
    if (validateSendForm()) {
      setSendStep(2)
    }
  }

  const handleSendConfirm = async () => {
    setSendStep(3)

    // Simulate transaction processing
    await new Promise(resolve => setTimeout(resolve, 3000))

    setSendStep(4)

    // Auto return to home after 3 seconds
    setTimeout(() => {
      setCurrentView("home")
      setSendStep(1)
      setSendData({ address: "", amount: "", memo: "" })
      setErrors({})
    }, 3000)
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const renderBackButton = () => (
    <button
      onClick={() => setCurrentView("home")}
      className="p-2 rounded-lg hover:bg-secondary/50 modern-button focus-modern"
      aria-label="Back to home"
    >
      <svg className="w-5 h-5 icon-modern" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  )

  const mainActions = [
    {
      title: "Send",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.768 59.768 0 013.27 20.876L5.999 12zm0 0h7.5" />
        </svg>
      ),
      description: "Send USDT instantly",
      action: () => {
        setCurrentView("send")
        setSendStep(1)
        setSendData({ address: "", amount: "", memo: "" })
        setErrors({})
      },
    },
    {
      title: "Receive",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
        </svg>
      ),
      description: "Show QR code",
      action: () => setCurrentView("receive"),
    },
  ]

  const secondaryActions = [
    {
      title: "More Services",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12M8.25 17.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 17.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      ),
      description: "Cash-in, payments & utilities",
      action: () => setCurrentView("services"),
      badge: "3 services"
    }
  ]

  // Loading state
  if (!ready || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <Image
              src="/fenix-logo.png"
              alt="Fenix"
              width={40}
              height={40}
              className="w-10 h-10 float mx-auto"
              priority
            />
          </div>
          <div className="w-24 h-0.5 bg-muted rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-primary rounded-full loading-shimmer"></div>
          </div>
        </div>
      </div>
    )
  }

  // Not authenticated - show login
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md modern-card bg-card border border-border/30">
          <CardContent className="p-8 space-y-6">
            <div className="text-center space-y-4">
              <div className="relative mx-auto w-fit">
                <Image src="/fenix-logo.png" alt="Fenix" width={64} height={64} className="w-16 h-16 float" priority />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Welcome to Fenix</h1>
                <p className="text-muted-foreground">Your secure gateway to Web3 payments</p>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                onClick={login}
                className="w-full modern-button bg-primary hover:bg-primary/90 text-primary-foreground h-12"
              >
                Connect Wallet
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                <p>✓ Non-custodial • ✓ Bank-grade security • ✓ No seed phrases</p>
              </div>
            </div>

            <div className="pt-4 border-t border-border/30">
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <span>Powered by</span>
                <span className="font-semibold text-primary">Privy</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Authenticated - show wallet
  return (
    <div className="min-h-screen bg-background">
      <header className="glass border-b border-border/20" role="banner">
        <div className="flex items-center justify-between px-6 py-5 max-w-sm mx-auto">
          <div className="flex items-center gap-3">
            {currentView !== "home" && renderBackButton()}
            <div className="relative">
              <Image src="/fenix-logo.png" alt="Fenix" width={32} height={32} className="w-8 h-8 float" priority />
            </div>
            <h1 className="text-lg font-semibold tracking-tight">
              {currentView === "home" && "Fenix"}
              {currentView === "send" && "Send USDT"}
              {currentView === "receive" && "Receive"}
              {currentView === "services" && "Services"}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border-0 bg-secondary/50 hover:bg-secondary modern-button focus-modern"
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
              aria-pressed={isDark}
            >
              {isDark ? (
                <svg className="w-4 h-4 icon-modern" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4 icon-modern" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 716.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            <Button
              onClick={logout}
              variant="outline"
              className="text-xs h-8 px-3 modern-button bg-secondary/50 hover:bg-secondary text-foreground border-border/30"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-sm mx-auto px-6 py-8" role="main">
        {currentView === "home" && (
          <div className="space-y-8">
            <section aria-labelledby="balance-heading">
              <h2 id="balance-heading" className="sr-only">Account Balance</h2>
              <Card className="modern-card bg-card border border-border/30" role="region" aria-label="Current balance information">
                <CardContent className="p-8 text-center">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Balance</p>
                      <div className="text-5xl font-bold text-foreground tracking-tight leading-none" aria-label={`Current balance: ${balance} dollars`}>${balance}</div>
                    </div>
                    <div className="flex items-center justify-center gap-2" role="status" aria-label="Network status">
                      <div className="w-1.5 h-1.5 bg-success rounded-full" aria-hidden="true" />
                      <span className="text-xs font-medium text-muted-foreground">
                        {wallets.length > 0 ? `${wallets[0]?.address.slice(0, 6)}...${wallets[0]?.address.slice(-4)} • Ethereum` : "USDT • Plasma Network"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section aria-labelledby="primary-actions-heading">
              <h2 id="primary-actions-heading" className="sr-only">Primary Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                {mainActions.map((action, index) => (
                  <Button
                    key={index}
                    onClick={action.action}
                    className="h-24 flex-col gap-2 modern-button bg-card hover:bg-secondary/50 border border-border/30 text-card-foreground hover:text-foreground focus-modern"
                    variant="outline"
                    role="button"
                    aria-label={`${action.title}: ${action.description}`}
                  >
                    <div className="text-primary">{action.icon}</div>
                    <div className="text-center">
                      <div className="font-semibold text-sm">{action.title}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </section>

            <section aria-labelledby="secondary-actions-heading">
              <h2 id="secondary-actions-heading" className="sr-only">More Services</h2>
              <div className="space-y-3">
                {secondaryActions.map((action, index) => (
                  <Button
                    key={index}
                    onClick={action.action}
                    className="w-full h-14 justify-between modern-button bg-card hover:bg-secondary/50 border border-border/30 text-card-foreground hover:text-foreground focus-modern p-4"
                    variant="outline"
                    role="button"
                    aria-label={`${action.title}: ${action.description}`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-primary flex-shrink-0">{action.icon}</div>
                      <div className="text-left flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{action.title}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {action.badge && (
                        <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs font-medium rounded-md">
                          {action.badge}
                        </span>
                      )}
                      <svg className="w-4 h-4 text-muted-foreground/60 icon-modern" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Button>
                ))}
              </div>
            </section>

            <footer className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-6" role="contentinfo">
              <div className="w-1.5 h-1.5 bg-success rounded-full" aria-hidden="true" />
              <span className="font-medium" role="status" aria-live="polite">Secured by Privy</span>
            </footer>
          </div>
        )}

        {/* COMPLETE SEND FLOW */}
        {currentView === "send" && (
          <div className="space-y-6">
            {sendStep === 1 && (
              <Card className="modern-card bg-card border border-border/30">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">To Address</label>
                      <input
                        type="text"
                        placeholder="0x... or enter wallet address"
                        value={sendData.address}
                        onChange={(e) => setSendData({...sendData, address: e.target.value})}
                        className={`w-full p-3 border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary modern-button ${errors.address ? 'border-destructive' : 'border-border/30'}`}
                      />
                      {errors.address && (
                        <p className="text-xs text-destructive">{errors.address}</p>
                      )}
                      <Button
                        onClick={() => setSendData({...sendData, address: wallets.length > 0 ? wallets[0]?.address : walletAddress})}
                        className="text-xs text-primary hover:text-primary/80 p-0 h-auto bg-transparent hover:bg-transparent"
                        variant="ghost"
                      >
                        Use demo address
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Amount</label>
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="0.00"
                          value={sendData.amount}
                          onChange={(e) => setSendData({...sendData, amount: e.target.value})}
                          className={`w-full p-3 pr-16 border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary modern-button ${errors.amount ? 'border-destructive' : 'border-border/30'}`}
                        />
                        <span className="absolute right-3 top-3 text-sm text-muted-foreground">USDT</span>
                      </div>
                      {errors.amount && (
                        <p className="text-xs text-destructive">{errors.amount}</p>
                      )}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setSendData({...sendData, amount: "10"})}
                          className="text-xs px-2 py-1 h-auto bg-secondary/50 hover:bg-secondary text-foreground"
                          variant="outline"
                        >
                          $10
                        </Button>
                        <Button
                          onClick={() => setSendData({...sendData, amount: "100"})}
                          className="text-xs px-2 py-1 h-auto bg-secondary/50 hover:bg-secondary text-foreground"
                          variant="outline"
                        >
                          $100
                        </Button>
                        <Button
                          onClick={() => setSendData({...sendData, amount: balance.replace(',', '')})}
                          className="text-xs px-2 py-1 h-auto bg-secondary/50 hover:bg-secondary text-foreground"
                          variant="outline"
                        >
                          Max
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">Available: ${balance}</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Memo (Optional)</label>
                      <input
                        type="text"
                        placeholder="Add a note..."
                        value={sendData.memo}
                        onChange={(e) => setSendData({...sendData, memo: e.target.value})}
                        className="w-full p-3 border border-border/30 rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary modern-button"
                      />
                    </div>

                    <Button
                      onClick={handleSendContinue}
                      className="w-full h-12 modern-button bg-primary hover:bg-primary/90 text-primary-foreground focus-modern"
                    >
                      Review Transaction
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {sendStep === 2 && (
              <Card className="modern-card bg-card border border-border/30">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="text-center space-y-2">
                      <h3 className="text-lg font-semibold">Confirm Transaction</h3>
                      <p className="text-sm text-muted-foreground">Review the details before sending</p>
                    </div>

                    <div className="space-y-4 p-4 bg-secondary/20 rounded-lg border border-border/30">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">To</span>
                        <span className="text-sm font-mono text-right max-w-32 truncate">{sendData.address}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Amount</span>
                        <span className="text-sm font-semibold">${sendData.amount} USDT</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Network Fee</span>
                        <span className="text-sm">$0.50</span>
                      </div>
                      {sendData.memo && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Memo</span>
                          <span className="text-sm">{sendData.memo}</span>
                        </div>
                      )}
                      <div className="border-t border-border/30 pt-4">
                        <div className="flex justify-between">
                          <span className="text-sm font-semibold">Total</span>
                          <span className="text-sm font-bold">${(parseFloat(sendData.amount) + 0.5).toFixed(2)} USDT</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button
                        onClick={handleSendConfirm}
                        className="w-full h-12 modern-button bg-primary hover:bg-primary/90 text-primary-foreground focus-modern"
                      >
                        Confirm & Send
                      </Button>
                      <Button
                        onClick={() => setSendStep(1)}
                        className="w-full h-10 modern-button bg-secondary/50 hover:bg-secondary text-foreground focus-modern"
                        variant="outline"
                      >
                        Edit Transaction
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {sendStep === 3 && (
              <Card className="modern-card bg-card border border-border/30">
                <CardContent className="p-8 text-center">
                  <div className="space-y-6">
                    <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-primary animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" strokeWidth={2} className="opacity-25" />
                        <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor" />
                      </svg>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Processing Transaction</h3>
                      <p className="text-sm text-muted-foreground">Please wait while we send your USDT...</p>
                      <div className="w-32 h-1 bg-muted rounded-full overflow-hidden mx-auto">
                        <div className="h-full bg-primary rounded-full loading-shimmer w-full"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {sendStep === 4 && (
              <Card className="modern-card bg-card border border-border/30">
                <CardContent className="p-8 text-center">
                  <div className="space-y-6">
                    <div className="w-16 h-16 mx-auto bg-success/10 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-success">Transaction Sent!</h3>
                      <p className="text-sm text-muted-foreground">${sendData.amount} USDT sent successfully</p>
                      <div className="p-3 bg-success/5 rounded-lg border border-success/20">
                        <p className="text-xs font-mono text-success">TX: 0xabc123...def789</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Returning to home...</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* COMPLETE RECEIVE FLOW */}
        {currentView === "receive" && (
          <div className="space-y-6">
            <Card className="modern-card bg-card border border-border/30">
              <CardContent className="p-8 text-center">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Receive USDT</h3>
                    <p className="text-sm text-muted-foreground">Share this address or QR code to receive payments</p>
                  </div>

                  {/* QR Code - Simulated with pattern */}
                  <div className="w-48 h-48 mx-auto bg-background rounded-xl flex items-center justify-center border-2 border-border/30 relative overflow-hidden">
                    <div className="absolute inset-2 grid grid-cols-8 grid-rows-8 gap-1">
                      {Array.from({ length: 64 }, (_, i) => (
                        <div
                          key={i}
                          className={`w-full h-full ${
                            // Create QR pattern
                            (i % 8 === 0 || i % 8 === 7 || Math.floor(i / 8) === 0 || Math.floor(i / 8) === 7 ||
                             (i >= 18 && i <= 21) || (i >= 34 && i <= 37) || (i >= 42 && i <= 45) ||
                             i === 9 || i === 15 || i === 49 || i === 55)
                            ? 'bg-foreground'
                            : 'bg-transparent'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-3 bg-secondary/20 rounded-lg border border-border/30">
                        <p className="text-xs font-mono text-foreground break-all select-all">
                          {wallets.length > 0 ? wallets[0]?.address : walletAddress}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          onClick={() => copyToClipboard(wallets.length > 0 ? wallets[0]?.address : walletAddress)}
                          className="h-10 modern-button bg-primary hover:bg-primary/90 text-primary-foreground focus-modern"
                        >
                          {copied ? (
                            <>
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Copied!
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              Copy
                            </>
                          )}
                        </Button>

                        <Button
                          onClick={() => {
                            const address = wallets.length > 0 ? wallets[0]?.address : walletAddress
                            if (navigator.share) {
                              navigator.share({
                                title: 'My Wallet Address',
                                text: `Send USDT to this address: ${address}`,
                                url: `https://etherscan.io/address/${address}`
                              }).catch(console.error)
                            } else {
                              copyToClipboard(`Send USDT to: ${address}`)
                            }
                          }}
                          className="h-10 modern-button bg-secondary/50 hover:bg-secondary text-foreground focus-modern"
                          variant="outline"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                          </svg>
                          Share
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-primary">Important Notes</p>
                          <div className="text-xs text-muted-foreground space-y-1">
                            <p>• Only send USDT on Ethereum network to this address</p>
                            <p>• Sending other tokens may result in permanent loss</p>
                            <p>• Transactions typically confirm within 2-5 minutes</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions Preview */}
            <Card className="modern-card bg-card border border-border/30">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold">Recent Activity</h4>
                    <Button
                      className="text-xs text-primary hover:text-primary/80 p-0 h-auto bg-transparent hover:bg-transparent"
                      variant="ghost"
                    >
                      View All
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {[
                      { type: "received", amount: "250.00", time: "2 hours ago", from: "0x1234...5678" },
                      { type: "received", amount: "100.00", time: "1 day ago", from: "0xabcd...efgh" },
                      { type: "received", amount: "75.50", time: "3 days ago", from: "0x9876...5432" }
                    ].map((tx, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg border border-border/20">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                            <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Received</p>
                            <p className="text-xs text-muted-foreground">From {tx.from}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-success">+${tx.amount}</p>
                          <p className="text-xs text-muted-foreground">{tx.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* SERVICES MENU */}
        {currentView === "services" && (
          <div className="space-y-4">
            {[
              {
                title: "Cash-in / Cash-out",
                description: "Find nearby agents",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                  </svg>
                ),
              },
              {
                title: "Pay Merchant",
                description: "Scan to pay",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                  </svg>
                ),
              },
              {
                title: "Top up mobile / Bills",
                description: "Pay utilities",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                ),
              },
            ].map((service, index) => (
              <Button
                key={index}
                className="w-full h-16 justify-start gap-4 modern-button bg-card hover:bg-secondary/50 border border-border/30 text-card-foreground hover:text-foreground focus-modern p-4"
                variant="outline"
              >
                <div className="text-primary flex-shrink-0">{service.icon}</div>
                <div className="text-left flex-1">
                  <div className="font-medium text-sm">{service.title}</div>
                  <div className="text-xs text-muted-foreground">{service.description}</div>
                </div>
                <svg className="w-4 h-4 text-muted-foreground/60 icon-modern" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            ))}
          </div>
        )}
      </main>

      <div className="h-6" />
    </div>
  )
}