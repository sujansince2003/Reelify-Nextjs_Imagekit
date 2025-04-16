import User from "@/models/user";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { dbConnect } from "./db";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("email or password is missing");
                }
                try {
                    await dbConnect();
                    const userExist = await User.findOne({ email: credentials.email });
                    if (!userExist) {
                        throw new Error("user doesnot exist");
                    }
                    const isValidPassoword = await bcrypt.compare(
                        credentials.password,
                        userExist.password
                    );
                    if (!isValidPassoword) {
                        throw new Error("Invalid password");
                    }
                    //value return from here goes into session
                    return {
                        id: userExist._id.toString(),
                        email: userExist.email,
                    };
                } catch (error) {
                    throw error;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60
    },
    pages: {
        signIn: "/login",
        error: "/login"
    },
    secret: process.env.NEXTAUTH_SECRET
};
