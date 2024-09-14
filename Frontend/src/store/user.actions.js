import { userService } from "../services/user.service.js"
import { socketService } from "../services/socket.service.js"
import { store } from "../store/store.js"

import { EDIT_USERS, SET_USERS, SET_USER, EDIT_USER } from "./user.reducer"
import { httpService } from "../services/http.service.js"

export async function loadWorkspaceUsers(userIds) {
    try {
        const users = await userService.getWorkspaceUsers({
            userIds: [...userIds],
        })

        store.dispatch({ type: SET_USERS, users })
        return users
    } catch (err) {
        console.log("UserActions: err in loadUsers", err)
        return false
    }
}

export async function editUser(user) {
    try {
        store.dispatch({ type: EDIT_USER, user })
        store.dispatch({ type: EDIT_USERS, user })
        await userService.updateUser(user)
    } catch (err) {
        console.log("UserActions: err in editUser", err)
    }
}
export async function login(credentials) {
    var user
    try {
        if (credentials) {
            user = await httpService.post("auth/login", credentials)
        } else {
            user = await httpService.post("user/checkToken")
        }

        store.dispatch({ type: SET_USER, user })
        return user
    } catch (err) {
        console.log("UserActions: err in login", err)
        throw err
    }
}

export async function signup(credentials) {
    try {
        const user = await userService.signup(credentials)
        store.dispatch({ type: SET_USER, user })
        return user
    } catch (err) {
        console.log("UserActions: err in login", err)
    }
}
