import { userService } from "../../services/user.service.js"
import { store } from "../store.js"

import { httpService } from "../../services/http.service.js"
import { UserActionsTypes } from "../interface/user.store.js"
import { User } from "../../models/user.model.js"

export async function loadWorkspaceUsers(userIds: string[]) {
    try {
        const users = await userService.getWorkspaceUsers({
            userIds: [...userIds],
        })

        store.dispatch({ type: UserActionsTypes.SET_USERS, users })
        return users
    } catch (err) {
        console.log("UserActions: err in loadUsers", err)
        return false
    }
}

export async function editUser(user: User) {
    try {
        await userService.updateUser(user)
        store.dispatch({ type: UserActionsTypes.EDIT_USERS, user })
        store.dispatch({ type: UserActionsTypes.EDIT_USER, user })
    } catch (err) {
        console.log("UserActions: err in editUser", err)
    }
}
export async function login(credentials?: {
    password: string
    email: string
}): Promise<User> {
    var user
    try {
        if (credentials) {
            user = await httpService.post<User>("auth/login", credentials)
        } else {
            user = await httpService.post<User>("user/checkToken")
        }

        store.dispatch({ type: UserActionsTypes.SET_USER, user })
        return user
    } catch (err) {
        console.log("UserActions: err in login", err)
        throw err
    }
}

export async function signup(credentials: {
    password: string
    email: string
    fullName: string
}): Promise<User> {
    try {
        const user = await userService.signup(credentials)
        store.dispatch({ type: UserActionsTypes.SET_USER, user })
        return user
    } catch (err) {
        console.log("UserActions: err in login", err)
        throw err
    }
}
