import { ModeToggle } from '@/components/ui/mode-toggle'
import React from 'react'
import Image from "next/image";



const Header = ()=>{
    return(
        <div className='flex h-14 w-full flex-row justify-end items-center border-b border-border bg-sidebar px-4 py-2'>
            <div className="flex items-center justify-between border-b border-sidebar-border px-4 py-3">
                            <div className="flex items-center gap-2">
                                <Image
                                src={"/logo.svg"}
                                alt="Logo"
                                width={31}
                                height={10}
                                ></Image>
                                <p>Smart Ai chatBot</p>
                              
                            </div>
                        </div>
            <ModeToggle></ModeToggle>
            </div>
    )
}

export default Header