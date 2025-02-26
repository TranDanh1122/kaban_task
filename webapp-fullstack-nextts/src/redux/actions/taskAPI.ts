import { axiosBaseQuery } from "@/lib/axios-client";
import { createApi } from "@reduxjs/toolkit/query/react";
import { store } from "../store";
import { CoordinatorState } from "../slicers/appCordinatorSlicer";
const state = store.getState().coordinator as CoordinatorState
export const taskApiSlicer = createApi({
    reducerPath: "taskAPI",
    baseQuery: axiosBaseQuery(),
    refetchOnFocus: false,
    refetchOnReconnect: true,
    tagTypes: ['Board'],
    endpoints: (builder) => ({
        createOrUpdate: builder.mutation({
            query: (data) => ({
                url: `task`,
                method: "POST",
                data: data
            }),
            invalidatesTags: [{ type: 'Board', id: state.viewingBoardId }],
        }),
        deleteTask: builder.mutation({
            query: (data) => ({
                url: `task`,
                method: "POST",
                data: data
            }),
            invalidatesTags: [{ type: 'Board', id: state.viewingBoardId }],
        })
    })
})