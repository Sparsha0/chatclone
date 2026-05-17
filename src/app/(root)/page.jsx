import Image from "next/image";
import { Button } from "@/components/ui/button";
import UserButton from "@/modules/authenticaiton/components/user-button";
import { currentUser } from "@/modules/authenticaiton/actions";
import { Divide } from "lucide-react";
import ChatMessageView from "@/modules/chat/components/chat-message-view";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const user = await currentUser();
  const supabase = createClient();
  const { data: todos, error } = await supabase.from("todos").select();

  if (error) {
    throw error;
  }

  return (
    <>
      <ChatMessageView user={user} />
      <ul>
        {todos?.map((todo) => (
          <li key={todo.id}>{todo.name}</li>
        ))}
      </ul>
    </>
  );
}
