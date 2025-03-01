import { axiosBaseQuery } from '@/lib/axios-client';
import { createApi } from '@reduxjs/toolkit/query/react';
export const boardAPISlice = createApi({
	reducerPath: 'boardApi',
	baseQuery: axiosBaseQuery(),
	tagTypes: ['Boards', 'Board'],
	refetchOnFocus: false,
	refetchOnReconnect: true,
	refetchOnMountOrArgChange: false,
	endpoints: (builder) => ({
		getBoards: builder.query({
			query: (isArchive: boolean) => ({
				url: `board?isArchive=${(isArchive)}`, method: 'get'
			}),
			providesTags: (result, error, isArchive) => [
				{ type: 'Boards', id: isArchive ? 1 : 0 },
			],

		}),
		getBoardById: builder.query({
			query: (id: string) => ({ url: `board/${id}`, method: 'get' }),
			providesTags: (result, error, id) => [
				{ type: 'Board', id: id },
			],
		}),
		createBoard: builder.mutation({
			query: (data) => ({
				url: 'board',
				method: "POST",
				data: data
			}),
			invalidatesTags: [{ type: 'Boards' }]
		}),
		updateBoard: builder.mutation({
			query: (data) => ({
				url: `board/${data.id}`,
				method: "PUT",
				data: data
			}),
			invalidatesTags: [{ type: 'Boards' }]
		}),
		deleteBoard: builder.mutation({
			query: (data) => ({
				url: `board/${data.id}`,
				method: 'DELETE',
			}),
			invalidatesTags: [{ type: 'Boards' }]
		}),
		archiveBoard: builder.mutation({
			query: (data) => ({
				url: `board/${data.id}`,
				method: 'PATCH',
				data: data
			}),
			invalidatesTags: [{ type: 'Boards' }]
		}),
	})
})
export const {
	useGetBoardsQuery,
	useCreateBoardMutation,
	useUpdateBoardMutation,
	useDeleteBoardMutation,
	useGetBoardByIdQuery,
	useArchiveBoardMutation
} = boardAPISlice;
