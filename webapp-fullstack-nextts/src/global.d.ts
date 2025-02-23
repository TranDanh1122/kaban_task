declare global {
    interface Task {
        id: string,
        title: string,
        content: string,
        author: User,
        status: Status,
        board: Board,
    }

    interface Status {
        id: string,
        name: string,
        color: string,
    }

    interface Board {
        id: string,
        title: string
        slug: string
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