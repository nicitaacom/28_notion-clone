'use client'

import { useState } from "react"
import { useMutation } from "convex/react"
import { Globe } from "lucide-react"
import { toast } from "sonner"

import { Doc } from "@/convex/_generated/dataModel"
import {Popover,PopoverTrigger,PopoverContent} from '@/components/ui/popover'
import { useOrigin } from "@/hooks/use-origin"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"

interface PublishProps {
  initialData:Doc<'documents'>
}

export function Publish ({initialData}:PublishProps) {

  const origin = useOrigin()
  const update = useMutation(api.documents.update)

  const [copied,setCopied] = useState(false)
  const [isSubmitting,setIsSubmitting] = useState(false)

  const url = `${origin}/preview/${initialData._id}`

  const onPublish = () => {
    setIsSubmitting(true)

    const promise = update({
      id:initialData._id,
      isPublished:true
    })
    .finally(() => setIsSubmitting(false))
  
    toast.promise(promise,{
      loading:"Publishing...",
      success:"Note published",
      error:"Error to publish note."
    })
  }

    const onUnPublish = () => {
    setIsSubmitting(true)

    const promise = update({
      id:initialData._id,
      isPublished:false
    })
    .finally(() => setIsSubmitting(false))
  
    toast.promise(promise,{
      loading:"Unpublishing...",
      success:"Note unpublished",
      error:"Error to unpublish note."
    })
  }

  const onCopy = () => {
    navigator.clipboard.writeText(url)

    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 1000);
  }

return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size='sm' variant='ghost'>
          Publish
          {initialData.isPublished && <Globe className="text-sky-500 w-4 h-4 ml-2"/>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end" alignOffset={8} forceMount>
        {initialData.isPublished ? (
          <div>
            published
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center">
            <Globe className="w-8 h-8 text-muted-foreground mb-2"/>
            <p className="text-sm font-medium mb-2">
              Publish this note
            </p>
            <span className="text-xs text-muted-foreground mb-4">
              Share your work with others.
            </span>
            <Button className="w-full text-xs" size='sm' disabled={isSubmitting} onClick={onPublish}>
              Publish
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
)
}