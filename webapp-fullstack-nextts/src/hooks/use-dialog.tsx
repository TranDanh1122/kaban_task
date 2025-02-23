'use client'
import { DialogContext } from "@/context/DialogContext"
import React from "react"
export const useDialog = () => {
    const { state, dispatch } = React.useContext(DialogContext)
    if (!state) throw new Error("Use dialog outside of context provider")
    const isOpen = (name: string) => {
        return state.find(el => el.name == name)?.status === true
    }
    return {
        state,
        dispatch,
        isOpen
    }
} 