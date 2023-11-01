'use client'
import Image from "next/image"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ImageIcon, X } from "lucide-react"
import { useConverImage } from "@/hooks/use-cover-image"


interface CoverProps {
  url?:string
  preview?:boolean
}

export function Cover ({url,preview}:CoverProps) {

  const coverIamge = useConverImage()

return (
    <div className={cn(`relative w-full h-[35vh] group`,
    !url && 'h-[12vh]',
    url && 'bg-muted')}>
      {!!url && (
        <Image className="object-cover" src={url} alt='Cover' fill/>
      )}
      {url && !preview && (
        <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex gap-x-2 items-center">
          <Button className="text-muted-foreground text-xs" variant='outline' size='sm' onClick={coverIamge.onOpen}>
            <ImageIcon className="w-4 h-4 mr-2"/>
            Change Cover
          </Button>
            <Button className="text-muted-foreground text-xs" variant='outline' size='sm' onClick={() => {}}>
            <X className="w-4 h-4 mr-2"/>
            Remove
          </Button>
        </div>
      )}
    </div>
)
}