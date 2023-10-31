import {v} from 'convex/values'

import {mutation,query} from './_generated/server'
import {Doc,Id} from './_generated/dataModel'

export const get = query({
  handler:async (context) => {
     const identity = await context.auth.getUserIdentity()

    if (!identity) {
      throw new Error('Not authenticated')
    }

    const documents = await context.db.query("documents").collect()

    return documents
  }
})

export const create = mutation({
  args:{
    title:v.string(),
    parentDocument:v.optional(v.id('documents'))
  },
  handler:async (context,args) => {
    const identity = await context.auth.getUserIdentity()

    if (!identity) {
      throw new Error('Not authenticated')
    }

    const userId = identity.subject

    const document = await context.db.insert('documents',{
      title:args.title,
      parentDocument:args.parentDocument,
      userId,
      isArchived:false,
      isPublished:false
    })

    return document
  }
})