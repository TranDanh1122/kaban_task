declare global {
    interface Subtask {
        id: string
        name: string
        status: boolean
    }

    interface UploadFile {
        path: string,
        relativePath: string,
        name: string,
        size: number,
        type: string,
    }
    interface File extends Partial<UploadFile> {
        id: string,
        name: string,
        url: string,
        public_id: string
    }
    interface Task {
        id: string,
        title: string,
        content: string,
        statusId: string,
        subtasks: Subtask[],
        order: numberm
        file: File[]
    }

    interface Status {
        id: string,
        name: string,
        color: string,
        Task: Task[]
    }

    interface Board {
        id: string,
        title: string
        slug: string,
        Status?: Status[],
        isArchive: boolean
    }

    interface User {
        id: string,
        name?: string | null,
        email?: string | null,
        image?: string | null,
        password?: string,
    }
    type DIALOG = "TASK_FORM" | "TASK_VIEW" | "BOARD_FORM" | "CONFIRM"
}
export { }