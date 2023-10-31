'use client'	

import { ChevronsRight } from "lucide-react"

import { Avatar,AvatarImage } from "@radix-ui/react-avatar"
import {DropdownMenu,DropdownMenuContent,
  DropdownMenuItem,DropdownMenuLabel,
  DropdownMenuSeparator,DropdownMenuTrigger}
 from '@/components/ui/dropdown-menu'
import { useUser } from "@clerk/clerk-react"

export function UserItem () {

  const {user} = useUser()

return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>

      </DropdownMenuTrigger>
    </DropdownMenu>
)
}