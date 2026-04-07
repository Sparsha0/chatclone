import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation";
import { createChatWithMessage } from "../actions";


export const useCreateChat = () =>{
    const queryClient = useQueryClient();

    const router = useRouter();

    return useMutation({
        mutationFn:(values)=>createChatWithMessage(values),
        onSuccess:(res)=>{
            if(res.success && res.data){
                //add optimistic ui
                const chat = res.data;
                queryClient.invalidateQueries({ queryKey: ['chats'] });
                router.push(`/chat/${chat.id}?autoTrigger=true`)
            }
        },
        onError:(error)=>{
            console.error("Create chat error:", error);
            toast.error("Failed to create chat")
        }
    });
};


export const useDeleteChat = (chatId) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    return useMutation({
        mutationFn:()=> deleteChat(chatId),
        onSuccess: () =>{
            queryClient.invalidateQueries(["chats"]);
            router.push("/");
        },
        onError:() =>{
            toast.error("Failed to delete chat");
        },
    });

};