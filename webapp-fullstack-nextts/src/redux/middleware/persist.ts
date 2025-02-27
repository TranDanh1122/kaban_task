export const persistMiddleware = (persistor: any) => (store: any) => (next: any) => (action: any) => {
    const result = next(action);
    if (action.type.startsWith("coordinator/")) {
        persistor.persist()
        return result;
    }
}