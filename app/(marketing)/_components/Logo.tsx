import Image from "next/image";
import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";

const font = Poppins({
  subsets:['latin'],
  weight:['400','600']
})

export default function Logo () {
return (
    <div className="hidden md:flex gap-x-2 items-center">
      <Image className="dark:hidden" src='/logo.svg' width='40' height='40' alt="Logo"/>
      <Image className="hidden dark:block" src='/logo-dark.svg' width='40' height='40' alt="Logo-dark"/>
      <p className={cn("font-semibold",font.className)}>Jotion</p>
    </div>
)
}