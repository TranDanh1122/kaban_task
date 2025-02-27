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
import { useCreateTaskMutation, useUpdateTaskMutation } from "@/redux/actions/taskAPI";
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE, useUploadFile } from "@/hooks/use-upload-file";
import { ScrollArea } from "@/components/ui/scroll-area";
import { v4 } from "uuid";
import { File } from "../FileUpload";
const formSchema = z.object({
    title: z.string().min(2).max(50),
    content: z.string().min(2),
    subtasks: z.array(
        z.object({
            name: z.string().min(2, "Subtask title is required"),
        })
    ).optional(),
    status: z.string({ message: "You need to set a status of this task " }),
    files: z.array(
        z.object({
            path: z.string().optional(),
            relativePath: z.string().optional(),
            name: z.string().optional(),
            size: z.number().max(MAX_FILE_SIZE, { message: "File size should not exceed 2MB" }),
            type: z.string().refine(val => ACCEPTED_FILE_TYPES.includes(val), { message: "Not valid file" })
        })).max(3, { message: "Only 3 files can upload" }).optional(),

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
            status: task?.statusId ?? '',
            files: task?.file ?? []
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
    const onUpload = (acceptedFiles: UploadFile[]) => {
        form.setValue("files", [...form.getValues('files'), ...acceptedFiles])
        form.trigger("files")
    }
    const files = form.watch("files")
    const { getRootProps, getInputProps } = useUploadFile(onUpload)
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
                        <ScrollArea className=" flex flex-col overflow-y-auto max-h-[200px] h-full scrollbar-thin">
                            {fields.map((field: FieldArrayWithId, index: number) => (
                                <div key={field.id} className="flex gap-2 items-start w-full my-1">
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
                        </ScrollArea>

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
                    <FormLabel htmlFor="file-upload" className="text-secondary-100 text-sm font-semibold mt-8 block">File Upload</FormLabel>
                    <fieldset {...getRootProps({ className: 'dropzone' })} className="w-full bg-primary-100 px-5 py-10 rounded-md" style={{ marginTop: "8px" }}>
                        <input id="file-upload" {...getInputProps()} />
                        <div className="flex items-center gap-4">
                            {
                                files.map((file: UploadFile) => (<File key={v4()} file={file} />))
                            }
                        </div>

                        {files.length == 0 && <p className="text-secondary-100 font-bold text-center">+ Drag files here/click to select</p>}
                    </fieldset>
                    {form.formState.errors.files && <FormMessage className="font-semibold text-accent-200">{String(form.formState.errors.files.message)}</FormMessage>}

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
