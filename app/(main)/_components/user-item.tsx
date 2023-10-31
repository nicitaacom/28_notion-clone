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
        <div className="flex items-center text-sm p-3 w-full hover:bg-primary/5" role="button">
          <div className="gap-x-2 flex items-center max-w-[150px]">
            <Avatar className="w-5 h-5">
              <AvatarImage src={user?.imageUrl}/>
            </Avatar>
              <span className="text-start font-medium line-clamp-1">
                {user?.fullName}&apos;s Jotion
              </span>
          </div>
        </div>
      </DropdownMenuTrigger>
    </DropdownMenu>
)
}