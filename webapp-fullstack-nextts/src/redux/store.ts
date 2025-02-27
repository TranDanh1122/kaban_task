import { combineReducers, configureStore } from "@reduxjs/toolkit";
//@ts-expect-error this librabry @type not working at all
import storage from 'redux-persist/lib/storage'
import { boardAPISlice } from "./actions/boardAPI";
//@ts-expect-error this librabry @type not working at all
import persistReducer from "redux-persist/es/persistReducer";
//@ts-expect-error this librabry @type not working at all
import persistStore from "redux-persist/es/persistStore";
import coordinatorReducer from "./slicers/appCordinatorSlicer"
import { taskApiSlicer } from "./actions/taskAPI";

const config = {
    key: "kanban-task-client-data",
    storage,
    whitelist: ['coordinator']
}
const reducer = combineReducers({
    coordinator: coordinatorReducer,
    [boardAPISlice.reducerPath]: boardAPISlice.reducer,
    [taskApiSlicer.reducerPath]: taskApiSlicer.reducer,
})
const localReducer = persistReducer(config, reducer)
export const store = configureStore({
    reducer: localReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
        .concat(boardAPISlice.middleware)
        .concat(taskApiSlicer.middleware)
})

export const persiststore = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDisPatch = typeof store.dispatch
