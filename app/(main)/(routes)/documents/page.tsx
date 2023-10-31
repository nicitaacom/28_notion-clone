'use client'

import Image from "next/image"
import { useUser } from "@clerk/clerk-react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default function DocumentsPage () {

  const {user} = useUser()

return (
    <div className="flex flex-col justify-center items-center h-full space-y-4">
      <Image className="dark:hidden" src='/empty.png' alt="Empty" width='300' height='300'/>
      <Image className="hidden dark:block" src='/empty-dark.png' alt="Empty" width='300' height='300'/>
      <h2 className="text-lg font-medium">
        Welcome to {user?.firstName}&apos;s Jotion
      </h2>
      <Button>
        <PlusCircle className="w-4 h-4"/>
        Create note
      </Button>
    </div>
)
}