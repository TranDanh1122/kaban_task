export function createSlug(name: string): string {
    return name
        .toLowerCase() // Chuyển về chữ thường
        .normalize('NFD') // Chuẩn hóa Unicode để tách dấu
        .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu tiếng Việt
        .replace(/đ/g, 'd') // Chuyển đ -> d
        .replace(/[^a-z0-9\s-]/g, '') // Loại bỏ ký tự đặc biệt
        .trim() // Xóa khoảng trắng đầu cuối
        .replace(/\s+/g, '-') // Thay khoảng trắng bằng dấu "-"
}