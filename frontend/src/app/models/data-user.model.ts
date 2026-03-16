export interface DataUser {
    _id?: string,
    name?: string,
    username?: string,
    phone?: number,
    email: string,
    password: string,
    role?: string,
    isActive?: boolean,
    createDate?: Date
}

export interface ResponseUsers {
    users: DataUser[],
}