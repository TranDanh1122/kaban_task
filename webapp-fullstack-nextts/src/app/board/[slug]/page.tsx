'use client'
import React from "react"
import Layout from "@/components/app/Layout"
import { ScrollArea } from "@/components/ui/scroll-area"
import useFetchStatus from "@/hooks/use-fetch-status"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ListTodo, PencilRuler, Sparkle } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import Status, { StatusSkeleton } from "@/components/app/Status/status"
import { useGetBoardBySlug } from "@/hooks/use-fetch-board"
import { notFound } from "next/navigation"
export default function BoardDetail({ params }: { params: { slug: string } }) {
    const { board, isLoading, isError } = useGetBoardBySlug(params.slug)
    console.log(board)
    if (!isLoading && isError && !board) return notFound()
    return <Layout>
        <ScrollArea className="w-full h-screen max-h-[calc(100vh-64px)] bg-primary-100/20 p-6">
            <div className="flex items-start gap-4">
                {isError && <div className="w-full h-full flex items-center justify-center font-semibold mt-20">Error when loading, please try again later</div>}
                {isLoading && Array.from({ length: 4 }).map(el => <StatusSkeleton />)}
                {!isLoading && !isError &&
                    <>
                        {board.status && board.status.map((el: Status) => <Status column={el} />)}
                        <Toolbox className="absolute bottom-6 right-6 size-14 p-3 rounded-full bg-primary-300 hover:bg-primary-200 text-primary-100 " />
                    </>
                }
            </div>

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
