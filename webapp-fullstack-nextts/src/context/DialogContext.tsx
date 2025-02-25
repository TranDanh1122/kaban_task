'use client'
import React from "react"
export type action = { type: "TOOGLE", payload: { name: string, state: boolean } } | { type: "SETDATA", payload: { name: string, data: any } }

interface Dialog {
    name: string,
    status: boolean,
    data?: any
}
const initData: Dialog[] = [
    { name: "BoardForm", status: false, data: {} },
    { name: "TaskForm", status: false, data: {} },
    { name: "TaskView", status: false, data: {} },
    { name: "ConfirmDialog", status: false, data: {} }
]
const reducer = (state: Dialog[], action: action) => {
    switch (action.type) {
        case "TOOGLE": {
            return state.map(el => {
                if (el.name == action.payload.name) return { ...el, status: action.payload.state }
                return el
            })
        }
        case "SETDATA": {
            return state.map(el => {
                if (el.name == action.payload.name) return { ...el, data: { ...el.data, ...action.payload.data } }
                return el
            })
        }
        default: return state
    }
}
export const DialogContext = React.createContext<{ state: Dialog[], dispatch: React.Dispatch<action> }>({ state: initData, dispatch: () => { } })
export default function DialogContextProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
    const [state, dispatch] = React.useReducer(reducer, initData)
    return <DialogContext.Provider value={{ state, dispatch }}>{children}</ DialogContext.Provider>
}