
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password, phoneNumber, nik, npwp, birthPlace, birthDate } = body;

        // 1. Validation
        if (!name || !email || !password || !phoneNumber || !nik || !birthPlace || !birthDate) {
            return NextResponse.json({ error: 'Data tidak lengkap. Mohon isi semua field bertanda *' }, { status: 400 });
        }

        // 2. Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: email }
        });

        if (existingUser) {
            return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 400 });
        }

        // 3. Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Create User (Force USER role)
        // NOTE: Using 'as any' because Prisma Client may not have regenerated types yet
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'USER', // Strict Default
                phoneNumber,
                nik,
                npwp: npwp || null,
                birthPlace,
                birthDate: new Date(birthDate) // Ensure DateTime format
            } as any
        });

        // 5. Create associated Cart (empty)
        await prisma.cart.create({
            data: {
                userId: newUser.id
            }
        });

        return NextResponse.json({
            success: true,
            message: "Registrasi berhasil",
            user: { id: newUser.id, name: newUser.name, email: newUser.email }
        }, { status: 201 });

    } catch (error) {
        console.error("Register Error:", error);
        return NextResponse.json({ error: 'Terjadi kesalahan sistem' }, { status: 500 });
    }
}
