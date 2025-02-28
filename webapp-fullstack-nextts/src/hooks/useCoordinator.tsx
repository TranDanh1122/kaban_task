'use client'
import { CoordinatorState, reOrder, resetMessage, setArchive, setViewingBoard, setViewingTask } from "@/redux/slicers/appCordinatorSlicer"
import { AppDisPatch, RootState } from "@/redux/store"
import { useDispatch, useSelector, shallowEqual } from "react-redux"

export const useAppCoordinator = () => {
    const { boards,
        loading,
        errorMessage,
        successMessage,
        viewingBoard,
        viewingTask,
        isArchive, viewingBoardId } = useSelector((state: RootState) => state.coordinator as CoordinatorState, shallowEqual)
    const dispatch: AppDisPatch = useDispatch()

    return {
        boards,
        loading,
        errorMessage,
        successMessage,
        viewingBoard,
        viewingTask,
        isArchive,
        dispatch,
        setArchive,
        setViewingBoard,
        setViewingTask,
        viewingBoardId,
        resetMessage,
        reOrder
    }
}