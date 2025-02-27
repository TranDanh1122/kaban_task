import React from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CircleX, FileArchive, XIcon } from "lucide-react";

export const File = ({ file }: { file: UploadFile }): React.JSX.Element => {

    return <div className="relative">
        <CircleX className="size-5 rounded-full text-white bg-accent-200 absolute right-0 top-0"></CircleX>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger> <FileArchive className="size-16"></FileArchive></TooltipTrigger>
                <TooltipContent>
                    <p>{file.name}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
        <p className="text-[10px] line-clamp-1 text-ellipsis w-16">{file.name}</p>
    </div>
}