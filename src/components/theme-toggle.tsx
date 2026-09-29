"use client"

import * as React from "react"
import { Palette } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSidebar } from "./ui/sidebar"

export function ThemeToggle() {
  const { setTheme } = useTheme()
  const { state } = useSidebar()

  if (state === "collapsed") {
     return (
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Palette className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
     )
  }

  return (
     <div className="w-full">
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-2">
                <Palette className="h-[1.2rem] w-[1.2rem]" />
                <span>Appearance</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
            Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
            Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
            System
            </DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>
     </div>
  )
}
