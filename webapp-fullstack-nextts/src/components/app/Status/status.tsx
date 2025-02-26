'use client'
import React from "react"
import { v4 } from 'uuid'
import Task, { TaskSkeleton } from "../Task/task"
import { Skeleton } from "@/components/ui/skeleton"

const Status = React.memo(({ column }: { column: Status }): React.JSX.Element => {
    return <div className="w-1/4 min-w-[25%] h-full flex-1">
        <div className="flex items-center justify-start gap-2 mb-6">
            <span className="size-5 min-w-5 rounded-full" style={{ backgroundColor: `${column.color}` }}></span>
            <span className="text-sm text-secondary-100 font-bold  line-clamp-1 text-ellipsis">{column.name}</span>
        </div>
        <div className=" space-y-5">
            {
                column.Task.map(el => <Task key={el.id} task={el} />)
            }
        </div>

    </div>
})
Status.displayName = "Status"
export default Status
export const StatusSkeleton = () => {
    return <div className="w-1/4 h-full">
        <div className="flex items-center justify-start gap-2 mb-6 ">
            <span className="size-5 rounded-full bg-secondary-100"></span>
            <span className="text-sm text-secondary-100 font-bold"><Skeleton className="w-[50px] h-[12px] rounded-full" /></span>
        </div>
        <div className=" space-y-5">
            {
                Array.from({ length: 4 }).map(el => <TaskSkeleton key={v4()} />)
            }
        </div>

    </div>
}