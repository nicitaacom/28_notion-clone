'use client'
import { cn } from "@/lib/utils"
import { ChevronsLeft, MenuIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import { ElementRef, useRef, useState } from "react"
import {useMediaQuery} from 'usehooks-ts'

	

export function Navigation () {
  const pathname = usePathname()
  const isMobile = useMediaQuery("(max-width:768px)")
  
  const isResizingRef = useRef(false)
  const sidebarRef = useRef<ElementRef<'aside'>>(null)
  const navbarRef = useRef<ElementRef<'div'>>(null)
  const [isResetting,setIsResetting] = useState(false)
  const [isCollapsed,setIsCollapsed] = useState(isMobile)

return (
    <>
    <aside className={cn(`group/sidebar h-full bg-secondary overflow-y-auto relative flex flex-col w-60 z-[99999]`,
    isResetting && 'transition-all ease-in-out duration-300',
    isMobile && 'w-0')}
    ref={sidebarRef}>
      <div>
        <div className={cn(`w-6 h-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute
        top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition`,
        isMobile && 'opacity-100')} role="button">
          <ChevronsLeft className="w-6 h-6"/>
        </div>
        <div>
          <p>
          Action items
        </p>
        </div>
        <div className="mt-4">
          <p>Documents</p>
        </div>
        <div className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10
        right-0 top-0"
        onMouseDown={() => {}}
        onClick={() => {}}>

        </div>
      </div>
    </aside>
    <div className={cn(`absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]`,
    isResetting && 'transition-all ease-in-out duration-300',
    isMobile && 'left-0 w-full')} ref={navbarRef}>
      <nav className="bg-transparent px-3 py-2 w-full">
        {isCollapsed && <MenuIcon className="w-6 h-6 text-muted-foreground" role="button"/>}
      </nav>
    </div>
    </>
)
}