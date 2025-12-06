'use client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import React from 'react'
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const UserDropdown = () => {
    const router = useRouter();
    const handleSignOut = () => {
        // Add sign-out logic here (e.g., clear auth tokens)
        router.push('/sign-in'); // Redirect to login page after sign-out
    }

    const user = { name: "John Doe", email: "contact@e.com" }; 
  return (
    <DropdownMenu>
    <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-3 text-gray-400 hover:text-yellow-500">
            <Avatar className="h-8 w-8">

            </Avatar>
        <div className="hidden md:flex flex-col items-start">
            <span className="text-base font-medium text-gray-400">
                {user.name}
            </span>
        </div>
        </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="text-gray-400">
        <div className="flex relative items-center gap-3 py-2" >
        <Avatar className="h-8 w-8">
          <AvatarImage src="/path/to/avatar.jpg" alt="Avatar"/>
          <AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm font-bold" >
            {user.name[0]}
            </AvatarFallback>
        </Avatar>
                <div className="hidden md:flex flex-col items-start">
            <span className="text-base font-medium text-gray-400">
                {user.name}
            </span>
        </div>
            
        </div>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Team</DropdownMenuItem>
        <DropdownMenuItem>Subscription</DropdownMenuItem>
    </DropdownMenuContent>
    </DropdownMenu>
  )
}
