export interface User {
    id: string
    bio: string
    fullName: string
    darkMode: "light" | "default" | "dark"
    username: string
    email: string
    starredBoardIds: []
}
