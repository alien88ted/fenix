"use client"

import { FenixLogo } from "@/components/fenix-logo"
import { Card, CardContent } from "@/components/ui/card"

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center">Fenix Logo Showcase</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-8 text-center space-y-4">
              <h2 className="text-xl font-semibold">Default Logo</h2>
              <FenixLogo size="lg" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8 text-center space-y-4">
              <h2 className="text-xl font-semibold">With Status Indicator</h2>
              <FenixLogo size="lg" showStatus={true} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8 text-center space-y-4">
              <h2 className="text-xl font-semibold">Icon Only</h2>
              <FenixLogo variant="icon" size="lg" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8 text-center space-y-4">
              <h2 className="text-xl font-semibold">Animated with Status</h2>
              <FenixLogo size="lg" animate={true} showStatus={true} />
            </CardContent>
          </Card>
        </div>

        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">All Sizes with Status</h2>
          <div className="flex items-end justify-center gap-8">
            <div className="text-center space-y-2">
              <FenixLogo size="sm" showStatus={true} />
              <p className="text-xs text-muted-foreground">Small</p>
            </div>
            <div className="text-center space-y-2">
              <FenixLogo size="md" showStatus={true} />
              <p className="text-xs text-muted-foreground">Medium</p>
            </div>
            <div className="text-center space-y-2">
              <FenixLogo size="lg" showStatus={true} />
              <p className="text-xs text-muted-foreground">Large</p>
            </div>
            <div className="text-center space-y-2">
              <FenixLogo size="xl" showStatus={true} />
              <p className="text-xs text-muted-foreground">Extra Large</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}