import mongoose, { Schema, model, models } from "mongoose";

export const VideoDimension =
    {
        height: 1920,
        width: 1080
    } as const

export interface Ivideo {
    _id?: mongoose.Types.ObjectId,
    title: string,
    description: string,
    videoUrl: string,
    thumbnailUrl: string,
    controls?: boolean,

    transformation?: {
        height: number,
        width: number,
        quality: number
    },
    createdAt?: Date,
    updatedAt?: Date

}

const videoSchema = new Schema<Ivideo>({
    title: String,

    description: String,
    videoUrl: String,
    thumbnailUrl: String,
    controls: { type: Boolean, default: true },
    transformation:
    {
        width: { type: Number, default: VideoDimension.width },
        height: { type: Number, default: VideoDimension.height },
        quality: { type: Number, min: 1, max: 100, default: 100 }
    }
}, {
    timestamps: true
})

const Video = models?.video || model<Ivideo>("Video", videoSchema)
export default Video

