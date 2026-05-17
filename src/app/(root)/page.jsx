import ChatMessageView from "@/modules/chat/components/chat-message-view";
import { currentUser } from "@/modules/authenticaiton/actions";
import db from "@/lib/db";

export default async function Home() {
  const user = await currentUser();

  const tests = await db.test.findMany();

  return (
    <>
      <ChatMessageView user={user} />

      <ul>
        {tests?.map((test) => (
          <li key={test.id}>{test.name}</li>
        ))}
      </ul>
    </>
  );
}