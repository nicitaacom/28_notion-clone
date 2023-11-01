'use client'

import {File} from 'lucide-react'
import { useQuery } from "convex/react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/clerk-react"

import {CommandDialog,CommandEmpty,
  CommandGroup,CommandInput,
  CommandItem,CommandList} from '@/components/ui/command'
import { useSearch } from "@/hooks/use-search"
import { api } from "@/convex/_generated/api"
import { useEffect, useState } from "react"

export function SearchCommand () {

  const {user} = useUser()
  const router = useRouter()
  const documents = useQuery(api.documents.getSearch)
  const [isMounted,setIsMounted] = useState(false)

  const toggle = useSearch(store => store.toggle)
  const isOpen = useSearch(store => store.isOpen)
  const onClose = useSearch(store => store.onClose)

  useEffect(() => {
    setIsMounted(true)
  },[])

  if (!isMounted) {
    return null
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>

    </CommandDialog>
)
}