'use client'
import { useDialog } from "@/hooks/use-dialog"
import React, { ChangeEvent } from "react"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar } from "@radix-ui/react-avatar"
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession } from "next-auth/react"
import { Edit } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, UseFormReturn } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { AxiosClient } from "@/lib/axios-client"
import { useUploadMutation } from "@/redux/actions/uploadAPI"

const formSchema = z.object({
    name: z.string().min(2, { message: "Username must be at least 2 characters." }),
    email: z.string().min(2, { message: "Email is too short" }).email({ message: "Invalid email" }),
    image: z
        .any()
        .refine((file) => file instanceof File, "Only can upload 1 file")
        .refine((file) => file.size <= 2 * 1024 * 1024, "File too big (<2MB)")
        .refine((file) => file.type.startsWith("image/"), "Only accept Image"),
})

export default function AccountDialog() {
    const { isOpen, dispatch } = useDialog()
    const session = useSession()
    const user = session.data?.user
    const [img, setImg] = React.useState<string>(user?.image ?? "")
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files
        if (selectedFile) setImg(URL.createObjectURL(selectedFile[0]));
    }
    return <Dialog onOpenChange={(open) => dispatch({ type: "TOOGLE", payload: { name: "AccountDialog", state: open } })} open={isOpen("AccountDialog")}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="p-0">
            <DialogHeader className="w-full h-16 p-6 bg-primary-100 rounded-e-md mb-16">
                <Avatar className="size-24 rounded-full relative">
                    <AvatarImage src={img} alt={user?.name || ''} className="rounded-full" />
                    <AvatarFallback className="rounded-full size-24">KB</AvatarFallback>
                    <Edit onClick={() => { (document.querySelector("#avatar") as HTMLInputElement).click() }} className="absolute bottom-0 right-2 size-4 bg-white rounded-full"></Edit>
                </Avatar>
            </DialogHeader>
            <AccountForm user={user} onChangeImage={handleAvatarChange} />
            <DialogFooter className="flex items-center sm:justify-between p-3 border-t-2">
                <DialogClose asChild><Button className="text-primary-300 bg-primary-100 hover:bg-primary-100 rounded-2xl" >Cancel</Button></DialogClose>
                <Button form="accountForm" type="submit" className="text-primary-100 bg-primary-300 hover:bg-primary-300 rounded-2xl " >Apply Change</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
}
interface Props {
    user?: User | null,
    onChangeImage: (e: React.ChangeEvent<HTMLInputElement>) => void
}
const AccountForm = ({ user, onChangeImage }: Props) => {
    const session = useSession()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: user?.name || "",
            email: user?.email || "",
        },
    })
    const [uploadFile] = useUploadMutation()
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {

            const formData = new FormData()
            const image = form.getValues("image");
            if (image) formData.append("0", image);

            uploadFile({ data: formData, id: user?.id, type: "user" }).unwrap().then((uploadResponse) => {
                console.log(uploadResponse.files);
                setTimeout(async () => {
                    const patchResponse = await AxiosClient.patch(`${process.env.NEXT_PUBLIC_API_URL}/user/${user?.id}`, { data: { name: data.name, image: uploadResponse?.files[0].url ?? "" } })
                    if (patchResponse.status != 200) throw new Error("Fail to update user")
                    session.update()
                    toast.success(patchResponse.data.message || "Update account successfully", { style: { color: "green" } })
                }, 200)
            })
        } catch (error: any) {
            console.log(error);
            toast.error(error.response.data.message || "Update account error", { style: { color: "red" } })
        }
    }
    return <>

        <Form {...form}>
            <form id="accountForm" onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 px-6">
                <InlineEditField label="Name" name="name" placeholder="eg: Tran Thanh Danh" form={form} />
                <InlineEditField label="Email" name="email" placeholder="eg: trandanh14042000@gmail.com" form={form} readOnly={true} />
                <input type="file" onChange={(e) => {
                    onChangeImage(e)
                    if (e.target.files) {
                        form.setValue("image", e.target.files[0])
                        form.trigger("image")
                    }
                }} className="hidden" accept="image/*" id="avatar" />
            </form>
        </Form >
    </>
}
const InlineEditField = ({
    label,
    name,
    placeholder,
    form,
    readOnly
}: { label: string, name: string, form: UseFormReturn<any>, placeholder: string, readOnly?: boolean }) => {
    return <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
            <FormItem className="flex items-baseline gap-4 relative">
                <FormLabel className="font-semibold w-1/3">{label}</FormLabel>
                <FormControl>
                    <Input readOnly={readOnly} className=" border-0 border-b-2 border-transparent p-0 rounded-none focus:border-b-border  focus-visible:ring-0 focus-visible:ring-offset-0 font-bold" placeholder={placeholder} {...field} />
                </FormControl>
                <FormMessage className="text-accent-200 font-semiboldF" />
            </FormItem>
        )}
    />
}