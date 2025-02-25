'use client'

import { AxiosClient } from "@/lib/axios-client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useDialog } from "./use-dialog"
import { usePathname } from "next/navigation"


export const useCreateOrUpdateTask = () => {
    const queryClient = useQueryClient()
    const { dispatch } = useDialog();
    const pathNames = usePathname()
    const slug = pathNames.split('/').pop()
    return useMutation({
        mutationFn: async (data: any) => {
            const res = await AxiosClient.post(`${process.env.NEXT_PUBLIC_API_URL}/task`, data)
            if (res.status != 200) throw new Error(res.data.message || "Create Or Update Task Error")
            return res.data
        },
        onError: (error: any) => {
            toast.error(error.response.data.message || error.response.statusText || "Error creating task", {
                style: { color: "red" }
            });
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['board', slug] })
            toast.success(data.message || "Task create success", {
                style: { color: "green" }
            })
            dispatch({ type: "TOOGLE", payload: { name: "TaskForm", state: false } });
            dispatch({ type: "TOOGLE", payload: { name: "TaskView", state: false } })
        }
    })
}
export const useDeleteTask = () => {
    const queryClient = useQueryClient()
    const { dispatch } = useDialog();
    const pathNames = usePathname()
    const slug = pathNames.split('/').pop()
    return useMutation({
        mutationFn: async (data: any) => {
            const res = await AxiosClient.delete(`${process.env.NEXT_PUBLIC_API_URL}/task/${data}`)
            if (res.status !== 200) {
                throw new Error(res.data.response?.message || "Something went wrong");
            }
            return res.data
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['board', slug] })
            toast.success(data.message || "Task delete successfully", {
                style: { color: "green" }
            })
            dispatch({ type: "TOOGLE", payload: { name: "ConfirmDialog", state: false } })
            dispatch({ type: "TOOGLE", payload: { name: "TaskView", state: false } })

        },
        onError: (error: any) => {
            toast.error(error.response.data.message || "Task plan error", {
                style: { color: "red" }
            });
        },
    })
}