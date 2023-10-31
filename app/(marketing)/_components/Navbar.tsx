'use client'
import { useScrollTop } from "@/hooks/use-scroll-top"

	

export function Navbar () {

  const scrolled = useScrollTop()

return (
    <div className="z-50 bg-background fixed top-0 flex items-center w-full p-6">
      Navbar
    </div>
)
}