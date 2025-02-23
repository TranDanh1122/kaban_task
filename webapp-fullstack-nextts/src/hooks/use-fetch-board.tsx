'use client'
import { AxiosClient } from '@/lib/axios-client'
import { useQuery } from '@tanstack/react-query'
export default  function useFetchBoard() {
    const { data: boards, isLoading, error } = useQuery({
        queryKey: ['boards'],
        queryFn: async () => {
            const res = await AxiosClient.get(`${process.env.NEXT_PUBLIC_API_URL}/board`)
            if (res.status !== 200) throw new Error("Fail to load")
            return res.data
        },
        staleTime: 10 * 60 * 1000
    })
    return { boards, isLoading, error }
}