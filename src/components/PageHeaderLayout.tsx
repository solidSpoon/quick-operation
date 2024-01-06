import React from "react"

import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export function PageHeaderLayout({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("w-full h-full flex flex-col")}>
      <div className="space-y-1 p-4 pb-2">
        <h1 className="text-2xl font-medium leading-none">{title}</h1>
        <p className="text-base text-muted-foreground">{description}</p>
      </div>
      <Separator className="" />
      <div className="h-0 flex-1">{children}</div>
    </div>
  )
}
