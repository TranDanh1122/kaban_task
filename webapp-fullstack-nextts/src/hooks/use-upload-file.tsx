'use client'
import React from "react"
import { useDropzone } from "react-dropzone";
export const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"];
export const MAX_FILE_SIZE = 2 * 1024 * 1024

export const useUploadFile = (callback?: (acceptedFiles: UploadFile[]) => void) => {
    const onDrop = React.useCallback((acceptedFiles: any) => {
        callback?.(acceptedFiles)
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: ACCEPTED_FILE_TYPES.reduce((acc, type) => {
            acc[type] = [];
            return acc;
        }, {} as { [key: string]: string[] }),
        maxSize: MAX_FILE_SIZE,
        maxFiles: 3,
        multiple : true
    });

    return { getRootProps, getInputProps }
}