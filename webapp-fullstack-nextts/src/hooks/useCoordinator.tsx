'use client'

import { boardAPISlice } from "@/redux/actions/boardAPI"
import { CoordinatorState, resetMessage, setArchive, setViewingBoard, setViewingTask } from "@/redux/slicers/appCordinatorSlicer"
import { AppDisPatch, RootState } from "@/redux/store"
import { useDispatch, useSelector, shallowEqual } from "react-redux"

export const useAppCoordinator = () => {
    const { boards,
        loading,
        errorMessage,
        successMessage,
        viewingBoard,
        viewingTask,
        isArchive, viewingBoardId } = useSelector((state: RootState) => state.coordinator as CoordinatorState , shallowEqual)
    const dispatch: AppDisPatch = useDispatch()
    const fetchBoard = async (isArchive: boolean) => {
        await dispatch(boardAPISlice.endpoints.getBoards.initiate(isArchive));
    }

    return {
        boards,
        loading,
        errorMessage,
        successMessage,
        viewingBoard,
        viewingTask,
        isArchive,
        fetchBoard,
        dispatch,
        setArchive,
        setViewingBoard,
        setViewingTask,
        viewingBoardId,
        resetMessage
    }
}