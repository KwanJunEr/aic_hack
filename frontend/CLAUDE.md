@AGENTS.md

# CLAUDE.md — Autonomous Sales Engineer Frontend

## Project Overview

**Product**: Autonomous Sales Engineer — AI-powered pre-sales proposal generation system  
**Stack**: Next.js 14 (App Router) · TypeScript · Tailwind CSS · shadcn/ui  
**Architecture**: 3-part multi-agent system with MongoDB state persistence and LangSmith tracing  
**Users**: Technical Sales Consultants (TSC) and senior sales managers

---

## Tech Stack

```
Next.js 16         App Router, Server Components, Server Actions
TypeScript          Strict mode enabled
Tailwind CSS        Utility-first styling, custom design tokens
shadcn/ui           Component library (New York style)
```

---


### Proposal Scoring Types

```typescript
// types/proposal.ts
export interface ProposalScore {
  proposalId: string
  tier: "premium" | "standard" | "budget"
  scores: {
    cost: number        // 0-100 — how well it fits budget
    fit: number         // 0-100 — how well specs match requirements
    risk: number        // 0-100 — compatibility and delivery risk (higher = lower risk)
    confidence: number  // 0-100 — agent confidence in choices
    margin: number      // 0-100 — estimated profit margin score
  }
  totalScore: number
  recommendation: string  // agent-generated human-readable justification
  flaggedComponents: FlaggedComponent[]
}
```

---



### CoT Trace Display

```typescript
// components/shared/CotTrace.tsx
"use client"

import { useState } from "react"
import { ChevronDown, Brain } from "lucide-react"
import { cn } from "@/lib/utils"

interface CotTraceProps {
  agentName: string
  reasoning: string[]
  langsmithUrl?: string
}

export function CotTrace({ agentName, reasoning, langsmithUrl }: CotTraceProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-surface-2 hover:bg-surface-3 transition-colors"
      >
        <span className="flex items-center gap-2 text-sm font-medium">
          <Brain className="h-4 w-4 text-brand-accent" />
          {agentName} — Chain of Thought
        </span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="px-4 py-3 space-y-2 bg-surface-1">
          {reasoning.map((step, i) => (
            <div key={i} className="flex gap-3 text-sm">
              <span className="text-muted-foreground font-mono text-xs mt-0.5">{i + 1}.</span>
              <p className="font-mono text-xs text-foreground/80 leading-relaxed">{step}</p>
            </div>
          ))}
          {langsmithUrl && (
            <a
              href={langsmithUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-brand-accent hover:underline mt-2 inline-block"
            >
              View full trace in LangSmith →
            </a>
          )}
        </div>
      )}
    </div>
  )
}
```

---

## Proposal Comparison Component

```typescript
// components/part2/ProposalVersionCard.tsx
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ScoreBreakdown } from "./ScoreBreakdown"

const tierConfig = {
  premium: { label: "💎 Premium", color: "bg-tier-premium/10 border-tier-premium/30 text-tier-premium" },
  standard: { label: "✅ Standard", color: "bg-tier-standard/10 border-tier-standard/30 text-tier-standard" },
  budget: { label: "💰 Budget", color: "bg-tier-budget/10 border-tier-budget/30 text-tier-budget" },
}

export function ProposalVersionCard({ proposal, score, onSelect }: Props) {
  const config = tierConfig[proposal.tier]

  return (
    <Card className={cn("border-2 transition-all cursor-pointer hover:shadow-lg", config.color)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className={config.color}>{config.label}</Badge>
          <span className="font-display text-2xl font-bold">
            RM {proposal.totalPrice.toLocaleString()}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Component list */}
        <div className="space-y-2">
          {proposal.components.map((component) => (
            <div key={component.sku} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{component.name}</span>
              <span className="font-medium">RM {component.price.toLocaleString()}</span>
            </div>
          ))}
        </div>
        {/* Score breakdown */}
        <ScoreBreakdown scores={score.scores} />
        {/* Agent recommendation */}
        <p className="text-xs text-muted-foreground italic">{score.recommendation}</p>
      </CardContent>
    </Card>
  )
}
```

---

## Key Rules

### Do
- Use Server Components for all data fetching
- Use Server Actions for all mutations
- Keep `"use client"` at leaf components only
- Always show loading skeletons during agent processing



- Color is never the only indicator — always pair with text or icon

---



## Getting Started

```bash
# Install dependencies
npm install

# Install shadcn components
npx shadcn@latest init
npx shadcn@latest add button card badge dialog sheet progress separator skeleton tabs tooltip popover form input label textarea select alert scroll-area

# Run dev server
npm run dev
```