'use server'

import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { signToken } from "@/lib/auth"

export async function loginAction(formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // 1. Find User by Email
    const user = await prisma.user.findUnique({
        where: { email }
    })

    // 2. Simple Password Check (In production use bcrypt/argon2)
    // For demo/prototype: we assume plain text or simple equality if encryption not set up
    if (!user || user.password !== password) {
        return { error: "Email atau Password salah" }
    }

    // 3. Set Session Cookie (JWT)
    const sessionPayload = {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email
    }

    const token = await signToken(sessionPayload);

    // Valid for 1 day
    const cookieStore = await cookies()
    cookieStore.set("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24
    })

    // 4. Role Based Redirect
    if (user.role === 'ADMIN') {
        redirect("/admin")
    } else {
        redirect("/")
    }
}

export async function logoutAction() {
    const cookieStore = await cookies()
    cookieStore.delete("session")
    redirect("/login")
}

export async function getSession() {
    const cookieStore = await cookies()
    const session = cookieStore.get("session")
    if (!session) return null
    try {
        return JSON.parse(session.value)
    } catch {
        return null
    }
}
