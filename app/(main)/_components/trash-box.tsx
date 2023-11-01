'use client'
import React, { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery,useMutation } from "convex/react"
import { toast } from 'sonner'
import { Search } from "lucide-react"

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Spinner } from "@/components/spinner"
import { Input } from "@/components/ui/input"
	

export function TrashBox () {

  const router = useRouter()
  const params = useParams()
  const documents = useQuery(api.documents.getTrash)
  const restore = useMutation(api.documents.restore)
  const remove = useMutation(api.documents.remove)

  const [search,setSearch] = useState("")

  const filteredDocuments = documents?.filter(document => {
    return document.title.toLowerCase().includes(search.toLocaleLowerCase())
  })

  const onClick = (documentId:string) => {
    router.push(`/documents/${documentId}`)
  }

  const onRestore = (event:React.MouseEvent<HTMLDivElement,MouseEvent>,documentId:Id<'documents'>) => {
    event.stopPropagation()

    const promise = restore({id:documentId})

    toast.promise(promise,{
      loading:'Restoring note...',
      success:'Note restored!',
      error:'Failed to restore note'
    })
  }

  const onRemove = (documentId:Id<'documents'>) => {

    const promise = remove({id:documentId})

    toast.promise(promise,{
      loading:'Deleting note...',
      success:'Note deleted!',
      error:'Failed to delete note'
    })
    if (params.documentId  === documentId) {
      router.push('/documents')
    }
  }

  if (documents === undefined) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <Spinner size='lg'/>
      </div>
    )
  }


return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="w-4 h-4"/>
        <Input className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
         value={search} onChange={e => setSearch(e.target.value)}
         placeholder="Filter by page title..."/>
      </div>
      <div className="mt-2 px-1 pb-1">
        <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
          No documents found
        </p>
      </div>
    </div>
)
}