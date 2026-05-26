"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Building2, User, ArrowRight, Clock } from "lucide-react"

const consultations = [
  {
    id: 1,
    clientName: "Global Logistics Inc.",
    contactPerson: "Michael Chen",
    date: "May 18, 2026",
    status: "In Progress",
    dealValue: "$62,000",
    industry: "Logistics",
    summary: "Fleet management system integration with real-time tracking capabilities. Follow-up scheduled for demo presentation.",
  },
]

const statusStyles = {
  Won: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  "In Progress": "bg-amber-500/10 text-amber-700 border-amber-200",
  Lost: "bg-red-500/10 text-red-700 border-red-200",
}

export function ConsultationCards() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Recent Consultations</h2>
        <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
          View All
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {consultations.map((consultation) => (
          <Card 
            key={consultation.id} 
            className="group cursor-pointer border-border/60 bg-card shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <CardTitle className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                    {consultation.clientName}
                  </CardTitle>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <User className="h-3.5 w-3.5" />
                    {consultation.contactPerson}
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={statusStyles[consultation.status as keyof typeof statusStyles]}
                >
                  {consultation.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">
                {consultation.summary}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5" />
                  {consultation.industry}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {consultation.date}
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-border/60 pt-3">
                <span className="text-sm font-semibold text-foreground">
                  {consultation.dealValue}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-3 text-xs text-muted-foreground hover:text-primary"
                >
                  View Details
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
