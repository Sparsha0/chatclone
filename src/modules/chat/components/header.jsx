import { ModeToggle } from '@/components/ui/mode-toggle'
import React from 'react'
import Image from "next/image";



const Header = ()=>{
    return(
        <div className='flex h-14 w-full flex-row justify-end items-center border-b border-border bg-sidebar px-4 py-2'>
            <ModeToggle></ModeToggle>
            </div>
    )
}

export default Header