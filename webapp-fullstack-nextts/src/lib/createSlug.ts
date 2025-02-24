
export function createSlug(name: string, boards: Board[]): string {
    const count = boards?.reduce((sum: number, el: Board) => {
        if (el.title === name) return sum + 1
        return sum
    }, 0) || 0
    return `${name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')}${count > 0 ? `_${count + 1}` : ""}`
}