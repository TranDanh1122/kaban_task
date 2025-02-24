declare global {
    interface Subtask {
        id: string
        name: string
        status: boolean
    }
    interface Task {
        id: string,
        title: string,
        content: string,
        statusId: string,
        subtasks: Subtask[]
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
        avatar?: string,
        password?: string,
    }

}
export { }