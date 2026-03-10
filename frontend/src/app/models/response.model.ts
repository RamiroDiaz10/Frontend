import { DataAuthUser } from './user-model';


export interface ResponseApi<T> {
    data?: T,
    user?: DataAuthUser,
    msg?:string,
    token?: string;
}