import { ActionReducerMapBuilder, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { boardAPISlice } from "../actions/boardAPI";
import { taskApiSlicer } from "../actions/taskAPI";

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
        setViewingTask: (state: CoordinatorState, action: PayloadAction<Task | undefined>) => {
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
        },
        reOrder: (state: CoordinatorState, action: PayloadAction<{ data: { neworder: number, oldorder: number, statusId: string }, id: string }>) => {
            const { data: { neworder, oldorder, statusId }, id } = action.payload

            const board = state.boards.find(el => el.Status?.some(status => status.id == statusId))
            if (!board) return

            let oldStatusId: string | null = null
            let taskToMove: Task = {} as Task

            board.Status?.forEach(status => {
                const task = status.Task.find(t => t.id === id)
                if (task) {
                    oldStatusId = status.id
                    taskToMove = { ...task }
                }
            })
            if (!taskToMove || !oldStatusId) return

            let statuses = [...board.Status || []]

            const oldStatusIndex = statuses.findIndex(s => s.id === oldStatusId)

            const newStatusIndex = statuses.findIndex(s => s.id === statusId)
            if (oldStatusIndex === -1 || newStatusIndex === -1) return

            let oldTasks = [...statuses[oldStatusIndex].Task]

            let newTasks = statusId === oldStatusId ? oldTasks : [...statuses[newStatusIndex].Task]

            if (statusId === oldStatusId) {

                taskToMove.order = neworder

                if (neworder < oldorder) {
                    // Kéo lên
                    newTasks = newTasks.map(t =>
                        t.id !== id && t.order >= neworder && t.order < oldorder
                            ? { ...t, order: t.order + 1 }
                            : t
                    );
                } else if (neworder > oldorder) {
                    // Kéo xuống
                    newTasks = newTasks.map(t =>
                        t.id !== id && t.order > oldorder && t.order <= neworder
                            ? { ...t, order: t.order - 1 }
                            : t
                    );
                }

                // Cập nhật task trong mảng
                const taskIndex = newTasks.findIndex(t => t.id === id);
                newTasks[taskIndex] = taskToMove;
                newTasks.sort((a, b) => a.order - b.order);

                // Cập nhật status
                statuses[oldStatusIndex] = {
                    ...statuses[oldStatusIndex],
                    Task: newTasks
                };
            } else {
                // Trường hợp 2: Khác status
                // Xóa task khỏi status cũ
                oldTasks = oldTasks.filter(t => t.id !== id);
                oldTasks = oldTasks.map(t =>
                    t.order > oldorder ? { ...t, order: t.order - 1 } : t
                );

                // Thêm task vào status mới
                taskToMove.order = neworder;
                newTasks = newTasks.map(t =>
                    t.order >= neworder ? { ...t, order: t.order + 1 } : t
                );
                newTasks.push(taskToMove);
                newTasks.sort((a, b) => a.order - b.order);

                // Cập nhật cả hai status
                statuses[oldStatusIndex] = {
                    ...statuses[oldStatusIndex],
                    Task: oldTasks
                };
                statuses[newStatusIndex] = {
                    ...statuses[newStatusIndex],
                    Task: newTasks
                };
            }

            // Cập nhật board trong state
            board.Status = statuses
        }
    },
    extraReducers: (builder) => {
        handleExtraReducer<Board[]>(builder, boardAPISlice.endpoints.getBoards, (state: CoordinatorState, action: PayloadAction<Board[]>) => {
            state.boards = action.payload
            state.successMessage = "Fetching Plan Successfully"
        })
        handleExtraReducer<Board>(builder, boardAPISlice.endpoints.createBoard, (state: CoordinatorState, action: PayloadAction<Board>) => {
            state.boards.push(action.payload)
            state.viewingBoardId = action.payload.id
            state.viewingBoard = action.payload
            state.successMessage = "Create Plan Successfully"
        })
        handleExtraReducer<Board>(builder, boardAPISlice.endpoints.updateBoard, (state: CoordinatorState, action: PayloadAction<Board>) => {
            console.log(action.payload);

            state.boards = state.boards.map(el => {
                if (el.id == action.payload.id) {
                    state.viewingBoardId = action.payload.id
                    state.viewingBoard = action.payload
                    return action.payload
                }
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
        handleExtraReducer<{ task: Task, message: string }>(builder, taskApiSlicer.endpoints.createTask, (state: CoordinatorState, action: PayloadAction<{ task: Task, message: string }>) => {
            const newtask = action.payload.task
            state.boards = state.boards.map(el => ({
                ...el,
                Status: el.Status ? el.Status.map(status => ({
                    ...status, Task: { ...status.Task, newtask }
                })) : []
            }))
            if (state.viewingBoard) {
                state.viewingBoard = {
                    ...state.viewingBoard,
                    Status: state.viewingBoard.Status ? state.viewingBoard.Status.map(status => ({
                        ...status, Task: { ...status.Task, newtask }
                    })) : []
                }
            }
            state.successMessage = action.payload.message
        })
        handleExtraReducer<{ task: Task, message: string }>(builder, taskApiSlicer.endpoints.updateTask, (state: CoordinatorState, action: PayloadAction<{ task: Task, message: string }>) => {
            const updatedTask = action.payload.task
            state.boards = state.boards.map(el => ({
                ...el,
                Status: el.Status ? el.Status.map(status => ({
                    ...status, Task: status.Task.map(el => el.id === updatedTask.id ? updatedTask : el)
                })) : []
            }))
            if (state.viewingBoard) {
                state.viewingBoard = {
                    ...state.viewingBoard,
                    Status: state.viewingBoard.Status ? state.viewingBoard.Status.map(status => ({
                        ...status, Task: status.Task.map(el => el.id === updatedTask.id ? updatedTask : el)
                    })) : []
                }
            }
            state.successMessage = action.payload.message
        })
        handleExtraReducer<{ task: Task, message: string }>(builder, taskApiSlicer.endpoints.deleteTask, (state: CoordinatorState, action: PayloadAction<{ task: Task, message: string }>) => {
            const deletedTask = action.payload.task
            state.boards = state.boards.map(el => ({
                ...el,
                Status: el.Status ? el.Status.map(status => ({
                    ...status, Task: status.Task ? status.Task.filter(task => task.id !== deletedTask.id) : []
                })) : []
            }))
            if (state.viewingBoard) {
                state.viewingBoard = {
                    ...state.viewingBoard,
                    Status: state.viewingBoard.Status ? state.viewingBoard.Status.map(status => ({
                        ...status, Task: status.Task ? status.Task.filter(task => task.id !== deletedTask.id) : []
                    })) : []
                }
            }

            state.successMessage = action.payload.message
        })

    },
})
export const { setViewingBoard, setViewingTask, setBoards, setArchive, resetMessage, reOrder } = appCordinatorSlicer.actions
export default appCordinatorSlicer.reducer