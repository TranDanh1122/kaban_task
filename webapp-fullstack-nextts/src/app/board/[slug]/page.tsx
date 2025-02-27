'use client'
import React from "react"
import Layout from "@/components/app/Layout"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ListTodo, PencilRuler, Sparkle } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import Status from "@/components/app/Status/status"
import { useDialog } from "@/hooks/use-dialog"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAppCoordinator } from "@/hooks/useCoordinator"
import { DragDropContext } from "@hello-pangea/dnd"
import { usePatchTaskMutation } from "@/redux/actions/taskAPI"

export default function BoardDetail() {
    const { viewingBoard: board, dispatch, reOrder } = useAppCoordinator()
    const [updateMutate] = usePatchTaskMutation()
    const onDragEnd = (result: any) => {
        const { destination, source, draggableId } = result
        if (!destination || !source) return
        const data = { data: { neworder: destination.index, oldorder: source.index, statusId: destination.droppableId }, id: draggableId }
        dispatch(reOrder(data))
        //updateMutate(data)
    }
    return <Layout>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4  w-full">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                {board && <span className="heading-xl">{board.title}</span>}
            </div>
        </header>
        <div className="w-full max-w-auto h-screen max-h-[calc(100vh-64px)] bg-primary-100/20 p-6 overflow-auto scrollbar-thin ">

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex w-auto items-start gap-4">
                    {board &&
                        <>
                            {board.Status && board.Status.map((el: Status) => <Status key={el.id} column={el} />)}
                            <Toolbox className="absolute bottom-6 right-6 size-14 p-3 rounded-full bg-primary-300 hover:bg-primary-200 text-primary-100 " />
                        </>
                    }
                </div>
            </DragDropContext>

        </div>

    </Layout >
}
const Toolbox = React.memo(({ className }: { className: string }) => {
    const { setViewingTask, dispatch: coordinatorAction } = useAppCoordinator()

    const { dispatch } = useDialog()
    const handleEditBoard = () => {
        dispatch({ type: "TOOGLE", payload: { name: "BoardFormEdit", state: true } })
    }
    const handleCreateTask = () => {
        dispatch({ type: "TOOGLE", payload: { name: "TaskForm", state: true } })
        coordinatorAction(setViewingTask(undefined))
    }
    return <>  <Popover>
        <PopoverTrigger asChild>
            <Sparkle className={` ${className}`} />
        </PopoverTrigger>
        <PopoverContent className="w-12 p-0">
            <ActionButton action="Add Task" onClick={handleCreateTask}  > <ListTodo className=" w-full h-full" /></ActionButton>
            <Separator orientation="horizontal" className="h-px" />
            <ActionButton action="Edit Board" onClick={handleEditBoard}> <PencilRuler className="w-full h-full" /></ActionButton>
            <Separator orientation="horizontal" className="h-px" />
        </PopoverContent>
    </Popover></>
})
const ActionButton = ({ children, action, onClick }: { children: React.ReactNode, action: string, onClick: () => void }): React.JSX.Element => {
    return <><TooltipProvider>
        <Tooltip defaultOpen={false}>
            <TooltipTrigger onClick={onClick} className="w-full p-3 border-2 border-transparent hover:border-border">{children}</TooltipTrigger>
            <TooltipContent>
                <p>{action}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider></>
}
Toolbox.displayName = "Toolbox"
