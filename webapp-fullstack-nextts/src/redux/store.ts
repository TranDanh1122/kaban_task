import { combineReducers, configureStore } from "@reduxjs/toolkit";
//@ts-expect-error this librabry @type not working at all
import storage from 'redux-persist/lib/storage'
import { boardAPISlice } from "./slicers/boardSlicer";
//@ts-expect-error this librabry @type not working at all
import persistReducer from "redux-persist/es/persistReducer";
//@ts-expect-error this librabry @type not working at all
import persistStore from "redux-persist/es/persistStore";

const config = {
    key: "kanban-task-client-data",
    storage
}
const miniReducers = combineReducers({
    board: boardAPISlice.reducer
})
const localReducer = persistReducer(config, miniReducers)
export const store = configureStore({
    reducer: localReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
})
export const persiststore = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export type AppDisPatch = typeof store.dispatch