'use client'
import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useDialog } from "@/hooks/use-dialog";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { FieldArrayWithId, useFieldArray, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { BadgeX, Edit, Ellipsis } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useDeleteTaskMutation, useUpdateTaskMutation } from "@/redux/actions/taskAPI";
import { useAppCoordinator } from "@/hooks/useCoordinator";

const formSchema = z.object({
    subtasks: z.array(
        z.object({
            name: z.string(),
            status: z.boolean()
        })
    ).optional(),
    status: z.string({ message: "You need to set a status of this task " })
})
export default function ViewTaskForm(): React.JSX.Element {
    const { isOpen, dispatch } = useDialog()
    const { viewingBoard, viewingTask: task } = useAppCoordinator()
    const status = viewingBoard?.Status

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            subtasks: task?.subtasks ?? [],
            status: task?.statusId ?? ''
        },
    })
    const [updateTask, { isLoading }] = useUpdateTaskMutation()
    const [deleter, { isLoading: deleterLoading }] = useDeleteTaskMutation()
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        updateTask({ data: { ...task, ...data }, id: task?.id })
        dispatch({ type: "TOOGLE", payload: { name: "TaskView", state: false } })
    }
    const { fields } = useFieldArray({
        control: form.control,
        name: "subtasks",
        shouldUnregister: false,
    });
    const handleEdit = () => {
        dispatch({ type: "TOOGLE", payload: { name: "TaskFormEdit", state: true } })
        dispatch({ type: "TOOGLE", payload: { name: "TaskView", state: false } })
    }

    const handleDelete = () => {
        dispatch({
            type: "SETDATA", payload: {
                name: "ConfirmDialog", data: {
                    title: "Delete this task?",
                    desc: `Are you sure you want to delete the ‘${task?.title} task? This action will remove this task forever!`,
                    action: () => {
                        deleter(task?.id || "")
                        dispatch({ type: "TOOGLE", payload: { name: "TaskView", state: false } })
                     },
                    actionTitle: 'Delete',
                    primaryColor: "#EA5555"
                }
            }
        })
        dispatch({ type: "TOOGLE", payload: { name: "ConfirmDialog", state: true } })
    }
    React.useEffect(() => {
        dispatch({
            type: "SETDATA", payload: {
                name: "ConfirmDialog", data: {
                    isLoading: deleterLoading
                }
            }
        })
    }, [deleterLoading])

    return <Dialog onOpenChange={(open) => dispatch({ type: "TOOGLE", payload: { name: "TaskView", state: open } })} open={isOpen("TaskView")}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent aria-describedby={task?.title}>
            <DialogTitle></DialogTitle>
            <div className="flex items-center justify-between flex-row mt-3">
                <p className="heading-l font-bold w-full text-ellipsis line-clamp-3">{task?.title}</p>
                <Popover>
                    <PopoverTrigger className=""><Ellipsis /></PopoverTrigger>
                    <PopoverContent className="w-fit px-2 flex flex-col items-start font-semibold">
                        <Button onClick={() => handleEdit()} className="bg-white dark:bg-inherit w-full hover:bg-slate-100 justify-start text-black dark:text-inherit"><Edit className="block" /> Edit Task</Button>
                        <Button onClick={() => handleDelete()} className="text-accent-200 w-full bg-white dark:bg-inherit justify-start hover:bg-slate-100"><BadgeX /> Delete Task</Button>
                    </PopoverContent>
                </Popover>
            </div>

            <p className="font-semibold text-secondary-100 text-base line-clamp-3 text-ellipsis">{task?.content}</p>
            {
                task?.subtasks &&
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                        <fieldset className="space-y-2">
                            <legend className="font-semibold text-secondary-100 text-sm">Subtask</legend>

                            {fields.map((field: FieldArrayWithId, index: number) => (

                                <div key={field.id} className="flex gap-2 items-start w-full">
                                    <FormField
                                        control={form.control}
                                        name={`subtasks.${index}.status`}
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel style={{ color: `${field.value ? "#828FA3" : "black"}` }} htmlFor={`subtasks.${index}.status`} className="text-ellipsis w-full p-4 bg-primary-100 rounded-md font-semibold flex items-center gap-3 justify-start">
                                                    <FormControl>
                                                        <Checkbox id={`subtasks.${index}.status`}
                                                            checked={field.value} className="data-[state=checked]:bg-primary-300 data-[state=checked]:border-transparent"
                                                            onCheckedChange={(value => field.onChange(value))} />
                                                    </FormControl>
                                                    {task.subtasks[index].name}
                                                </FormLabel>
                                                <FormMessage className="text-accent-200 font-semibold" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`subtasks.${index}.name`}
                                        render={({ field }) => (
                                            <FormItem className="hidden">
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage className="text-accent-200 font-semibold" />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            ))}
                            {form.formState.errors.subtasks && <FormMessage>{form.formState.errors.subtasks.message}</FormMessage>}
                        </fieldset>
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <Select onValueChange={(value) => { field.onChange(value) }} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="How this task going on?" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {status && status.map((el: Status) => (
                                                <SelectItem key={el.id} value={el.id} className="flex items-center gap-3">
                                                    <span className="size-5 rounded-sm" style={{ backgroundColor: `${el.color}` }}></span>
                                                    {el.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="font-semibold text-accent-200" />
                                </FormItem>
                            )}
                        />
                        <Button disabled={isLoading} className="text-primary-100 bg-primary-300 font-semibold hover:bg-primary-300 w-full rounded-3xl" type="submit">
                            {!isLoading && "Save change"}
                            {isLoading && <div className="border-white border-t-2 border-r-2 animate-spin rounded-full w-5 h-5"></div>}
                        </Button>
                    </form>
                </Form>
            }

        </DialogContent>
    </Dialog>

}