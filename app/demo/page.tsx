"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center">Fenix Logo Showcase</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-8 text-center space-y-4">
              <h2 className="text-xl font-semibold">PNG Logo - Small</h2>
              <Image
                src="/fenix-logo.png"
                alt="Fenix Logo"
                width={64}
                height={64}
                className="mx-auto"
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8 text-center space-y-4">
              <h2 className="text-xl font-semibold">PNG Logo - Medium</h2>
              <Image
                src="/fenix-logo.png"
                alt="Fenix Logo"
                width={96}
                height={96}
                className="mx-auto"
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8 text-center space-y-4">
              <h2 className="text-xl font-semibold">PNG Logo - Large</h2>
              <Image
                src="/fenix-logo.png"
                alt="Fenix Logo"
                width={128}
                height={128}
                className="mx-auto"
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8 text-center space-y-4">
              <h2 className="text-xl font-semibold">PNG Logo - Extra Large</h2>
              <Image
                src="/fenix-logo.png"
                alt="Fenix Logo"
                width={160}
                height={160}
                className="mx-auto"
              />
            </CardContent>
          </Card>
        </div>

        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">Header Style Logo</h2>
          <div className="flex items-center justify-center gap-4">
            <Image
              src="/fenix-logo.png"
              alt="Fenix Logo"
              width={32}
              height={32}
              className="logo-hover transition-all duration-150"
            />
            <h3 className="text-xl font-semibold">Fenix</h3>
          </div>
        </div>
      </div>
    </div>
  )
}