import { IconPlayerPlay, IconArrowRight } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function RecommendedPractice() {
  return (
    <div className="px-4 lg:px-6 py-4">
      <Card className="from-primary/5 to-card bg-gradient-to-r border-dashed border-2">
        <div className="flex flex-col md:flex-row items-center justify-between p-6 gap-6">
          <CardHeader className="p-0 gap-1.5 text-center md:text-left">
            <CardDescription className="text-primary font-medium uppercase tracking-wider text-xs">Recommended Practice</CardDescription>
            <CardTitle className="text-2xl">Scenario: Handling objections during SaaS sales</CardTitle>
            <p className="text-muted-foreground">Difficulty: <span className="text-foreground font-semibold">Intermediate</span> • Estimated time: 15 mins</p>
          </CardHeader>
          <Button size="lg" className="rounded-full px-8 gap-2">
            <IconPlayerPlay className="size-5 fill-current" />
            Start Practice
            <IconArrowRight className="size-5" />
          </Button>
        </div>
      </Card>
    </div>
  )
}
