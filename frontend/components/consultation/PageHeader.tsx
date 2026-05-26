"use client"

import { Button } from "@/components/ui/button"
import { Plus, Sparkles } from "lucide-react"
import Link from "next/link"

export function PageHeader() {
  return (
    <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg brand-gradient">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Client Consultation Assist
          </h1>
        </div>
        <p className="max-w-2xl text-pretty text-muted-foreground">
          Your AI-powered tool that assists sales engineers to close deals more intelligently. 
          Analyze client needs, generate tailored proposals, and track consultation outcomes.
        </p>
      </div>
      <Link href={"/consult/new"}>
      <Button className="brand-gradient border-0 text-white hover:opacity-90 shrink-0">
        <Plus className="mr-2 h-4 w-4" />
        New Consultation
      </Button>
      </Link>
    </div>
  )
}
