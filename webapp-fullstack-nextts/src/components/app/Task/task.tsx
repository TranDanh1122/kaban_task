'use client'
import React from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const Task = React.memo(({ task }: { task: Task }): React.JSX.Element => {
    return <Card className="cursor-pointer shadow-md">
        <CardHeader>
            <CardTitle className="heading-m hover:text-primary-300">{task.title}</CardTitle>
            <CardDescription className="text-[12px] font-bold text-secondary-100">0 of 2 substasks</CardDescription>
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