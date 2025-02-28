import { NextResponse, NextRequest } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/user";

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json()
        if (!email || !password) {
            return NextResponse.json({
                msg: "Username or password is missing"
            })
        }
        await dbConnect()
        const user = await User.findOne({
            email: email
        })
        if (user) {
            return NextResponse.json({
                msg: "User already exists"
            })
        } else {
            const newUser = new User({
                email: email,
                password: password
            })
            await newUser.save()
            return NextResponse.json({
                msg: "User created successfully"
            })
        }

    } catch (error) {

        return NextResponse.json({
            msg: "Error occured", error
        })
    }

}