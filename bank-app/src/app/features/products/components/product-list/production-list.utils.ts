import { IProduct } from "../../models/product.model";

export const filterProducts = (products: IProduct[], searchTerm: string): IProduct[] => {
    const term = searchTerm.toLowerCase();
    return products.filter(product =>
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term)
    );
}

export const paginateProducts = (products: IProduct[], currentPage: number, itemsPerPage: number): IProduct[] => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return products.slice(start, end);
}

export const getProductName = (products: IProduct[], id: string): string => {
    const product = products.find(p => p.id === id);
    return product?.name || '';
};

