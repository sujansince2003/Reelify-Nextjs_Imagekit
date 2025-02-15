import { Connection } from "mongoose"
declare global {
    // eslint-disable-next-line no-var
    var mongoose: {
        conn: Connection | null,
        promise: Promise<Connection> | null
    }
}

export { }