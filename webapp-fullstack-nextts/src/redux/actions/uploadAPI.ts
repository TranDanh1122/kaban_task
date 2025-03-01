import { axiosBaseQuery } from "@/lib/axios-client";
import { createApi } from "@reduxjs/toolkit/query/react";
export const uploadApi = createApi({
    reducerPath: "uploadApi",
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        upload: builder.mutation({
            query: ({ data, id, type }) => ({
                url: `upload/${id}?type=${type}`,
                method: "POST",
                data: data,
                headers: { "Content-Type": "multipart/form-data" }
            })
        })
    })
})
export const {
    useUploadMutation
} = uploadApi