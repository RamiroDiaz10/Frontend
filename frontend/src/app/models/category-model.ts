export interface DataCategory {
    _id?:string,
    name: string,
    description: string,
    image?: string,
    stock: number,
    isActive?: boolean;
    msg?: string;
}

export interface ResponseCategories {
    categories: DataCategory[],
}