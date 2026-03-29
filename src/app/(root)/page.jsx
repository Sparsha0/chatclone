import Image from "next/image";
import{Button} from "@/components/ui/button";
import UserButton from "@/modules/authenticaiton/components/user-button";
import { currentUser } from "@/modules/authenticaiton/actions";
import { Divide } from "lucide-react";
import ChatMessageView  from "@/modules/chat/components/chat-message-view";


export default async function Home() {
 const user = await currentUser()

  return (
    <ChatMessageView user={user}></ChatMessageView>
  );
}
