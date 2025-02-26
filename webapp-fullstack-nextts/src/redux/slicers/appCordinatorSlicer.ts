import { ActionReducerMapBuilder, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { boardAPISlice } from "../actions/boardAPI";

interface CoordinatorState {
    viewingBoardId?: string
    viewingBoard?: Board,
    viewingTask?: Task,
    boards: Board[],
    loading: boolean,
    errorMessage?: string,
    successMessage?: string,
    isArchive: boolean
}
export type { CoordinatorState }

const handleExtraReducer = <T>(builder: ActionReducerMapBuilder<CoordinatorState>, endpoint: any, callback: (state: CoordinatorState, action: PayloadAction<T>) => void) => {
    builder.addMatcher(endpoint.matchPending, (state: CoordinatorState) => {
        state.loading = true
        state.errorMessage = ""
        state.successMessage = ""
    }).addMatcher(endpoint.matchFulfilled, (state: CoordinatorState, action: PayloadAction<T>) => {
        state.loading = false
        state.errorMessage = ""
        callback(state, action)
    }).addMatcher(endpoint.matchRejected, (state: CoordinatorState, action: PayloadAction<any>) => {
        state.errorMessage = action.payload.error
        state.successMessage = ""
    })
}
const appCordinatorSlicer = createSlice({
    name: "coordinator",
    initialState: {
        loading: false,
        boards: [],
        isArchive: false
    } as CoordinatorState,
    reducers: {
        setViewingBoard: (state: CoordinatorState, action: PayloadAction<string | undefined>) => {
            state.viewingBoardId = action.payload
        },
        setViewingTask: (state: CoordinatorState, action: PayloadAction<Task>) => {
            state.viewingTask = action.payload
        },
        setBoards: (state: CoordinatorState, action: PayloadAction<Board[]>) => {
            state.boards = action.payload
        },
        setArchive: (state: CoordinatorState, action: PayloadAction<boolean>) => {
            state.isArchive = action.payload
        },
        resetMessage: (state: CoordinatorState) => {
            state.successMessage = ''
            state.errorMessage = ''
        }
    },
    extraReducers: (builder) => {
        handleExtraReducer<Board[]>(builder, boardAPISlice.endpoints.getBoards, (state: CoordinatorState, action: PayloadAction<Board[]>) => {
            state.boards = action.payload
            state.successMessage = "Fetching Plan Successfully"
        })
        handleExtraReducer<Board>(builder, boardAPISlice.endpoints.createBoard, (state: CoordinatorState, action: PayloadAction<Board>) => {
            state.boards.push(action.payload)
            state.successMessage = "Create Plan Successfully"
        })
        handleExtraReducer<Board>(builder, boardAPISlice.endpoints.updateBoard, (state: CoordinatorState, action: PayloadAction<Board>) => {
            state.boards = state.boards.map(el => {
                if (el.id == action.payload.id) return action.payload
                return el
            })
            state.successMessage = "Update Plan Successfully"
        })
        handleExtraReducer<Board>(builder, boardAPISlice.endpoints.deleteBoard, (state: CoordinatorState, action: PayloadAction<Board>) => {
            state.boards = state.boards.filter(el => el.id != action.payload.id)
            state.successMessage = "Delete Plan Successfully"
        })
        handleExtraReducer<Board>(builder, boardAPISlice.endpoints.getBoardById, (state: CoordinatorState, action: PayloadAction<Board>) => {
            state.viewingBoard = action.payload
            state.successMessage = "Fetch Plan Successfully"
        })
        builder.addMatcher((action) => action.type === "coordinator/setViewingBoard", (state: CoordinatorState) => {
            state.viewingBoard = state.boards.find(el => el.id === state.viewingBoardId)
        })
    },
})
export const { setViewingBoard, setViewingTask, setBoards, setArchive, resetMessage } = appCordinatorSlicer.actions
export default appCordinatorSlicer.reducer