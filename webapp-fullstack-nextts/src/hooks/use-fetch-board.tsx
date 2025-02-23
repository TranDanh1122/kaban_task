'use client'
import { AxiosClient } from '@/lib/axios-client'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { toast } from 'sonner'
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