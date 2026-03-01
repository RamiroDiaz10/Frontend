import { DataAuthUser } from './user-model';
export interface ResponseApi {
    user?: DataAuthUser,
    msg?:string,
    token?: string;
}