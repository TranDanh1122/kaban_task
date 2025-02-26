'use client'
import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { FieldArrayWithId, useFieldArray, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useDialog } from "@/hooks/use-dialog"
import { XIcon } from "lucide-react"
import { useCreateOrUpdateBoard } from "@/hooks/use-fetch-board"
import { useAppCoordinator } from "@/hooks/useCoordinator"
import { useCreateBoardMutation } from "@/redux/actions/boardAPI"

const formSchema = z.object({
    title: z.string().min(2, { message: "Title atleast 2 character" }).max(50),
    columns: z.array(
        z.object({
            name: z.string().min(2, "Column name is required"),
            color: z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Invalid color code"),
        })
    ).min(1, "At least one column is required"),
})


export default function CreateBoardForm(): React.JSX.Element {
    const { state, isOpen, dispatch } = useDialog()
    const { viewingBoard: board } = useAppCoordinator()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: board?.title ?? "",
            columns: board?.Status ?? [{
                name: "",
                color: "",
            }],
        }
    })
    const [createBoardMutation, { isLoading }] = useCreateBoardMutation()
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        createBoardMutation({ ...data, id: board?.id ?? "", slug: board?.slug ?? "" })
    }

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "columns",
        shouldUnregister: false,
    });

    return <>
        <Dialog onOpenChange={(open) => dispatch({ type: "TOOGLE", payload: { name: "BoardForm", state: open } })} open={isOpen("BoardForm")}>
            <DialogTrigger asChild></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="font-bold text-lg">
                        {!board && "Add New Board"}
                        {board && "Edit Board"}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-secondary-100 text-sm font-semibold">Board Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Make My Mom Happy..." {...field} />
                                    </FormControl>
                                    <FormMessage className="font-semibold text-accent-200" />
                                </FormItem>
                            )}
                        />

                        <fieldset className="space-y-2">
                            <legend className="font-semibold text-secondary-100 text-sm">Board Columns</legend>

                            {fields.map((field: FieldArrayWithId, index: number) => (
                                <div key={field.id} className="flex gap-2 items-start w-full">
                                    {/* Column Name */}
                                    <FormField
                                        control={form.control}
                                        name={`columns.${index}.name`}
                                        render={({ field }) => (
                                            <FormItem className="w-4/5">
                                                <FormControl>
                                                    <Input placeholder="Find a peace place..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Color Picker */}
                                    <FormField
                                        control={form.control}
                                        name={`columns.${index}.color`}
                                        render={({ field }) => (
                                            <FormItem className="w-1/5" style={{ marginTop: 0 }}>
                                                <FormControl>
                                                    <Input type="color" {...field} />
                                                </FormControl>
                                                <FormMessage />
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
                            {form.formState.errors.columns && <FormMessage>{form.formState.errors.columns.message}</FormMessage>}


                            <Button disabled={isLoading} className="bg-primary-100 text-primary-300 font-semibold hover:bg-primary-100 w-full rounded-3xl" type="button" onClick={() => append({ name: "", color: "#000000" })}>
                                + Add Column
                            </Button>
                        </fieldset>

                        <Button disabled={isLoading} className="text-primary-100 bg-primary-300 font-semibold hover:bg-primary-300 w-full rounded-3xl" type="submit">
                            {
                                !isLoading && <>
                                    {!board && "Create New Board"}
                                    {board && "Save change"}
                                </>
                            }
                            {isLoading && <div className="border-white border-t-2 border-r-2 animate-spin rounded-full w-5 h-5"></div>}
                        </Button>
                    </form>
                </Form>


            </DialogContent>
        </Dialog>

    </>
}