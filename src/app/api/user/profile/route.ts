import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) return NextResponse.json({ error: "No ID" });

    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(userId) }
        });

        // Note: address/phone might not be in User schema yet. 
        // User schema currently: id, name, email, password, role, joinedAt
        // For audit fix, if we want autofill, we should probably add phone/address to User schema too.
        // Or just autofill name/email.

        return NextResponse.json({
            user: {
                name: user?.name,
                email: user?.email,
                phone: "", // Not in DB yet
                address: "" // Not in DB yet
            }
        });
    } catch (e) {
        return NextResponse.json({ error: "Err" });
    }
}
