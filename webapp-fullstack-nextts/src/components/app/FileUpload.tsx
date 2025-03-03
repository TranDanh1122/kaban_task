"use client"
import React from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CircleX, FileArchive } from "lucide-react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { FormLabel, FormMessage } from "@/components/ui/form";
import { useUploadFile } from "@/hooks/use-upload-file";
import { FieldArrayWithId } from "react-hook-form";
interface FileUploadFormProps {
    form: UseFormReturn<any>,
    maxFile: number,
    multiple: boolean
}
export function FileUploadForm({ form, maxFile, multiple }: FileUploadFormProps) {
    const { fields: files, remove: removeFile } = useFieldArray({
        control: form.control,
        name: "files",
        shouldUnregister: false,
    });

    const onUpload = (acceptedFiles: UploadFile[]) => {
        form.setValue("files", [...(form.getValues('files') || []), ...acceptedFiles.map(file => ({
            file: file,
            path: file.path,
            relativePath: file.relativePath,
            name: file.name,
            size: file.size,
            type: file.type
        }))])
        form.trigger("files")
    };

    const onReject = (fileRejections: any) => {
        if (fileRejections && fileRejections.length > 0) {
            fileRejections[0].errors.forEach((el:any) => {
                form.setError("files", el);
            });
        }
    };

    const { getRootProps, getInputProps } = useUploadFile(maxFile, multiple, onUpload, onReject);

    return (
        <div className="space-y-2">
            <FormLabel htmlFor="file-upload" className="text-secondary-100 text-sm font-semibold block">File Upload</FormLabel>
            <fieldset {...getRootProps({ className: 'dropzone' })} className="w-full bg-primary-100 dark:bg-secondary-300 dark:border-white dark:border-2 dark:border-dashed px-5 py-10 rounded-md">
                <input id="file-upload" {...getInputProps()} />
                <div className="flex items-center gap-4">
                    {files?.map((field: FieldArrayWithId, index: number) => (
                        <FileUpload
                            key={field.id}
                            file={(form.getValues("files")?.[index] as File) ?? {}}
                            onDelete={() => { form.trigger("files"); removeFile(index); }}
                        />
                    ))}
                </div>
                {files.length === 0 && <p className="text-secondary-100 font-bold text-center">+ Drag files here/click to select</p>}
            </fieldset>
            {form.formState.errors.files && <FormMessage className="font-semibold text-accent-200">{String(form.formState.errors.files.message)}</FormMessage>}
        </div>
    );
}

interface Props {
    file: File,
    onDelete: () => void,
}
export const FileUpload = ({ file, onDelete }: Props,): React.JSX.Element => {

    return <div className="relative">
        <CircleX onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete() }} className="size-5 rounded-full text-white bg-accent-200 absolute right-0 top-0"></CircleX>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger> <FileArchive onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(`${file.url ?? "#"}`, "_blank") }} className="size-16"></FileArchive></TooltipTrigger>
                <TooltipContent>
                    <p>{file.name}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
        <p className="text-[10px] line-clamp-1 text-ellipsis w-16">{file.name}</p>
    </div>
}