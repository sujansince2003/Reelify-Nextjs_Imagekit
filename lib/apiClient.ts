import { Iuser } from "@/models/user";
import { Ivideo } from "@/models/video";
export type videoDataType = Omit<Ivideo, "_id">
export type userDataType = Omit<Iuser, "_id">
type fetchOptions = {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: unknown;
    headers?: Record<string, string>
}

class ApiClient {
    private async fetch<T>(
        endpoint: string,
        options: fetchOptions = {}

    ): Promise<T> {
        const { method = "GET", body, headers = {} } = options;
        const defaultHeaders = {
            "Content-Type": "application/json",
            ...headers
        }
        const response = await fetch(`api${endpoint}`, {
            method,
            headers: defaultHeaders,
            body: body ? JSON.stringify(body) : undefined

        })

        if (!response.ok) {
            throw new Error(await response.text())
        }
        return response.json();
    }

    async getVideos() {
        return this.fetch<Ivideo[]>("/videos", {

        })
    }

    async getVideo(id: string) {
        return this.fetch<Ivideo>(`/videos/${id}`)
    }

    async createVideo(videoData: videoDataType) {
        return this.fetch("/videos", {
            method: "POST",
            body: videoData
        })
    }

    async registerUser(userData: userDataType) {
        return this.fetch("/auth/register", {
            method: "POST",
            body: userData
        })
    }

}


export const apiClient = new ApiClient();


//sample res:: converted to apiclient
// const response = await fetch("/api/auth/register", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({ email, password }),
// });