'use client'
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useDialog } from "@/hooks/use-dialog";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { FieldArrayWithId, useFieldArray, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { XIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppCoordinator } from "@/hooks/useCoordinator";
import { useCreateOrUpdateMutation, useCreateTaskMutation, useUpdateTaskMutation } from "@/redux/actions/taskAPI";

const formSchema = z.object({
    title: z.string().min(2).max(50),
    content: z.string().min(2),
    subtasks: z.array(
        z.object({
            name: z.string().min(2, "Subtask title is required"),
        })
    ).optional(),
    status: z.string({ message: "You need to set a status of this task " })
})
export default function CreateTaskForm({ isCreate }: { isCreate: boolean }): React.JSX.Element {
    const { isOpen, dispatch } = useDialog()
    const { viewingBoard, viewingTask: task } = useAppCoordinator()
    const status = viewingBoard?.Status

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: task?.title ?? "",
            content: task?.content ?? "",
            subtasks: task?.subtasks ?? [],
            status: task?.statusId ?? ''
        },
    })
    const [createMutate, { isLoading: createLoading }] = useCreateTaskMutation()
    const [updateMutate, { isLoading: updateLoading }] = useUpdateTaskMutation()
    const mutate = isCreate ? createMutate : updateMutate
    const isLoading = isCreate ? createLoading : updateLoading
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        mutate(isCreate ? { ...data, id: task?.id ?? "" } : { data: { ...data }, id: task?.id ?? '' })
        dispatch({ type: "TOOGLE", payload: { name: isCreate ? "TaskForm" : "TaskFormEdit", state: false } })
    }
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "subtasks",
        shouldUnregister: false,
    });
    return <Dialog onOpenChange={(open) => dispatch({ type: "TOOGLE", payload: { name: isCreate ? "TaskForm" : "TaskFormEdit", state: open } })} open={isOpen(isCreate ? "TaskForm" : "TaskFormEdit")}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    {task ? "Edit Task" : "Add New Task"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-secondary-100 text-sm font-semibold">Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="eg: Stop Social Media and Do something good man" {...field} />
                                </FormControl>
                                <FormMessage className="font-semibold text-accent-200" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-secondary-100 text-sm font-semibold">Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="eg: Stop Social Media and Do something good man" {...field} />
                                </FormControl>
                                <FormMessage className="font-semibold text-accent-200" />
                            </FormItem>
                        )}
                    />
                    <fieldset className="space-y-2">
                        <legend className="font-semibold text-secondary-100 text-sm">Subtask</legend>

                        {fields.map((field: FieldArrayWithId, index: number) => (
                            <div key={field.id} className="flex gap-2 items-start w-full">

                                <FormField
                                    control={form.control}
                                    name={`subtasks.${index}.name`}
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormControl>
                                                <Input placeholder="Find a peace place..." {...field} />
                                            </FormControl>
                                            <FormMessage className="text-accent-200 font-semibold" />
                                        </FormItem>
                                    )}
                                />


                                {/* Remove Button */}
                                {fields.length > 1 && (
                                    <Button type="button" onClick={() => remove(index)} className="bg-red-500 hover:bg-red-600">
                                        <XIcon />
                                    </Button>
                                )}
                            </div>
                        ))}
                        {form.formState.errors.subtasks && <FormMessage>{form.formState.errors.subtasks.message}</FormMessage>}
                        <Button disabled={isLoading} className="bg-primary-100 text-primary-300 font-semibold hover:bg-primary-100 w-full rounded-3xl" type="button" onClick={() => append({ name: "" })}>
                            + Add Column
                        </Button>
                    </fieldset>
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <Select onValueChange={field.onChange} defaultValue={task?.statusId}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="How this task going on?" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {
                                            status && status.map((el: Status) => (
                                                <SelectItem key={el.id} value={el.id} className="flex items-center gap-3">
                                                    <span className="size-5 rounded-sm" style={{ backgroundColor: `${el.color}` }}></span>
                                                    {el.name}
                                                </SelectItem>
                                            ))

                                        }


                                    </SelectContent>
                                </Select>
                                <FormMessage className="font-semibold text-accent-200" />
                            </FormItem>
                        )}
                    />
                    <Button disabled={isLoading} className="text-primary-100 bg-primary-300 font-semibold hover:bg-primary-300 w-full rounded-3xl" type="submit">
                        {!isLoading &&
                            <>
                                {!task && "Create New Task"}
                                {task && "Save change"}
                            </>
                        }
                        {isLoading && <div className="border-white border-t-2 border-r-2 animate-spin rounded-full w-5 h-5"></div>}
                    </Button>
                </form>
            </Form>
        </DialogContent>
    </Dialog>

}