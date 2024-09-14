import { User } from "../models/user.model"
import { httpService } from "./http.service"
import { setSessionStorage } from "./local.service"

export const userService = {
    logout,
    signup,
    getWorkspaceUsers,
    updateUser,
    getByUserName,
    getByEmail,
}

async function getWorkspaceUsers(usersIds: string[]): Promise<User[]> {
    try {
        const users = await httpService.get<User[]>("user/users", usersIds)
        return users
    } catch (err) {
        throw err
    }
}
async function getByUserName(username: string): Promise<User | undefined> {
    try {
        const data = await httpService.get<User>(`user/u/${username}`)
        return data
    } catch (err) {
        console.log(err)
    }
}
async function getByEmail(email: string): Promise<User | undefined> {
    try {
        const user = await httpService.get<User>("user/e", { email })
        return user
    } catch (err) {
        console.error(err)
    }
}

async function updateUser(updatedUser: User): Promise<User | undefined> {
    try {
        const user = await httpService.put<User>("user", updatedUser)

        return user
    } catch (err) {
        console.log(err)
    }
}

async function signup(userCred: {
    email: string
    password: string
    fullName: string
}): Promise<User> {
    try {
        const user = await httpService.post<User>("auth/signup", userCred)
        return user
    } catch (err) {
        console.log(err)
        throw err
    }
}

async function logout() {
    await httpService.post("auth/logout")
    setSessionStorage("userId", null)
}
