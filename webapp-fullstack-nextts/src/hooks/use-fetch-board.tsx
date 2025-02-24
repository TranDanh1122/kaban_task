'use client'
import { AxiosClient } from '@/lib/axios-client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { toast } from 'sonner'
import { useDialog } from './use-dialog'
import { useRouter, useSearchParams } from 'next/navigation'
export default function useFetchBoard() {
    const searchParams = useSearchParams();
    const isArchive = searchParams.get("isArchive") === "true" ;
    const { data: boards, isLoading, error, isError } = useQuery({
        queryKey: ['boards', isArchive],
        queryFn: async () => {
            const res = await AxiosClient.get(`${process.env.NEXT_PUBLIC_API_URL}/board?isArchive=${isArchive}`)
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
export const useGetBoardBySlug = (slug: string) => {
    const { data: board, isLoading, error, isError } = useQuery({
        queryKey: ['board', slug],
        queryFn: async () => {
            const res = await AxiosClient.get(`${process.env.NEXT_PUBLIC_API_URL}/board/${slug}`)
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
export const useCreateOrUpdateBoard = () => {
    const queryClient = useQueryClient()
    const { dispatch } = useDialog();
    const router = useRouter();

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
            router.replace(`/board/${data.data.slug}`, undefined)
        },
        onError: (error: any) => {
            toast.error(error.response.data.message || "Error creating board", {
                style: { color: "red" }
            });
        },
    })
}
export const useUpdateBoard = () => {
    const queryClient = useQueryClient()
    const { dispatch } = useDialog()
    return useMutation({
        mutationFn: async (data: any) => {
            const res = await AxiosClient.put(`${process.env.NEXT_PUBLIC_API_URL}/board/${data.slug}`, data)
            if (res.status !== 200) {
                throw new Error(res.data.response?.message || "Something went wrong");
            }
            return res.data
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['boards'] })
            toast.success(data.message || "Plan update successfully", {
                style: { color: "green" }
            })
            dispatch({ type: "TOOGLE", payload: { name: "ConfirmDialog", state: false } });
        },
        onError: (error: any) => {
            toast.error(error.response.data.message || "UpdateBoardError", {
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
            toast.success(data.message || "Plan delete successfully", {
                style: { color: "green" }
            })
            dispatch({ type: "TOOGLE", payload: { name: "ConfirmDialog", state: false } });
        },
        onError: (error: any) => {
            toast.error(error.response.data.message || "Delete plan error", {
                style: { color: "red" }
            });
        },
    })
}