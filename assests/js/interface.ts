export interface Product {
    name: string;
    price: any;
    quantity: number;
    id: string;
}

export interface OrderItemsProps {
    elem: any;
    jsonData: Product[];
    getTableHeader: any;
    generateOrderTable: any;
}