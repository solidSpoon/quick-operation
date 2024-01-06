import Link from "next/link"
import React from "react"

import { Button } from "@/components/ui/button"

export function LinkButton({ href, children }: { href: string; children: string }) {
  return (
    <Button variant={"link"} asChild>
      <Link href={href}>{children}</Link>
    </Button>
  )
}
