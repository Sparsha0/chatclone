"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import UserButton from "@/modules/authenticaiton/components/user-button";

import { PlusIcon, SearchIcon, MenuIcon, EllipsisIcon, Trash} from "lucide-react"

const ChatSidebar = ({user}) =>{
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearchChange = (e) =>{
        setSearchQuery(e.target.value)
    }
    return(
        <div className="flex h-full w-64 flex-col border-r border-border bg-sidebar">
            <div className="flex items-center justify-between border-b border-sidebar-border px-4 py-3">
                <div className="flex items-center gap-2">
                    <Image
                    src={"/logo.svg"}
                    alt="Logo"
                    width={100}
                    height={100}
                    ></Image>
                </div>
            </div>
            <div className="p-4">
                <Link href={"/"}>
                    <Button className={"w-full"}>
                        <PlusIcon className="mr-2 h-4 w-4">
                        </PlusIcon>
                        New Chat
                    </Button>
                </Link>
            </div>
            <div className="p-4 pb-4">
                <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"></SearchIcon>
                    <Input placeholder="Search your chat..."
                    className={"pl-9 bg-sidebar-accent border-sidebar-b pr-8"}
                    value = {searchQuery}
                    onChange={handleSearchChange}></Input>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto px-2">
                <div className="text-center text-sm text-muted-foreground py-8">
                    No chats Yet
                </div>

            </div>
            <div className="p-4 flex items-center gap-3 border-t border-sidebar-border">
                <UserButton user={user}></UserButton>
                <span className="flex-1 text-sm text-sidebar-foreground truncate">{user.email}</span>
            </div>
        </div>
    )
}

export default ChatSidebar