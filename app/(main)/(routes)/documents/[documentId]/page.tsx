'use client'

import { useQuery } from "convex/react"

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Toolbar } from "@/components/Toolbar"
import { Cover } from "@/components/Cover"

interface DocumentIdPageProps {
  params:{
    documentId:Id<'documents'>
  }
}

export default function DocumentIdPage ({params}:DocumentIdPageProps) {

  const document = useQuery(api.documents.getById,{
    documentId:params.documentId
  })

  if (document === undefined) {
    return (
      <div>Loading...</div>
    )
  }

  if (document === null) {
    return <div>Not Found</div>
}

return (
     <div className="pb-40">
      <Cover url={document.coverImage}/>
      <div className="md:max-w-3xl lg:md-max-w-4xl mx-auto">
        <Toolbar initialData={document}/>
      </div>
    </div>
)
}