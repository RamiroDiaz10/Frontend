export interface DataAuthUser  {
    _id?:string,
    name?: string,
    username?: string,
    email: string,
    phone?: number,
    password: string,
    role?: string,

}
export interface ResponseUser {
    userFound: DataAuthUser[],
}

