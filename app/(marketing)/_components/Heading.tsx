'use client'

import {ArrowRight} from 'lucide-react'
import {SignInButton} from '@clerk/clerk-react'

import { Button } from "@/components/ui/button"	
import { useConvexAuth } from "convex/react"
import { Spinner } from "@/components/spinner"
import Link from "next/link"

export default function Heading () {

  const {isAuthenticated,isLoading} = useConvexAuth()

return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
        Your ideas,Documents, & Plans. Unified. Welcome to <span className="underline">Jotion</span>
      </h1>
      <h3 className="text-base sm:text-xl md:text-2xl font-medium">
        Jotion is the connected workspace where <br/>
        better, faster work happens
      </h3>
      {isLoading && (
        <div className="w-full flex justify-center items-center">
          <Spinner size='lg'/>
        </div>
      )}
      {isAuthenticated && !isLoading && (
        <Button asChild>
          <Link href='/documents'>
            Enter Jotion
          </Link>
         <ArrowRight className="w-4 h-4 ml-2"/>
        </Button>
        )}
        {isAuthenticated && !isLoading && (
          <SignInButton mode="modal">
            <Button>
              Get Jotion Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </SignInButton>
        )}
    </div>
)
}