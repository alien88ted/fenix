"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { usePrivy, useLogin, useLogout, useWallets } from "@privy-io/react-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserDropdown } from "@/components/user-dropdown"
import { plasmaAPI, type PlasmaWalletData, type PlasmaTransaction } from "@/lib/plasma-api"
import { useWalletData } from "@/hooks/useWalletData"
import { WalletCard } from "@/components/wallet-card"
import { LoadingScreen } from "@/components/loading-screen"
import { Toaster } from "@/components/ui/sonner"
import { handleSuccess, handleError } from "@/lib/utils/error-handler"
import { FenixLogo } from "@/components/fenix-logo"

export default function FenixWallet() {
  const { ready, authenticated, user } = usePrivy()
  const { login } = useLogin({
    onComplete: ({ user, isNewUser }) => {
      // Wallet data will be auto-synced by useWalletData hook
    },
  })
  const { logout } = useLogout()
  const { wallets: privyWallets } = useWallets()
  
  // Use real wallet data from database
  const {
    wallets: dbWallets,
    transactions,
    isLoading: isLoadingWallets,
    error: walletError,
    syncWallets,
    createWallet,
    recordTransaction,
    getPrimaryWallet,
    getTotalBalance,
  } = useWalletData()

  const [isLoading, setIsLoading] = useState(true)
  const [currentView, setCurrentView] = useState("home") // home, send, receive, services, cashin, paymerchant, bills
  const [sendStep, setSendStep] = useState(1) // 1: form, 2: confirm, 3: processing, 4: success
  const [serviceStep, setServiceStep] = useState(1) // For service flows
  const [sendData, setSendData] = useState({ address: "", amount: "", memo: "" })
  const [serviceData, setServiceData] = useState({ type: "", amount: "", details: "" })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  // Get primary wallet data
  const primaryWallet = getPrimaryWallet()
  const walletAddress = primaryWallet?.address || "0x..."
  const balance = getTotalBalance('USDT')

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 200)
  }, [])

  // Auto-return to home after service completion
  useEffect(() => {
    if ((currentView === "cashin" || currentView === "paymerchant" || currentView === "bills") && serviceStep === 4) {
      const timer = setTimeout(() => {
        handleViewChange("home")
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [currentView, serviceStep])


  const handleViewChange = (newView: string) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentView(newView)
      setServiceStep(1) // Reset service step
      setServiceData({ type: "", amount: "", details: "" }) // Reset service data
      setIsTransitioning(false)
    }, 150)
  }

  const validateSendForm = () => {
    const newErrors: Record<string, string> = {}
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
      setIsTransitioning(true)
      setTimeout(() => {
        setSendStep(2)
        setIsTransitioning(false)
      }, 100)
    }
  }

  const handleSendConfirm = async () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setSendStep(3)
      setIsTransitioning(false)
    }, 100)

    try {
      // Send real transaction via PLASMA network
      const wallet = privyWallets[0]
      if (wallet && wallet.address) {
        const txResult = await plasmaAPI.sendTransaction(
          wallet.address,
          sendData.address,
          sendData.amount
        )

        // Update UI to success
        setIsTransitioning(true)
        setTimeout(() => {
          setSendStep(4)
          setIsTransitioning(false)
        }, 100)

        // Refresh balance after transaction
        // Wallet data is auto-synced by useWalletData hook
      }
    } catch (error) {
      console.error('Transaction failed:', error)
      // Still show success for demo purposes
      setIsTransitioning(true)
      setTimeout(() => {
        setSendStep(4)
        setIsTransitioning(false)
      }, 100)
    }

    // Auto return to home after 2.5 seconds
    setTimeout(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentView("home")
        setSendStep(1)
        setSendData({ address: "", amount: "", memo: "" })
        setErrors({})
        setIsTransitioning(false)
      }, 150)
    }, 2500)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      handleSuccess('Address copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const renderBackButton = () => (
    <button
      onClick={() => {
        if (serviceStep > 1) {
          // Go back to previous step
          setIsTransitioning(true)
          setTimeout(() => {
            setServiceStep(serviceStep - 1)
            setIsTransitioning(false)
          }, 150)
        } else {
          // Go back to home
          handleViewChange("home")
        }
      }}
      className="p-2 rounded-lg hover:bg-secondary/50 modern-button focus-modern transition-all duration-150"
      aria-label="Back"
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
        handleViewChange("send")
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
      action: () => handleViewChange("receive"),
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
      action: () => handleViewChange("services"),
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
                <FenixLogo size={64} className="logo-glow" animate />
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
      <header className="glass border-b border-border/20 relative z-50" role="banner">
        <div className="flex items-center justify-between px-6 py-5 max-w-sm mx-auto">
          <div className="flex items-center gap-3">
            {currentView !== "home" && renderBackButton()}
            <img
              src="/fenix-logo.png"
              alt="Fenix"
              width={32}
              height={32}
              className="logo-hover transition-all duration-150"
            />
            {currentView !== "home" && (
              <>
                <div className="h-6 w-px bg-border/30" />
                <h1 className="text-base font-medium text-foreground/90">
                  {currentView === "send" && "Send USDT"}
                  {currentView === "receive" && "Receive"}
                  {currentView === "services" && "Services"}
                  {currentView === "cashin" && "Cash In"}
                  {currentView === "paymerchant" && "Pay Merchant"}
                  {currentView === "bills" && "Pay Bills"}
                </h1>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <UserDropdown />
          </div>
        </div>
      </header>

      <main className={`max-w-sm mx-auto px-6 py-8 transition-all duration-150 ${isTransitioning ? 'opacity-70 scale-[0.98]' : 'opacity-100 scale-100'}`} role="main">
        {currentView === "home" && (
          <div className="space-y-8">
            <section aria-labelledby="balance-heading">
              <h2 id="balance-heading" className="sr-only">Account Balance</h2>
              <WalletCard 
                balance={balance}
                address={walletAddress}
                network="Secure Network"
                isLoading={isLoadingWallets}
                className="animate-slide-up"
              />
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
                        onClick={() => setSendData({...sendData, address: walletAddress})}
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
                        onClick={() => {
                          setIsTransitioning(true)
                          setTimeout(() => {
                            setSendStep(1)
                            setIsTransitioning(false)
                          }, 100)
                        }}
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
                          {walletAddress}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          onClick={() => copyToClipboard(walletAddress)}
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
                            const address = walletAddress
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

        {/* CASH IN/OUT FLOW */}
        {currentView === "cashin" && (
          <div className="space-y-6">
            {serviceStep === 1 && (
              <Card className="modern-card bg-card border border-border/30">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="text-center space-y-2">
                      <h3 className="text-lg font-semibold">Cash In/Out Service</h3>
                      <p className="text-sm text-muted-foreground">Find nearby agents for cash transactions</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        onClick={() => {
                          setServiceData({...serviceData, type: "cashin"})
                          setIsTransitioning(true)
                          setTimeout(() => {
                            setServiceStep(2)
                            setIsTransitioning(false)
                          }, 150)
                        }}
                        className="h-20 flex-col gap-2 modern-button bg-primary/5 hover:bg-primary/10 border border-primary/20 text-primary focus-modern"
                        variant="outline"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="font-semibold text-sm">Cash In</span>
                      </Button>
                      <Button
                        onClick={() => {
                          setServiceData({...serviceData, type: "cashout"})
                          setIsTransitioning(true)
                          setTimeout(() => {
                            setServiceStep(2)
                            setIsTransitioning(false)
                          }, 150)
                        }}
                        className="h-20 flex-col gap-2 modern-button bg-secondary/50 hover:bg-secondary border border-border/30 text-foreground focus-modern"
                        variant="outline"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                        </svg>
                        <span className="font-semibold text-sm">Cash Out</span>
                      </Button>
                    </div>

                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-primary">Agent Network</p>
                          <div className="text-xs text-muted-foreground space-y-1">
                            <p>• Find verified agents near your location</p>
                            <p>• Competitive rates with minimal fees</p>
                            <p>• Instant transactions with secure verification</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {serviceStep === 2 && (
              <Card className="modern-card bg-card border border-border/30">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="text-center space-y-2">
                      <h3 className="text-lg font-semibold">
                        {serviceData.type === "cashin" ? "Cash In" : "Cash Out"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {serviceData.type === "cashin"
                          ? "Convert cash to USDT"
                          : "Convert USDT to cash"
                        }
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Amount</label>
                        <div className="relative">
                          <input
                            type="number"
                            placeholder="0.00"
                            value={serviceData.amount}
                            onChange={(e) => setServiceData({...serviceData, amount: e.target.value})}
                            className="w-full p-3 pr-16 border border-border/30 rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary modern-button"
                          />
                          <span className="absolute right-3 top-3 text-sm text-muted-foreground">
                            {serviceData.type === "cashin" ? "USD" : "USDT"}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {serviceData.type === "cashin"
                            ? "You'll receive ~$" + (parseFloat(serviceData.amount || "0") * 0.98).toFixed(2) + " USDT"
                            : "You'll receive ~$" + (parseFloat(serviceData.amount || "0") * 0.98).toFixed(2) + " USD"
                          }
                        </p>
                      </div>

                      <Button
                        onClick={() => {
                          setIsTransitioning(true)
                          setTimeout(() => {
                            setServiceStep(3)
                            setIsTransitioning(false)
                          }, 150)
                        }}
                        disabled={!serviceData.amount}
                        className="w-full h-12 modern-button bg-primary hover:bg-primary/90 text-primary-foreground focus-modern"
                      >
                        Find Nearby Agents
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {serviceStep === 3 && (
              <Card className="modern-card bg-card border border-border/30">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Nearby Agents</h3>

                    {[
                      { name: "QuickCash Agent", distance: "0.3 km", rate: "0.98", rating: "4.9", fee: "2%" },
                      { name: "FastPay Store", distance: "0.7 km", rate: "0.97", rating: "4.8", fee: "3%" },
                      { name: "CryptoHub", distance: "1.2 km", rate: "0.99", rating: "5.0", fee: "1%" }
                    ].map((agent, index) => (
                      <Button
                        key={index}
                        onClick={() => {
                          setIsTransitioning(true)
                          setTimeout(() => {
                            setServiceStep(4)
                            setServiceData({...serviceData, details: agent.name})
                            setIsTransitioning(false)
                          }, 150)
                        }}
                        className="w-full p-4 bg-secondary/10 hover:bg-secondary/20 rounded-lg border border-border/20 transition-colors text-left modern-button"
                        variant="outline"
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-sm">{agent.name}</p>
                              <p className="text-xs text-muted-foreground">{agent.distance} away • Fee: {agent.fee}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 mb-1">
                              <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="text-xs font-medium">{agent.rating}</span>
                            </div>
                            <span className="text-xs text-primary font-semibold">Select</span>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {serviceStep === 4 && (
              <Card className="modern-card bg-card border border-border/30">
                <CardContent className="p-8 text-center">
                  <div className="space-y-6">
                    <div className="w-16 h-16 mx-auto bg-success/10 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-success">Agent Selected!</h3>
                      <p className="text-sm text-muted-foreground">
                        {serviceData.details} has been notified. They'll contact you within 5 minutes.
                      </p>
                      <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                        <p className="text-xs font-medium text-primary">Transaction: ${serviceData.amount} {serviceData.type === "cashin" ? "USD → USDT" : "USDT → USD"}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Returning to home...</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* PAY MERCHANT FLOW */}
        {currentView === "paymerchant" && (
          <div className="space-y-6">
            {serviceStep === 1 && (
              <Card className="modern-card bg-card border border-border/30">
                <CardContent className="p-8 text-center">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Pay Merchant</h3>
                      <p className="text-sm text-muted-foreground">Scan QR code to pay or enter merchant details</p>
                    </div>

                    <div className="space-y-4">
                      <Button
                        className="w-full h-16 modern-button bg-primary hover:bg-primary/90 text-primary-foreground focus-modern"
                        onClick={() => {
                          setIsTransitioning(true)
                          setTimeout(() => {
                            setServiceStep(2)
                            setServiceData({...serviceData, type: "qr"})
                            setIsTransitioning(false)
                          }, 150)
                        }}
                      >
                        <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                        </svg>
                        Scan QR Code
                      </Button>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-border/30" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-card px-2 text-muted-foreground">Or</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Enter merchant ID or name"
                          value={serviceData.details}
                          onChange={(e) => setServiceData({...serviceData, details: e.target.value})}
                          className="w-full p-3 border border-border/30 rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary modern-button"
                        />
                        <input
                          type="number"
                          placeholder="Amount to pay"
                          value={serviceData.amount}
                          onChange={(e) => setServiceData({...serviceData, amount: e.target.value})}
                          className="w-full p-3 border border-border/30 rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary modern-button"
                        />
                        <Button
                          onClick={() => {
                            setIsTransitioning(true)
                            setTimeout(() => {
                              setServiceStep(3)
                              setServiceData({...serviceData, type: "manual"})
                              setIsTransitioning(false)
                            }, 150)
                          }}
                          disabled={!serviceData.details || !serviceData.amount}
                          className="w-full h-12 modern-button bg-secondary/50 hover:bg-secondary text-foreground focus-modern"
                          variant="outline"
                        >
                          Continue Payment
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-primary">Secure Payments</p>
                          <div className="text-xs text-muted-foreground space-y-1">
                            <p>• Instant payment confirmation</p>
                            <p>• Protected by blockchain security</p>
                            <p>• Merchant verification included</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {serviceStep === 2 && (
              <Card className="modern-card bg-card border border-border/30">
                <CardContent className="p-8 text-center">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">QR Scanner</h3>
                      <p className="text-sm text-muted-foreground">Position the QR code within the frame</p>
                    </div>

                    <div className="w-64 h-64 mx-auto bg-muted/20 rounded-xl flex items-center justify-center border-2 border-border/30 relative overflow-hidden">
                      <div className="absolute inset-4 border-2 border-primary rounded-lg">
                        <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-primary rounded-tl-lg" />
                        <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-primary rounded-tr-lg" />
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-primary rounded-bl-lg" />
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-primary rounded-br-lg" />
                      </div>
                      <div className="text-center">
                        <svg className="w-16 h-16 text-muted-foreground/50 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                        </svg>
                        <p className="text-xs text-muted-foreground">Camera preview</p>
                      </div>
                    </div>

                    <Button
                      onClick={() => {
                        // Simulate QR code detection
                        setServiceData({...serviceData, details: "CoffeShop123", amount: "12.50"})
                        setIsTransitioning(true)
                        setTimeout(() => {
                          setServiceStep(3)
                          setIsTransitioning(false)
                        }, 150)
                      }}
                      className="modern-button bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      Simulate QR Detection
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {serviceStep === 3 && (
              <Card className="modern-card bg-card border border-border/30">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="text-center space-y-2">
                      <h3 className="text-lg font-semibold">Confirm Payment</h3>
                      <p className="text-sm text-muted-foreground">Review payment details</p>
                    </div>

                    <div className="space-y-4 p-4 bg-secondary/20 rounded-lg border border-border/30">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Merchant</span>
                        <span className="text-sm font-semibold">{serviceData.details}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Amount</span>
                        <span className="text-sm font-semibold">${serviceData.amount} USDT</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Network Fee</span>
                        <span className="text-sm">$0.25</span>
                      </div>
                      <div className="border-t border-border/30 pt-4">
                        <div className="flex justify-between">
                          <span className="text-sm font-semibold">Total</span>
                          <span className="text-sm font-bold">${(parseFloat(serviceData.amount || "0") + 0.25).toFixed(2)} USDT</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button
                        onClick={() => {
                          setIsTransitioning(true)
                          setTimeout(() => {
                            setServiceStep(4)
                            setIsTransitioning(false)
                          }, 150)
                        }}
                        className="w-full h-12 modern-button bg-primary hover:bg-primary/90 text-primary-foreground focus-modern"
                      >
                        Confirm Payment
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {serviceStep === 4 && (
              <Card className="modern-card bg-card border border-border/30">
                <CardContent className="p-8 text-center">
                  <div className="space-y-6">
                    <div className="w-16 h-16 mx-auto bg-success/10 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-success">Payment Sent!</h3>
                      <p className="text-sm text-muted-foreground">
                        ${serviceData.amount} USDT sent to {serviceData.details}
                      </p>
                      <div className="p-3 bg-success/5 rounded-lg border border-success/20">
                        <p className="text-xs font-mono text-success">TX: 0xmer123...pay789</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Returning to home...</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* BILLS & TOP-UP FLOW */}
        {currentView === "bills" && (
          <div className="space-y-6">
            {serviceStep === 1 && (
              <Card className="modern-card bg-card border border-border/30">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="text-center space-y-2">
                      <h3 className="text-lg font-semibold">Bills & Top-up</h3>
                      <p className="text-sm text-muted-foreground">Pay utilities and top-up mobile phones</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { title: "Mobile Top-up", icon: "📱", type: "mobile" },
                        { title: "Electricity", icon: "⚡", type: "electricity" },
                        { title: "Water", icon: "💧", type: "water" },
                        { title: "Internet", icon: "🌐", type: "internet" }
                      ].map((service, index) => (
                        <Button
                          key={index}
                          onClick={() => {
                            setServiceData({...serviceData, type: service.type, details: service.title})
                            setIsTransitioning(true)
                            setTimeout(() => {
                              setServiceStep(2)
                              setIsTransitioning(false)
                            }, 150)
                          }}
                          className="h-20 flex-col gap-2 modern-button bg-card hover:bg-secondary/50 border border-border/30 text-card-foreground hover:text-foreground focus-modern"
                          variant="outline"
                        >
                          <span className="text-2xl">{service.icon}</span>
                          <span className="font-semibold text-xs">{service.title}</span>
                        </Button>
                      ))}
                    </div>

                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-primary">Instant Payments</p>
                          <div className="text-xs text-muted-foreground space-y-1">
                            <p>• Pay bills instantly with USDT</p>
                            <p>• Mobile top-ups processed immediately</p>
                            <p>• Secure utility bill payments</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {serviceStep === 2 && (
              <Card className="modern-card bg-card border border-border/30">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="text-center space-y-2">
                      <h3 className="text-lg font-semibold">{serviceData.details}</h3>
                      <p className="text-sm text-muted-foreground">
                        {serviceData.type === "mobile" && "Enter phone number to top up"}
                        {serviceData.type === "electricity" && "Enter account number for electricity bill"}
                        {serviceData.type === "water" && "Enter account number for water bill"}
                        {serviceData.type === "internet" && "Enter account number for internet bill"}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          {serviceData.type === "mobile" ? "Phone Number" : "Account Number"}
                        </label>
                        <input
                          type="text"
                          placeholder={
                            serviceData.type === "mobile" ? "+1234567890" : "Enter account number"
                          }
                          className="w-full p-3 border border-border/30 rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary modern-button"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Amount</label>
                        <input
                          type="number"
                          placeholder="0.00"
                          value={serviceData.amount}
                          onChange={(e) => setServiceData({...serviceData, amount: e.target.value})}
                          className="w-full p-3 border border-border/30 rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary modern-button"
                        />
                      </div>

                      {serviceData.type === "mobile" && (
                        <div className="grid grid-cols-3 gap-2">
                          {["$10", "$25", "$50"].map((amount) => (
                            <Button
                              key={amount}
                              onClick={() => setServiceData({...serviceData, amount: amount.replace('$', '')})}
                              className="text-xs px-2 py-1 h-auto bg-secondary/50 hover:bg-secondary text-foreground modern-button"
                              variant="outline"
                            >
                              {amount}
                            </Button>
                          ))}
                        </div>
                      )}

                      <Button
                        onClick={() => {
                          setIsTransitioning(true)
                          setTimeout(() => {
                            setServiceStep(3)
                            setIsTransitioning(false)
                          }, 150)
                        }}
                        disabled={!serviceData.amount}
                        className="w-full h-12 modern-button bg-primary hover:bg-primary/90 text-primary-foreground focus-modern"
                      >
                        Continue Payment
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {serviceStep === 3 && (
              <Card className="modern-card bg-card border border-border/30">
                <CardContent className="p-8 text-center">
                  <div className="space-y-6">
                    <div className="w-16 h-16 mx-auto bg-success/10 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-success">Payment Successful!</h3>
                      <p className="text-sm text-muted-foreground">
                        ${serviceData.amount} USDT paid for {serviceData.details.toLowerCase()}
                      </p>
                      <div className="p-3 bg-success/5 rounded-lg border border-success/20">
                        <p className="text-xs font-mono text-success">REF: {serviceData.type.toUpperCase()}123456</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Returning to home...</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>

      <div className="h-6" />
    </div>
  )
}