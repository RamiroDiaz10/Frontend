export interface DataCategory {
    _id?:string,
    name: string,
    description: string,
    image?: string,
    stock: number,
    isActive?: boolean;
}