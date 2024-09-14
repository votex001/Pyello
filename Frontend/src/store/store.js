import { createStore, combineReducers } from "redux"
import { userReducer } from "./reducers/user.reducer"

import { boardReducer } from "./reducers/board.reducer"
import { workspaceReducer } from "./reducers/workspace.reducer"

const rootReducer = combineReducers({
    userModule: userReducer,
    boardModule: boardReducer,
    workspaceModule: workspaceReducer,
})

const middleware = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()
    : undefined
export const store = createStore(rootReducer, middleware)

// For debug:
// store.subscribe(() => {
//     console.log('**** Store state changed: ****')
//     console.log('storeState:\n', store.getState())
//     console.log('*******************************')
// })
