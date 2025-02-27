import { axiosBaseQuery } from "@/lib/axios-client";
import { createApi } from "@reduxjs/toolkit/query/react";
export const taskApiSlicer = createApi({
    reducerPath: "taskAPI",
    baseQuery: axiosBaseQuery(),
    refetchOnFocus: false,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: false,
    endpoints: (builder) => ({
        createTask: builder.mutation({
            query: (data) => ({
                url: `task`,
                method: "POST",
                data: data
            }),
        }),
        deleteTask: builder.mutation({
            query: (id) => ({
                url: `task/${id}`,
                method: "DELETE",
            }),
        }),
        updateTask: builder.mutation({
            query: ({ data, id }) => ({
                url: `task/${id}`,
                method: "PUT",
                data: data
            })
        }),
        patchTask: builder.mutation({
            query: ({ data, id }) => ({
                url: `task/${id}`,
                method: "PATCH",
                data: data
            })
        })
    })
})
export const {
    useCreateTaskMutation,
    useDeleteTaskMutation,
    useUpdateTaskMutation,
    usePatchTaskMutation
} = taskApiSlicer