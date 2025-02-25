'use client'
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useDialog } from "@/hooks/use-dialog";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { FieldArrayWithId, useFieldArray, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useCreateOrUpdateTask } from "@/hooks/use-fetch-task";
import { BadgeX, Edit, Ellipsis } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const formSchema = z.object({
    subtasks: z.array(
        z.object({
            status: z.boolean()
        })
    ).optional(),
    status: z.string({ message: "You need to set a status of this task " })
})
export default function ViewTaskForm(): React.JSX.Element {
    const { state, isOpen, dispatch } = useDialog()
    const taskData = state.find(el => el.name == "TaskView")?.data;
    const task: Task | undefined = taskData ? (taskData.task as Task) : undefined;
    const status: Status[] | undefined = taskData ? (taskData.status as Status[]) : undefined;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            subtasks: task?.subtasks ?? [],
            status: task?.statusId ?? ''
        },
    })
    const createNewTask = useCreateOrUpdateTask()

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        console.log(1);

        createNewTask.mutate({ ...data, id: task?.id ?? "" })
    }
    const { fields } = useFieldArray({
        control: form.control,
        name: "subtasks",
        shouldUnregister: false,
    });
    const handleEdit = () => {

    }
    const handleDelete = () => {

    }
    return <Dialog onOpenChange={(open) => dispatch({ type: "TOOGLE", payload: { name: "TaskView", state: open } })} open={isOpen("TaskView")}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="heading-l font-bold ">{task?.title}</DialogTitle>
                <Popover>
                    <PopoverTrigger><Ellipsis /></PopoverTrigger>
                    <PopoverContent className="w-fit px-2 flex flex-col font-semibold">
                        <Button onClick={() => handleEdit()} className="bg-white hover:bg-slate-100 text-black"><Edit /> Edit Task</Button>
                        <Button onClick={() => handleDelete()} className="text-accent-200 bg-white hover:bg-slate-100"><BadgeX /> Delete Task</Button>
                    </PopoverContent>
                </Popover>
            </DialogHeader>

            <p className="font-semibold text-secondary-100 text-base">{task?.content}</p>
            {
                task?.subtasks &&
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                        <fieldset className="space-y-2">
                            <legend className="font-semibold text-secondary-100 text-sm">Subtask</legend>

                            {fields.map((field: FieldArrayWithId, index: number) => (
                                <div key={field.id} className="flex gap-2 items-start w-full">
                                    <FormLabel>
                                        <FormField
                                            control={form.control}
                                            name={`subtasks.${index}.status`}
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormControl>
                                                        <Checkbox checked={field.value} onCheckedChange={(value => field.onChange(value))} />
                                                    </FormControl>
                                                    <FormMessage className="text-accent-200 font-semibold" />
                                                </FormItem>
                                            )}
                                        />
                                        111
                                    </FormLabel>
                                </div>
                            ))}
                            {form.formState.errors.subtasks && <FormMessage>{form.formState.errors.subtasks.message}</FormMessage>}
                        </fieldset>
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    </form>
                </Form>
            }

        </DialogContent>
    </Dialog>

}