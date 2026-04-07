import { NextResponse } from "next/server";
import { getAllChats } from "@/modules/chat/actions";

export async function GET() {
    try {
        const result = await getAllChats();

        if (!result.success) {
            return NextResponse.json(
                { success: false, message: result.message },
                { status: 401 }
            );
        }

        return NextResponse.json({
            success: true,
            data: result.data
        });
    } catch (error) {
        console.error("Error fetching chats:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch chats" },
            { status: 500 }
        );
    }
}