
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function GET(request: Request) {
    // SECURITY: Only allow if a specific secret is passed or if no users exist
    // For this quick audit, we'll check if any admin exists.

    try {
        const adminExists = await prisma.user.findFirst({
            where: { role: 'ADMIN' }
        });

        if (adminExists) {
            return NextResponse.json({ message: "Admin already exists. Setup blocked." }, { status: 403 });
        }

        // Create Default Admin
        const hashedPassword = await bcrypt.hash("admin123", 10);

        const newAdmin = await prisma.user.create({
            data: {
                name: "Super Admin",
                email: "admin@emasantam.com",
                password: hashedPassword,
                role: "ADMIN"
            }
        });

        return NextResponse.json({
            success: true,
            message: "Admin created successfully",
            credentials: { email: "admin@emasantam.com", password: "admin123" }
        });

    } catch (error) {
        return NextResponse.json({ error: "Setup failed", details: error }, { status: 500 });
    }
}
