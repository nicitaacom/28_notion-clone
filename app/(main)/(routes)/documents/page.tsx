'use client'

import Image from "next/image"
import { useUser } from "@clerk/clerk-react"
import { PlusCircle } from "lucide-react"
import { useMutation } from "convex/react"

import {api} from '@/convex/_generated/api'
import { Button } from "@/components/ui/button"
import { toast } from "sonner"


export default function DocumentsPage () {

  const {user} = useUser()
  const create = useMutation(api.documents.create)

  const onCreate = () => {
    const promise = create({title:'Untitled'})

    toast.promise(promise,{
      loading:"Creating a new note...",
      success:"New note created",
      error:'Failed to create a new note'
    })
  }

return (
    <div className="flex flex-col justify-center items-center h-full space-y-4">
      <Image className="dark:hidden" src='/empty.png' alt="Empty" width='300' height='300'/>
      <Image className="hidden dark:block" src='/empty-dark.png' alt="Empty" width='300' height='300'/>
      <h2 className="text-lg font-medium">
        Welcome to {user?.firstName}&apos;s Jotion
      </h2>
      <Button onClick={onCreate}>
        <PlusCircle className="w-4 h-4 mr-2"/>
        Create note
      </Button>
    </div>
)
}