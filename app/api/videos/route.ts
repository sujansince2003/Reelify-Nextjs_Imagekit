import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/db";
import Video, { Ivideo } from "@/models/video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function GET() {

    try {
        await dbConnect();
        const videos = await Video.find({}).sort({ createdAt: -1 }).lean()
        if (!videos || videos.length == 0) {
            return NextResponse.json([], { status: 200 })
        }
        return NextResponse.json(videos)

    } catch (error) {
        console.log(error)
        return NextResponse.json({ errorMsg: "Error in videos" }, { status: 200 })
    }


}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ msg: "failed to authenticate user" }, { status: 401 })

        }
        await dbConnect();
        const body: Ivideo = await req.json();
        if (!body.title || !body.description || !body.thumbnailUrl || !body.videoUrl) {
            return NextResponse.json({ msg: "missing required fields" }, { status: 401 })
        }
        const videoData = {
            ...body,
            controls: body.controls ?? true,
            transformation: {
                height: 1920,
                width: 1080,
                quality: body.transformation?.quality ?? 100
            }

        }
        const newVideo = await Video.create(videoData);
        return NextResponse.json({ msg: "uploaded successfully", newVideo }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ error, msg: "Error occured while uploading" }, { status: 200 })

    }
}