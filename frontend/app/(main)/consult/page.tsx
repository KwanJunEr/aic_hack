import { StatsCards } from "@/components/consultation/StatsCard"
import { ConsultationCards } from "@/components/consultation/ConsultationCard"
import { PageHeader } from "@/components/consultation/PageHeader"

export default function Consult() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-2">
        <PageHeader />
        <StatsCards />
        <ConsultationCards />
      </div>
    </main>
  )
}
