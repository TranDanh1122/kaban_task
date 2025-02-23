'use client'

import { AxiosClient } from "@/lib/axios-client"
import { useQuery } from "@tanstack/react-query"

export default function useFetchStatus(boardSlug: string) {
    const { data: columns, isLoading, error } = useQuery({
        queryKey: ["status", boardSlug],
        queryFn: async () => {
            const res = await AxiosClient.get(`${process.env.NEXT_PUBLIC_API_URL}/status`)
            if (res.status != 200) throw new Error("Fail to load")
            return res.data
        },
        staleTime: 10 * 60 * 1000
    })
    return { columns, isLoading, error }
}