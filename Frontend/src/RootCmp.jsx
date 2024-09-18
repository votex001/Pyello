import React from "react"
import { Routes, Route } from "react-router"
import { BoardIndex } from "./pages/BoardIndex.jsx"
import { WorkspaceIndex } from "./pages/WorkspaceIndex.jsx"
import { UserProfile } from "./pages/UserProfile"
import { ErrorPage } from "./pages/ErrorPage"
import { UserBoards } from "./pages/UserBoards"
import { UserSettings } from "./cmps/UserProf/UserSettings"
import { UserMsg } from "./cmps/UserMsg"
import { HomePage } from "./pages/HomePage"
import { AuthPage } from "./pages/AuthPage"
export function RootCmp() {
    return (
        <div>
            <main>
                <Routes>
                    <Route path="/login" element={<AuthPage isLogin />} />
                    <Route path="/signup" element={<AuthPage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="" element={<WorkspaceIndex />}>
                        <Route path="*" element={<ErrorPage />} />
                        <Route path="b/:boardId" element={<BoardIndex />}>
                            <Route path=":link" element={<BoardIndex />} />
                        </Route>
                        <Route path="c/:cardId" element={<BoardIndex />} />
                        <Route
                            path="u/:userName/boards"
                            element={<UserBoards />}
                        />
                        <Route path="u/:userName" element={<UserProfile />}>
                            <Route path="boards" element={<UserBoards />} />
                            <Route path="" element={<UserSettings />} />
                            <Route path=":all" element={<UserProfile />} />
                        </Route>
                    </Route>
                </Routes>
                <UserMsg />
            </main>
        </div>
    )
}
