"use client";
import { useMemo, useState } from "react";
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
import DeleteChatModal from "@/components/ui/delete-chat-modal";
import UserButton from "@/modules/authenticaiton/components/user-button";

import { PlusIcon, SearchIcon, MenuIcon, EllipsisIcon, Trash} from "lucide-react"
import { useChatStore } from "../store/chat-store";
import { useQuery } from "@tanstack/react-query";

const ChatSidebar = ({user}) =>{
    const {activeChatId, setActivaeChatId} = useChatStore();
    const [isModalOpen, setIsModelOpen] = useState(false)
    const [selectedChatId, setSelectedChatId] = useState(null)
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch chats using React Query
    const { data: chatsResult, isLoading } = useQuery({
        queryKey: ["chats"],
        queryFn: async () => {
            const response = await fetch("/api/chat/get-chats");
            return response.json();
        }
    });

    const chats = chatsResult?.success ? chatsResult.data : [];

    const filteredChats = useMemo(()=>{
        if(!searchQuery.trim()){
            return chats;
        }

        const query = searchQuery.toLowerCase();
        return chats.filter(chat=>
            chat.title?.toLowerCase().includes(query)||
            chat.messages?.some(msg=>
                msg.content?.toLowerCase().includes(query)
            )
        );

    }, [chats, searchQuery]);

    const groupedChats = useMemo(()=>{
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate()-1);
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate()-7);

        const groups = {
            today:[],
            yesterday:[],
            lastWeek:[],
            older:[]
        };


        filteredChats.forEach(chat =>{
            const chatDate = new Date(chat.createdAt);

            if(chatDate >= today){
                groups.today.push(chat);
            }
            else if (chatDate >= yesterday) {
        groups.yesterday.push(chat);
      } else if (chatDate >= lastWeek) {
        groups.lastWeek.push(chat);
      } else {
        groups.older.push(chat);
      }
        });
        return groups;
    }, [filteredChats]);

    const onDelete = (e, chatId)=>{
        e.preventDefault();
        e.stopPropagation();
        setSelectedChatId(chatId);
        setIsModelOpen(true);
    }

    const handleSearchChange = (e) =>{
        setSearchQuery(e.target.value)
    };

    const handleClearSearch = () =>{
        setSearchQuery("");
    }



    const renderChatList = (chatList) =>{
        if(chatList.length === 0) return null;

        return chatList.map((chat)=>(
            <Link
            key = {chat.id}
            href={`/chat/${chat.id}`}
            className={cn(
                 "block rounded-lg px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors", 
          chat.id === activeChatId && "bg-sidebar-accent"
            )}>
                <div className="flex flex-row justify-between items-center gap-2">
                    <span className="truncate flex-1">{chat.title}</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                            variants="ghost"
                            size="icon"
                            className="h-6 w-6 group-hover:opacity-100 hover:bg-sidebar-accent-foreground/10"
                            onClick={(e) => e.preventDefault()}>
                                <EllipsisIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator></DropdownMenuSeparator>
                            <DropdownMenuItem
                            className="flex flex-row gap-2 cursor-pointer" 
                onClick={(e) => onDelete(e, chat.id)}>
                    <Trash className="h-4 w-4 text-red-500" ></Trash>
                    <span className="text-red-500">Delete</span>
                </DropdownMenuItem>

                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </Link>
        ))
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
                    {searchQuery && (
                        <button onClick={handleClearSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                              ×
                        </button>
                    )}
                </div>
                {searchQuery && (
          <div className="mt-2 text-xs text-muted-foreground">
            Found {filteredChats.length} {filteredChats.length === 1 ? 'chat' : 'chats'}
          </div>
        )}
            </div>
        <div className="flex-1 overflow-y-auto px-2">
        {filteredChats.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-8">
            {searchQuery ? "No chats found" : "No chats yet"}
          </div>
        ) : (
          <>
            {groupedChats.today.length > 0 && (
              <div className="mb-4">
                <div className="mb-2 px-2 text-xs font-semibold text-muted-foreground">Today</div>
                {renderChatList(groupedChats.today)}
              </div>
            )}
            
            {groupedChats.yesterday.length > 0 && (
              <div className="mb-4">
                <div className="mb-2 px-2 text-xs font-semibold text-muted-foreground">Yesterday</div>
                {renderChatList(groupedChats.yesterday)}
              </div>
            )}
            
            {groupedChats.lastWeek.length > 0 && (
              <div className="mb-4">
                <div className="mb-2 px-2 text-xs font-semibold text-muted-foreground">Last 7 Days</div>
                {renderChatList(groupedChats.lastWeek)}
              </div>
            )}
            
            {groupedChats.older.length > 0 && (
              <div className="mb-4">
                <div className="mb-2 px-2 text-xs font-semibold text-muted-foreground">Older</div>
                {renderChatList(groupedChats.older)}
              </div>
            )}
          </>
        )}
      </div>
            
            <div className="p-4 flex items-center gap-3 border-t border-sidebar-border">
                <UserButton user={user}></UserButton>
                <span className="flex-1 text-sm text-sidebar-foreground truncate">{user.email}</span>
            </div>
            <DeleteChatModal
            chatId={selectedChatId}
            isModalOpen={isModalOpen}
            setIsModelOpen={setIsModelOpen}></DeleteChatModal>
        </div>
    )
}

export default ChatSidebar