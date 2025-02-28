//connection to database

import mongoose from "mongoose";

const mongoURL = process.env.MONGODB_URL!;

if (!mongoURL) {
    console.error("Missing database URL")
    throw new Error("Mongodb connection URL not provided ")
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        const options =
        {
            bufferCommands: true,
            maxPoolSize: 10,

        };
        cached.promise = mongoose.connect(mongoURL, options).then((mongoose) => {
            return mongoose.connection;
        })


    }


    try {
        cached.conn = await cached.promise;

    } catch (error) {
        cached.promise = null
        console.error("Mongoose connection error")
        throw error;

    }
    return cached.conn

}

export { dbConnect }