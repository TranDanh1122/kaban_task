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
    }).addMatcher(endpoint.matchRejected, (state: CoordinatorState, action: PayloadAction<Error>) => {
        state.errorMessage = action.payload?.message || ""
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
            state.viewingBoard = state.boards.find(el => el.id === action.payload)
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

            const statuses = [...board.Status || []]

            const oldStatusIndex = statuses.findIndex(s => s.id === oldStatusId)

            const newStatusIndex = statuses.findIndex(s => s.id === statusId)
            if (oldStatusIndex === -1 || newStatusIndex === -1) return

            let oldTasks = [...statuses[oldStatusIndex].Task]

            let newTasks = statusId === oldStatusId ? oldTasks : [...statuses[newStatusIndex].Task]

            if (statusId === oldStatusId) {

                taskToMove.order = neworder

                if (neworder < oldorder) {
                    newTasks = newTasks.map(t =>
                        t.id !== id && t.order >= neworder && t.order < oldorder
                            ? { ...t, order: t.order + 1 }
                            : t
                    );
                } else if (neworder > oldorder) {
                    newTasks = newTasks.map(t =>
                        t.id !== id && t.order > oldorder && t.order <= neworder
                            ? { ...t, order: t.order - 1 }
                            : t
                    );
                }

                const taskIndex = newTasks.findIndex(t => t.id === id);
                newTasks[taskIndex] = taskToMove;
                newTasks.sort((a, b) => a.order - b.order);
                statuses[oldStatusIndex] = {
                    ...statuses[oldStatusIndex],
                    Task: newTasks
                };
            } else {
                oldTasks = oldTasks.filter(t => t.id !== id);
                oldTasks = oldTasks.map(t =>
                    t.order > oldorder ? { ...t, order: t.order - 1 } : t
                );
                taskToMove.order = neworder;
                newTasks = newTasks.map(t =>
                    t.order >= neworder ? { ...t, order: t.order + 1 } : t
                );
                newTasks.push(taskToMove);
                newTasks.sort((a, b) => a.order - b.order);
                statuses[oldStatusIndex] = {
                    ...statuses[oldStatusIndex],
                    Task: oldTasks
                };
                statuses[newStatusIndex] = {
                    ...statuses[newStatusIndex],
                    Task: newTasks
                };
            }
            if (state.viewingBoard) state.viewingBoard.Status = statuses
        }
    },
    extraReducers: (builder) => {
        handleExtraReducer<Board[]>(builder, boardAPISlice.endpoints.getBoards, (state: CoordinatorState, action: PayloadAction<Board[]>) => {
            state.boards = action.payload
            state.viewingBoard = action.payload.find(el => el.id == state.viewingBoardId)
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
                if (el.id == action.payload.id) return action.payload
                return el
            })
            state.viewingBoardId = action.payload.id
            state.viewingBoard = action.payload
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

        handleExtraReducer<{ task: Task, message: string }>(builder, taskApiSlicer.endpoints.createTask, (state: CoordinatorState, action: PayloadAction<{ task: Task, message: string }>) => {
            const newtask = action.payload.task
            state.boards = state.boards.map(el => ({
                ...el,
                Status: el.Status ? el.Status.map(status => {
                    if (status.id == newtask.statusId) return { ...status, Task: [...status.Task, newtask] }
                    return status
                }) : []
            }))

            const updatedBoard = {
                ...state.viewingBoard,
                Status: state.viewingBoard?.Status ? state.viewingBoard.Status.map(status => {
                    if (status.id == newtask.statusId) return { ...status, Task: [...status.Task, newtask] }
                    return status
                }) : []
            } as Board
            state.viewingBoard = updatedBoard
            state.successMessage = action.payload.message
        })
        handleExtraReducer<{ task: Task, message: string }>(builder, taskApiSlicer.endpoints.updateTask, (state: CoordinatorState, action: PayloadAction<{ task: Task, message: string }>) => {
            const updatedTask = action.payload.task;
            const taskId = state.viewingTask?.id;
            const prevStatusId = state.viewingTask?.statusId;
            const newStatusId = updatedTask.statusId;

            // Cập nhật danh sách board
            state.boards = state.boards.map((board) => {
                if (board.id !== state.viewingBoard?.id) return board; // Chỉ cập nhật board hiện tại

                return {
                    ...board,
                    Status: board.Status ? board.Status.map((status) => {
                        // Nếu task đổi status, xóa khỏi status cũ
                        if (status.id === prevStatusId && prevStatusId !== newStatusId) {
                            return {
                                ...status,
                                Task: status.Task.filter((task) => task.id !== taskId),
                            };
                        }

                        // Nếu task đổi status, thêm vào status mới
                        if (status.id === newStatusId) {
                            // Nếu task đã tồn tại trong status này, chỉ cập nhật nội dung
                            const taskExists = status.Task.some((task) => task.id === taskId);
                            return {
                                ...status,
                                Task: taskExists
                                    ? status.Task.map((task) => (task.id === taskId ? updatedTask : task))
                                    : [...status.Task, updatedTask],
                            };
                        }

                        return status;
                    }) : []
                };
            });

            // Cập nhật viewingBoard
            state.viewingBoard = {
                ...state.viewingBoard,
                Status: state.viewingBoard?.Status ? state.viewingBoard?.Status.map((status) => {
                    // Nếu task đổi status, xóa khỏi status cũ
                    if (status.id === prevStatusId && prevStatusId !== newStatusId) {
                        return {
                            ...status,
                            Task: status.Task.filter((task) => task.id !== taskId),
                        };
                    }

                    // Nếu task đổi status, thêm vào status mới
                    if (status.id === newStatusId) {
                        // Nếu task đã tồn tại trong status này, chỉ cập nhật nội dung
                        const taskExists = status.Task.some((task) => task.id === taskId);
                        return {
                            ...status,
                            Task: taskExists
                                ? status.Task.map((task) => (task.id === taskId ? updatedTask : task))
                                : [...status.Task, updatedTask],
                        };
                    }

                    return status;
                }) : []
            } as Board

            state.viewingTask = updatedTask;
            state.successMessage = action.payload.message;
        })
        handleExtraReducer<{ task: Task, message: string }>(builder, taskApiSlicer.endpoints.deleteTask, (state: CoordinatorState, action: PayloadAction<{ task: Task, message: string }>) => {
            const deletedTask = action.payload.task
            state.boards = state.boards.map(el => ({
                ...el,
                Status: el.Status ? el.Status.map(status => {
                    if (status.id == deletedTask.statusId) return { ...status, Task: status.Task.filter(el => el.id !== deletedTask.id) }
                    return status
                }) : []
            }))

            const updatedBoard = {
                ...state.viewingBoard,
                Status: state.viewingBoard?.Status ? state.viewingBoard.Status.map(status => {
                    if (status.id == deletedTask.statusId) return { ...status, Task: status.Task.filter(el => el.id !== deletedTask.id) }
                    return status
                }) : []
            } as Board
            state.viewingBoard = updatedBoard

            state.successMessage = action.payload.message
        })

    },
})
export const { setViewingBoard, setViewingTask, setBoards, setArchive, resetMessage, reOrder } = appCordinatorSlicer.actions
export default appCordinatorSlicer.reducer