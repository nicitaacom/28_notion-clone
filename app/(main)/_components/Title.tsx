'use client'

import React, { useRef, useState } from "react"
import { useMutation } from "convex/react"

import { Doc } from "@/convex/_generated/dataModel"
import { api } from "@/convex/_generated/api"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface TitleProps {
  initialData:Doc<'documents'>
}

export function Title ({initialData}:TitleProps) {

  const inputRef = useRef<HTMLInputElement>(null)

  const update = useMutation(api.documents.update)

  const [title,setTitle] = useState(initialData.title || 'Untitled')
  const [isEditing,setIsEditing] = useState(false)

  const enableInput = () => {
    setTitle(initialData.title)
    setIsEditing(true)
    setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.setSelectionRange(0,inputRef.current.value.length)
    }, 0);
  }

  const disableInput = () => {
    setIsEditing(false)
  }

  const onChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)

    update({
      id:initialData._id,
      title:event.target.value || 'Untitled'
    })
  }

  const onKeyDown = (event:React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      disableInput()
    }
  }

return (
    <div className="flex gap-x-1 items-center">
      {!!initialData.icon && <p>{initialData.icon}</p>}
      {isEditing ? (
        <Input className="h-7 px-2 focus-visible:ring-transparent" ref={inputRef}
        onClick={enableInput} onBlur={disableInput} value={title} onChange={onChange} onKeyDown={onKeyDown}/>
      ) : (
        <Button className="font-normal h-auto p-1" variant='ghost' size='sm' onClick={enableInput}>
          <span className="truncate">
            {initialData?.title}
          </span>
        </Button>
      )}
    </div>
  )
}

Title.Skeleton = function TitleSkeleton() {
  return (
    <Skeleton className="w-20 h-8 rounded-md"/>
  )
}