'use client'	

import EmojiPicker, {Theme} from 'emoji-picker-react'
import { useTheme } from "next-themes"

import {Popover,PopoverContent,PopoverTrigger} from '@/components/ui/popover'

interface IconPickerProps {
  onChange:(icon:string) => void
  children:React.ReactNode
  asChild?:boolean
}

export function IconPicker () {
return (
    <div></div>
)
}