import { DataAuthUser } from './user-model';
import { DataCategory } from './category-model';
import { DataProduct } from './products.models';

export interface ResponseApi<T> {
    data?: T,
    user?: DataAuthUser,
    msg?:string,
    token?: string;
}