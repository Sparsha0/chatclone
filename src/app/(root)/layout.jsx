import React from 'react'
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import ChatSidebar from '@/modules/chat/components/chat-sidebar';
import { currentUser } from '@/modules/authenticaiton/actions';
import Header  from '@/modules/chat/components/header'




const layout = async({children}) =>{
    const session = await auth.api.getSession({
            headers: await headers()
        });

        const user = await currentUser();

        if(!session){
            return redirect ("/sign-in")
        }

        return( <div className="flex h-screen overflow-hidden">
            <ChatSidebar user={user} chats={[]}/>
            <main className="flex-1 overflow-hidden">
                <Header/>
                { children }
            </main>
            </div>)
 }; 

export default layout