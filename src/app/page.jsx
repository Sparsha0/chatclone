import Image from "next/image";
import{Button} from "@/components/ui/button";
import UserButton from "@/modules/authenticaiton/components/user-button";
import { currentUser } from "@/modules/authenticaiton/actions";
import { Divide } from "lucide-react";


export default async function Home() {
 const user = await currentUser()
 if(!user){
  return(
    <div className="flex ...">
      <p>Please sign in to continue</p>
    </div>
  )
 }
  return (
    <div className = "flex flex-col items-center justify-center h-screen">
      <UserButton user={user}></UserButton>
    </div>
  );
}
