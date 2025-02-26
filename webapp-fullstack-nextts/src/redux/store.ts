import { configureStore } from "@reduxjs/toolkit";
//@ts-expect-error this librabry @type not working at all
import storage from 'redux-persist/lib/storage'
import { boardAPISlice } from "./actions/boardAPI";
//@ts-expect-error this librabry @type not working at all
import persistReducer from "redux-persist/es/persistReducer";
//@ts-expect-error this librabry @type not working at all
import persistStore from "redux-persist/es/persistStore";
import coordinatorReducer from "./slicers/appCordinatorSlicer"
const config = {
    key: "kanban-task-client-data",
    storage
}

const localReducer = persistReducer(config, coordinatorReducer)
export const store = configureStore({
    reducer: {
        coordinator: localReducer,
        [boardAPISlice.reducerPath]: boardAPISlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat(boardAPISlice.middleware)
})
export const persiststore = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export type AppDisPatch = typeof store.dispatch