"use server";


import db from "@/lib/db"
import { currentUser } from "@/modules/authenticaiton/actions";
import { MessageRole, MessageType} from "@prisma/client";

export const createChatWithMessage = async (values) =>{
    try{
        const user = await currentUser();
        if(!user) return{
            success:false,
            message:"Unauthorized user"
        }

        const { content, model} = values;

        if(!content || !content.trim()){
            return { success:false, message:"Message content is required"};
        }

        const title = content.slice(0, 50)+(content.length > 50 ? "...": "")

        const chat = await db.chat.create({
            data:{
                title,
                model,
                userId:user.id,
                messages:{
                    create:{
                        content,
                        messageRole:MessageRole.USER,
                        messageType:MessageType.NORMAL,
                        model
                    }
                }
            },
            include:{
                messages:true
            }
        })

        revalidatePath("/");

        return {success:true, message:"Chat created successfully", data:chat}

    }catch(error){
        console.error("Error creating chat:", error);
        return{ success:false, message:"Failed to create chat"};
    }
}


export const getAllChats = async() =>{
    try{
        const user = await currentUser();
        if(!user){
            return{
                success:false,
                message: "Unauthorized user"
            };
        }
        const chats = await db.chat.findMany({
            where:{
                userId:user.id
            },
            include:{
                messages:true
            },
            orderBy:{
                createdAt:"desc"
            }
        })
        return{
            success: true,
            message: "Chats fetched successfully",
            data:chats
        }
    }
    catch(error){
        console.error("Error fetching chats:", error);
        return{
            success: false,
            message: "Failed to fetch chats",
        };

    }
}