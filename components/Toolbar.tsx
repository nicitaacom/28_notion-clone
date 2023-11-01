'use client'

import { Doc } from "@/convex/_generated/dataModel"

interface ToolbarProps {
  initialData:Doc<'documents'>
  prewiew?:boolean
}

export function Toolbar ({initialData,prewiew}:ToolbarProps) {
return (
    <div className="pl-[54px] group relative">
      {!!initialData.icon && !prewiew && (
        <div className="flex gap-x-2 items-center group/icon pt-6">

        </div>
      )}
    </div>
)
}