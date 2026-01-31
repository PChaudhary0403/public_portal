import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from "bcryptjs"
import prisma from "./db"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as NextAuthOptions["adapter"],
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                console.log("🔐 Authorize called with email:", credentials?.email)

                if (!credentials?.email || !credentials?.password) {
                    console.log("❌ Missing credentials")
                    throw new Error("Please enter email and password")
                }

                try {
                    console.log("🔍 Looking up user in DB...")
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email },
                        include: { authority: true }
                    })
                    console.log("👤 User found:", user ? "Yes" : "No")

                    if (!user || !user.password) {
                        console.log("❌ User not found or no password")
                        throw new Error("Invalid email or password")
                    }

                    console.log("🔑 Verifying password...")
                    const isPasswordValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    )
                    console.log("✅ Password valid:", isPasswordValid)

                    if (!isPasswordValid) {
                        console.log("❌ Invalid password")
                        throw new Error("Invalid email or password")
                    }

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                        authorityId: user.authority?.id || null
                    }
                } catch (error) {
                    console.error("💥 Auth error:", error)
                    throw error
                }
            }
        })
    ],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = user.role
                token.authorityId = user.authorityId
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.role = token.role as string
                session.user.authorityId = token.authorityId as string | null
            }
            return session
        }
    },
    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
    },
    secret: process.env.NEXTAUTH_SECRET,
}
