'use client'
import React from "react"
import Layout from "@/components/app/Layout"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { v4 } from 'uuid'
import { ScrollArea } from "@/components/ui/scroll-area"
import useFetchStatus from "@/hooks/use-fetch-status"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ListTodo, PencilRuler, Sparkle } from "lucide-react"
import { Separator } from "@/components/ui/separator"
export default function BoardDetail({ params }: { params: { slug: string } }) {
    const { columns, isLoading, error } = useFetchStatus(params.slug)
    return <Layout>
        <ScrollArea className="w-full h-screen max-h-[calc(100vh-64px)] bg-primary-100/20 p-6">
            
            <Toolbox className="absolute bottom-6 right-6 size-14 p-3 rounded-full bg-primary-300 hover:bg-primary-200 text-primary-100 " />
        </ScrollArea>

    </Layout>
}
const Toolbox = React.memo(({ className }: { className: string }) => {
    return <>  <Popover>
        <PopoverTrigger asChild>
            <Sparkle className={` ${className}`} />
        </PopoverTrigger>
        <PopoverContent className="w-12 p-0">
            <ActionButton action="Add Task"> <ListTodo className=" w-full h-full" /></ActionButton>
            <Separator orientation="horizontal" className="h-px" />
            <ActionButton action="Edit Board"> <PencilRuler className="w-full h-full" /></ActionButton>
            <Separator orientation="horizontal" className="h-px" />
        </PopoverContent>
    </Popover></>
})
const ActionButton = ({ children, action }: { children: React.ReactNode, action: string }): React.JSX.Element => {
    return <><TooltipProvider>
        <Tooltip defaultOpen={false}>
            <TooltipTrigger className="w-full p-3 border-2 border-transparent hover:border-border">{children}</TooltipTrigger>
            <TooltipContent>
                <p>{action}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider></>
}
Toolbox.displayName = "Toolbox"
const Status = React.memo((): React.JSX.Element => {
    return <div className="w-1/4 h-full space-y-5">

        {
            Array.from({ length: 10 }).map(el => <Task key={v4()} />)
        }
    </div>
})
Status.displayName = "Status"
const Task = React.memo((): React.JSX.Element => {
    return <Card className="cursor-pointer shadow-md">
        <CardHeader>
            <CardTitle className="heading-m hover:text-primary-300">Build UI for search</CardTitle>
            <CardDescription className="text-[12px] font-bold text-secondary-100">0 of 2 substasks</CardDescription>
        </CardHeader>
    </Card>
})
Task.displayName = "Task"