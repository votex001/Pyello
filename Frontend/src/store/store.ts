import {
    legacy_createStore as createStore,
    combineReducers,
    Reducer,
} from "redux"
import { userReducer } from "./reducers/user.reducer"
import { boardReducer } from "./reducers/board.reducer"
import { workspaceReducer } from "./reducers/workspace.reducer"
import { UserAction, UserSate } from "./interface/user.store"
import { BoardAction, BoardState } from "./interface/board.store"
import { WorkspaceAction, WorkspaceState } from "./interface/workspace.store"

const middleware = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()
    : undefined

export interface RootState {
    userModule: UserSate
    boardModule: BoardState
    workspaceModule: WorkspaceState
}
type RootAction = UserAction | BoardAction | WorkspaceAction
type RootReducer = Reducer<RootState, RootAction>

const rootReducer = combineReducers({
    userModule: userReducer,
    boardModule: boardReducer,
    workspaceModule: workspaceReducer,
}) as RootReducer

export const store = createStore(rootReducer, middleware)

// For debug:
// store.subscribe(() => {
//     console.log('**** Store state changed: ****')
//     console.log('storeState:\n', store.getState())
//     console.log('*******************************')
// })
