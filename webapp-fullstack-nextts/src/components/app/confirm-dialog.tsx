'use client'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useDialog } from "@/hooks/use-dialog"
import React from "react"
import { Button } from "../ui/button"
export default function ConfirmDialog({ title, desc, action, isLoading }: { title: string, desc: string, action: () => void, isLoading : boolean }) {
    const { isOpen, dispatch } = useDialog()
    return <Dialog onOpenChange={(open) => dispatch({ type: "TOOGLE", payload: { name: "ConfirmDialog", state: open } })} open={isOpen("ConfirmDialog")}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="font-bold heading-l text-accent-200">
                    {title}
                </DialogTitle>
                <DialogDescription className="text-secondary-100 font-semibold body-l">{desc}</DialogDescription>
            </DialogHeader>
        </DialogContent>
        <DialogFooter>
            <Button disabled={isLoading} onClick={action} className="text-white bg-accent-200 rounded-2xl">
                {!isLoading && "Delete"}
                {isLoading && <div className="size-3 border-l-2 border-t-2 rounded-full animate-spin"></div>}
            </Button>
            <DialogClose className="text-primary-300 bg-primary-100 rounded-2xl">Cancel</DialogClose>
        </DialogFooter>
    </Dialog>

}