'use client'
import { Doc, Id } from "@/convex/_generated/dataModel"
import { useParams } from "next/navigation"
import { useRouter } from "next/router"
import { useState } from "react"

	

interface DocumentListProps {
  parentDocumentId?:Id<"documents">
  level?:number
  data?:Doc<"documents">[]
}

export function DocumentList ({parentDocumentId,level=0}:DocumentListProps) {

  const params = useParams()
  const router = useRouter()
  const [expanded,setExpanded] = useState<Record<string,boolean>>({})

  const onExpand = (documentId:string) => {
    setExpanded(prevExpanded => ({
      ...prevExpanded,
      [documentId]:!prevExpanded[documentId]
    }))
  }

return (
    <div>document list</div>
)
}