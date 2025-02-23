'use client'
import { AxiosClient } from '@/lib/axios-client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { toast } from 'sonner'
import { useDialog } from './use-dialog'
export default function useFetchBoard() {
    const { data: boards, isLoading, error, isError } = useQuery({
        queryKey: ['boards'],
        queryFn: async () => {
            const res = await AxiosClient.get(`${process.env.NEXT_PUBLIC_API_URL}/board`)
            if (res.status !== 200) throw new Error("Fail to load")
            return res.data
        },
        staleTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false

    })
    React.useEffect(() => {
        if (!isError) return
        toast.error(`Error when loading your plan`, { style: { color: "red" } })
    }, [isError])
    return { boards, isLoading, error, isError }
}
export const useGetBoardBySlug = (boardSlug: string) => {
    const { data: board, isLoading, error, isError } = useQuery({
        queryKey: ['board', boardSlug],
        queryFn: async () => {
            const res = await AxiosClient.get(`${process.env.NEXT_PUBLIC_API_URL}/board/${boardSlug}`)
            if (res.status !== 200) throw new Error("Fail to load plan")
            return res.data
        },
        staleTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false
    })
    React.useEffect(() => {
        if (!isError) return
        toast.error(`Error when loading your plan`, { style: { color: "red" } })
    }, [isError])
    return { board, isLoading, error, isError }
}
export const useCreateBoard = () => {
    const queryClient = useQueryClient()
    const { dispatch } = useDialog();
    return useMutation({
        mutationFn: async (data: any) => {
            const res = await AxiosClient.post(`${process.env.NEXT_PUBLIC_API_URL}/board`, data)
            if (res.status !== 200) {
                throw new Error(res.data.response?.message || "Something went wrong");
            }
            return res.data
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['boards'] })
            toast.success(data.message || "Board create success", {
                style: { color: "green" }
            })
            dispatch({ type: "TOOGLE", payload: { name: "BoardForm", state: false } });
        },
        onError: (error: any) => {
            toast.error(error.response.data.message || "Error creating board", {
                style: { color: "red" }
            });
        },
    })
}
export const useDeleteBoard = () => {
    const queryClient = useQueryClient()
    const { dispatch } = useDialog();
    return useMutation({
        mutationFn: async (data: any) => {
            const res = await AxiosClient.delete(`${process.env.NEXT_PUBLIC_API_URL}/board`)
            if (res.status !== 200) {
                throw new Error(res.data.response?.message || "Something went wrong");
            }
            return res.data
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['boards'] })
            toast.success(data.message || "Board delete successfully", {
                style: { color: "green" }
            })
            dispatch({ type: "TOOGLE", payload: { name: "ConfirmDialog", state: false } });
        },
        onError: (error: any) => {
            toast.error(error.response.data.message || "Error creating board", {
                style: { color: "red" }
            });
        },
    })
}