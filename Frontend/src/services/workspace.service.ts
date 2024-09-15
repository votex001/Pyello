import { Board } from "../models/board.models"
import { httpService } from "./http.service"

export const workspaceService = {
    getAllBoards,
}

async function getAllBoards(): Promise<Board[]> {
    try {
        const boards = httpService.get<Board[]>("boards")
        return boards
    } catch (err) {
        console.log(err)
        throw err
    }
}
