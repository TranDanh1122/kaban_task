import { createApi, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
export const boardAPISlice = createApi({
	reducerPath: 'boardApi',
	baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),
	tagTypes: ['Boards'],
	endpoints: (builder) => ({
		getBoards: builder.query({
			query: (isArchive: boolean) => `board?isArchive=${isArchive}`,
			providesTags: (result, error: FetchBaseQueryError | undefined, isArchive) => [
				{ type: 'Boards', id: isArchive as unknown as string },
			],
		}),
		getBoardBySlug: builder.query({
			query: (slug) => `board${slug}`
		}),
		createBoard: builder.mutation({
			query: (data) => ({
				url: 'board',
				method: "POST",
				body: data
			})
		}),
		updateBoard: builder.mutation({
			query: (data) => ({
				url: `board/${data.slug}`,
				method: "PUT",
				body: data
			})
		}),
		deleteBoard: builder.mutation({
			query: (data) => ({
				url: `board/${data.slug}`,
				method: 'DELETE',
			}),
		})

	})

})
export const {
	useGetBoardsQuery,
	useGetBoardBySlugQuery,
	useCreateBoardMutation,
	useUpdateBoardMutation,
	useDeleteBoardMutation,
} = boardAPISlice;