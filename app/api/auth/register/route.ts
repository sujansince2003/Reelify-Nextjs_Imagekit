import { NextResponse, NextRequest } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/user";
import { z } from "zod"
const userSchema = z.object(
    {
        email: z.string().email(),
        password: z.string().min(6, "password must be atleast 6 character long")

    }
);


export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const validationResult = userSchema.safeParse(body)


        if (!validationResult.success) {
            return NextResponse.json({
                message: "Invalid data ",
                errors: validationResult.error.format()
            }, { status: 400 })

        }
        const { email, password } = body;

        await dbConnect()
        const user = await User.findOne({
            email: email
        })
        if (user) {
            return NextResponse.json({
                msg: "User already exists"
            }, { status: 409 })
        } else {
            const newUser = new User({
                email: email,
                password: password
            })
            await newUser.save()
            return NextResponse.json({
                message: "User created successfully"
            }, { status: 201 })
        }

    } catch (error) {
        console.error("Error while user registration", error)

        return NextResponse.json({
            message: "Error occured while registering user",
            error: error instanceof Error ? error.message : "Unknown Error occured"
        }, { status: 500 })
    }

}