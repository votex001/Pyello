import { User } from "../../models/user.model"

export interface UserSate {
    user: null | User
    users: null | User[]
}

export enum UserActionsTypes {
    SET_USERS = "SET_USERS",
    EDIT_USERS = "EDIT_USERS",
    SET_USER = "SET_USER",
    EDIT_USER = "EDIT_USER",
}

interface SetUsersAction {
    type: UserActionsTypes.SET_USERS
    users: User[]
}

interface EditUsersAction {
    type: UserActionsTypes.EDIT_USERS
    user: User
}

interface SetUserAction {
    type: UserActionsTypes.SET_USER
    user: User
}

interface EditUserAction {
    type: UserActionsTypes.EDIT_USER
    user: User
}


export type UserAction =
    | SetUsersAction
    | EditUsersAction
    | SetUserAction
    | EditUserAction
