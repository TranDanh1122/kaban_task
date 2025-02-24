'use client'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useDialog } from "@/hooks/use-dialog"
import React from "react"
import { Button } from "../ui/button"
export default function ConfirmDialog() {
    const { state, isOpen, dispatch } = useDialog()
    const data: any = state.find(el => el.name == "ConfirmDialog")?.data || { actionTitle: "", title: "", desc: "", action: () => { }, isLoading: false, primaryColor: "" }
    return <Dialog onOpenChange={(open) => dispatch({ type: "TOOGLE", payload: { name: "ConfirmDialog", state: open } })} open={isOpen("ConfirmDialog")}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="font-bold heading-l text-accent-200" style={{ color: `${data.primaryColor}` }}>
                    {data.title}
                </DialogTitle>
                <DialogDescription className="text-secondary-100 font-semibold body-l">{data.desc}</DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex items-center sm:justify-between">
                <DialogClose asChild><Button className="text-primary-300 bg-primary-100 rounded-2xl" >Cancel</Button></DialogClose>
                <Button disabled={data.isLoading} onClick={() => { data.action() }} style={{ backgroundColor: `${data.primaryColor}` }} className="text-white bg-accent-200 rounded-2xl">
                    {!data.isLoading && `${data.actionTitle}`}
                    {data.isLoading && <div className="size-3 border-l-2 border-t-2 rounded-full animate-spin"></div>}
                </Button>
            </DialogFooter>
        </DialogContent>

    </Dialog>

}