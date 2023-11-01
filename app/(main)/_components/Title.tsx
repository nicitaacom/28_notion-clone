'use client'

import { useState } from "react"
import { useMutation } from "convex/react"

import { Doc } from "@/convex/_generated/dataModel"
import { api } from "@/convex/_generated/api"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface TitleProps {
  initialData:Doc<'documents'>
}

export function Title ({initialData}:TitleProps) {

  const update = useMutation(api.documents.update)

  const [isEditing,setIsEditing] = useState(false)

return (
    <div className="flex gap-x-1 items-center">
      {!!initialData.icon && <p>{initialData.icon}</p>}
      {isEditing ? (
        <Input className="h-7 px-2 focus-visible:ring-transparent"/>
      ) : (
        <Button className="font-normal h-auto p-1" variant='ghost' size='sm' onClick={() => {}}>
          <span className="truncate">
            {initialData?.title}
          </span>
        </Button>
      )}
    </div>
  )
}