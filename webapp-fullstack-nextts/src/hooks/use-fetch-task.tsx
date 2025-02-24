'use client'

import { AxiosClient } from "@/lib/axios-client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useDialog } from "./use-dialog"


export const useCreateOrUpdateTask = () => {
    const queryClient = useQueryClient()
    const { dispatch } = useDialog();

    return useMutation({
        mutationFn: async (data: any) => {
            const res = await AxiosClient.post(`${process.env.NEXT_PUBLIC_API_URL}`, data)
            if (res.status != 200) throw new Error(res.data.message || "Create Or Update Task Error")
            return res.data
        },
        onError: (error: any) => {
            toast.error(error.response.data.message || "Error creating board", {
                style: { color: "red" }
            });
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['boards'] })
            toast.success(data.message || "Task create success", {
                style: { color: "green" }
            })
            dispatch({ type: "TOOGLE", payload: { name: "TaskForm", state: false } });
        }
    })
}