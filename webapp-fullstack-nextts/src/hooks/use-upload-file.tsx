'use client'
import React from "react"
import { useDropzone } from "react-dropzone";
export const ACCEPTED_FILE_TYPES = ["image/*",  "application/pdf"];
export const MAX_FILE_SIZE = 2 * 1024 * 1024

export const useUploadFile = (callback?: (acceptedFiles: UploadFile[]) => void, reject?: (fileRejections: any) => void) => {
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
        multiple: true,
        onDropRejected: (fileRejections: any) => {            
            reject?.(fileRejections)
        }
    });

    return { getRootProps, getInputProps }
}