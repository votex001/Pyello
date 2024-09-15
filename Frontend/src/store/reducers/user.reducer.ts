import { UserAction, UserActionsTypes, UserSate } from "../interface/user.store"

const initialState: UserSate = {
    user: null,
    users: null,
}

export function userReducer(state = initialState, action = {} as UserAction) {
    var newState = state
    switch (action.type) {
        case UserActionsTypes.SET_USERS:
            newState = { ...state, users: action.users }
            break

        case UserActionsTypes.EDIT_USERS:
            if (state.users) {
                newState = {
                    ...state,
                    users: state.users.map((u) =>
                        u.id === action.user.id ? action.user : u
                    ),
                }
            } 
            break

        case UserActionsTypes.EDIT_USER:
            newState = { ...state, user: { ...state.user, ...action.user } }
            break

        case UserActionsTypes.SET_USER:
            newState = { ...state, user: action.user }
            break
        default:
    }
    return newState
}
