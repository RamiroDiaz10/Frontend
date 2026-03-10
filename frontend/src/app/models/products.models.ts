export interface DataProduct {
    _id?:string,
    name: string,
    description: string,
    image?: string,
    size?: string,
    material?: string,
    color?: string, 
    price: number,
    stock: number,
    category?: string,
    isActive?: boolean;
    msg?: string;
}
export interface ResponseProducts {
    products: DataProduct[],
}