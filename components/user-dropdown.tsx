'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { usePrivy, useLogout, useWallets } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';

export function UserDropdown() {
  const router = useRouter();
  const { user, exportWallet } = usePrivy();
  const { logout } = useLogout();
  const { wallets } = useWallets();
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showWalletDetails, setShowWalletDetails] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExportKey = async () => {
    if (!wallets.length) {
      alert('No wallet to export');
      return;
    }

    const embeddedWallet = wallets.find(w => w.walletClient === 'privy');
    if (!embeddedWallet) {
      alert('Key export is only available for embedded wallets');
      return;
    }

    setIsExporting(true);
    try {
      const exportedWallet = await exportWallet();
      if (exportedWallet?.privateKey) {
        // Create a temporary textarea to copy the key
        const textarea = document.createElement('textarea');
        textarea.value = exportedWallet.privateKey;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        alert('Private key copied to clipboard! Keep it safe and never share it.');
      }
    } catch (error) {
      console.error('Failed to export key:', error);
      alert('Failed to export key. Please try again.');
    } finally {
      setIsExporting(false);
      setIsOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // Get user display info
  const displayName = user?.google?.name || user?.twitter?.username || user?.email?.address || 'User';
  const displayEmail = user?.email?.address || user?.google?.email || '';
  const walletAddress = wallets[0]?.address;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[999]" 
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
      
      <div className="relative z-[1000]" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
        aria-label="User menu"
      >
        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
          <span className="text-xs font-semibold text-primary-foreground">
            {displayName.charAt(0).toUpperCase()}
          </span>
        </div>
        
        {/* Dropdown Arrow */}
        <svg
          className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-lg border border-border bg-card shadow-xl z-[1001]">
          {/* User Info Section */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary-foreground">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{displayName}</p>
                {displayEmail && (
                  <p className="text-xs text-muted-foreground truncate">{displayEmail}</p>
                )}
              </div>
            </div>
            
            {/* Wallet Address - Collapsible */}
            {walletAddress && (
              <div className="mt-3">
                <button
                  onClick={() => setShowWalletDetails(!showWalletDetails)}
                  className="w-full flex items-center justify-between p-2 bg-muted/30 hover:bg-muted/50 rounded transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-success rounded-full" />
                    <span className="text-xs text-muted-foreground">Wallet</span>
                  </div>
                  <svg className={`w-3 h-3 text-muted-foreground transition-transform ${showWalletDetails ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showWalletDetails && (
                  <div className="mt-2 p-2 bg-muted/50 rounded border border-border/30">
                    <p className="text-xs font-mono break-all select-all">
                      {walletAddress}
                    </p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(walletAddress);
                        // Visual feedback could be added here
                      }}
                      className="mt-1 text-xs text-primary hover:text-primary/80 transition-colors"
                    >
                      Copy Address
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <button
              onClick={() => {
                router.push('/dashboard');
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-muted/50 transition-colors text-left"
            >
              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-sm">Dashboard</span>
            </button>


            {wallets.some(w => w.walletClient === 'privy') && (
              <button
                onClick={handleExportKey}
                disabled={isExporting}
                className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-muted/50 transition-colors text-left"
              >
                <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                <span className="text-sm">{isExporting ? 'Exporting...' : 'Backup Wallet'}</span>
              </button>
            )}

            <button
              onClick={() => {
                router.push('/refresh');
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-muted/50 transition-colors text-left"
            >
              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-sm">Refresh Balance</span>
            </button>

            <div className="my-2 border-t border-border" />

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-muted/50 transition-colors text-left text-destructive"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
