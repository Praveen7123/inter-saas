import { IconVideo, IconPhone, IconFileText, IconArrowRight } from "@tabler/icons-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function PracticeOptions() {
  const options = [
    {
      title: "Video Interview Practice",
      description: "Record responses to SDR interview questions using your webcam.",
      buttonText: "Start Session",
      icon: IconVideo,
      url: "/video-interview",
    },
    {
      title: "AI Sales Call Practice",
      description: "Practice cold calls with an AI prospect.",
      buttonText: "Start Call",
      icon: IconPhone,
      url: "/ai-call-simulator",
    },
    {
      title: "Assignment Practice",
      description: "Complete training tasks to improve sales skills.",
      buttonText: "View Assignments",
      icon: IconFileText,
      url: "/assignments",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-6 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
      {options.map((option) => (
        <Card key={option.title} className="flex flex-col @container/card">
          <CardHeader>
            <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
              <option.icon className="size-6" />
            </div>
            <CardTitle>{option.title}</CardTitle>
            <CardDescription className="text-sm mt-1.5 leading-relaxed">
              {option.description}
            </CardDescription>
          </CardHeader>
          <CardFooter className="mt-auto pt-6">
            <Link href={option.url} className="w-full">
              <Button variant="outline" className="w-full group">
                {option.buttonText}
                <IconArrowRight className="size-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
