export interface DataAuthUser  {
    _id?:string,
    name?: string,
    username?: string,
    email: string,
    password: string,
    role?: string;

}
export interface ResponseUser {
    user: DataAuthUser[],
}

