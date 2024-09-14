import Axios, { AxiosResponse } from "axios"

const BASE_URL =
    process.env.NODE_ENV === "production"
        ? "/api/"
        : "http://localhost:3030/api/"

const axios = Axios.create({
    withCredentials: true,
})

export const httpService = {
    async get<T>(endpoint: string, data?: Record<string, any>): Promise<T> {
        return ajax<T>(endpoint, "GET", data)
    },
    async post<T>(endpoint: string, data?: any): Promise<T> {
        return ajax<T>(endpoint, "POST", data)
    },
    async put<T>(endpoint: string, data?: any): Promise<T> {
        return ajax<T>(endpoint, "PUT", data)
    },
    async delete<T>(endpoint: string, data?: any): Promise<T> {
        return ajax<T>(endpoint, "DELETE", data)
    },
}

async function ajax<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    data?: Record<string, any>
): Promise<T> {
    try {
        const res: AxiosResponse<T> = await axios({
            url: `${BASE_URL}${endpoint}`,
            method,
            data: method !== "GET" ? data : undefined,
            params: method === "GET" ? data : undefined,
        })
        return res.data
    } catch (err) {
        console.log(
            `Had issues ${method}ing to the backend, endpoint: ${endpoint}, with data: `,
            data
        )
        console.dir(err)

        throw err
    }
}
