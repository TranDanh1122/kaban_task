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
				{ type: 'Boards', id: isArchive?.toString() },
			],
			keepUnusedDataFor: 300
		}),
		getBoardById: builder.query({
			query: (id: string) => ({ url: `board/${id}`, method: 'get' }),
			providesTags: (result, error, id) => [
				{ type: 'Board', id: id },
			],
			keepUnusedDataFor: 300
		}),
		createBoard: builder.mutation({
			query: (data) => ({
				url: 'board',
				method: "POST",
				data: data
			}),
			invalidatesTags: (result) => result ? [{ type: 'Boards' }] : []
		}),
		updateBoard: builder.mutation({
			query: (data) => ({
				url: `board/${data.id}`,
				method: "PUT",
				data: data
			}),
			invalidatesTags: (result) => result ? [{ type: 'Boards' }] : []
		}),
		deleteBoard: builder.mutation({
			query: (data) => ({
				url: `board/${data.id}`,
				method: 'DELETE',
			}),
			invalidatesTags: (result) => result ? [{ type: 'Boards' }] : []
		})
	})
})
export const {
	useGetBoardsQuery,
	useCreateBoardMutation,
	useUpdateBoardMutation,
	useDeleteBoardMutation,
	useGetBoardByIdQuery
} = boardAPISlice;
