import { axiosBaseQuery } from "@/lib/axios-client";
import { createApi } from "@reduxjs/toolkit/query/react";
export const taskApiSlicer = createApi({
    reducerPath: "taskAPI",
    baseQuery: axiosBaseQuery(),
    refetchOnFocus: false,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange : false,
    endpoints: (builder) => ({
        createOrUpdate: builder.mutation({
            query: (data) => ({
                url: `task`,
                method: "POST",
                data: data
            }),
        }),
        deleteTask: builder.mutation({
            query: (data) => ({
                url: `task`,
                method: "POST",
                data: data
            }),
        })
    })
})
export const {
    useCreateOrUpdateMutation,
    useDeleteTaskMutation
} = taskApiSlicer