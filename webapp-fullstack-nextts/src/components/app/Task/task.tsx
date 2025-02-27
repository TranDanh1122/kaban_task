'use client'
import React from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useDialog } from "@/hooks/use-dialog"
import { useAppCoordinator } from "@/hooks/useCoordinator"

const Task = React.memo(({ task }: { task: Task }): React.JSX.Element => {
    const subtasks = React.useMemo(() => {
        return task.subtasks?.length || 0
    }, [task.subtasks])
    const finishedSubTask = React.useMemo(() => {
        return task.subtasks?.filter(el => el.status).length || 0
    }, [task.subtasks])
    const { dispatch } = useDialog()
    const { dispatch: coordinatorAction, setViewingTask } = useAppCoordinator()
    const handleViewTask = React.useCallback(() => {
        dispatch({ type: "TOOGLE", payload: { name: "TaskView", state: true } })
        coordinatorAction(setViewingTask(task))
    }, [task])
    return <Card onClick={handleViewTask} className="cursor-grab shadow-md">
        <CardHeader>
            <CardTitle className="heading-m hover:text-primary-300">{task.title}</CardTitle>
            <CardDescription className="text-[12px] font-bold text-secondary-100"> {finishedSubTask} of {subtasks} substasks</CardDescription>
        </CardHeader>
    </Card>
})
Task.displayName = "Task"
export default Task
export const TaskSkeleton = () => {
    return <Card className="cursor-pointer shadow-md">
        <CardHeader>
            <CardTitle className="heading-m hover:text-primary-300"><Skeleton className="w-[100px] h-[20px] rounded-full" /></CardTitle>
            <CardDescription className="text-[12px] font-bold text-secondary-100"><Skeleton className="w-[200px] h-[20px] rounded-full" /></CardDescription>
        </CardHeader>
    </Card>
}