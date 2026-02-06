// TypeScript types matching backend models

export interface Product {
    id: string;
    title: string;
    description?: string;
    sku: string;
    slug: string;
    price: number;
    compareAtPrice?: number;
    averageRating?: number;
    reviewsCount?: number;
    stock: number;
    images: string[];
    tags: string[];
    published: boolean;
    seoTitle?: string;
    seoMetaDescription?: string;
    collectionId?: string;
    collection?: Collection;
    weight?: number;
    dimensions?: {
        length?: number;
        width?: number;
        height?: number;
    };
    createdAt: string;
    updatedAt: string;
    variants?: ProductVariant[];
    options?: ProductOption[];
    reviews?: Review[];
    details?: {
        cut?: string;
        material?: string;
        modelInfo?: string;
        advice?: string;
    };
    // Vanille Nosy-Be specific
    subtitle?: string;
    size?: string;
    grade?: string;
    packaging_options?: string[];
    bullets?: string[];
    price_label?: string;
}

export interface ProductOption {
    id: string;
    productId: string;
    name: string;
    values: string[];
    position: number;
}

export interface ProductVariant {
    id: string;
    productId: string;
    sku: string;
    title: string;
    price?: number;
    compareAtPrice?: number;
    stock: number;
    options: Record<string, string>;
    image?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Collection {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    published: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CartItem {
    id: string;
    cartId: string;
    productId: string;
    variantId?: string;
    quantity: number;
    price: number;
    product: Product;
    variant?: ProductVariant;
}

export interface Cart {
    id: string;
    customerId?: string;
    items: CartItem[];
    createdAt: string;
    updatedAt: string;
}

export interface Review {
    id: string;
    productId: string;
    customerId: string;
    orderId: string;
    rating: number;
    title?: string;
    comment?: string;
    verified: boolean;
    approved: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Customer {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Order {
    id: string;
    orderNumber: string;
    customerId?: string;
    customer?: Customer;
    email: string;
    status: 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    total: number;
    subtotal: number;
    shippingCost: number;
    tax: number;
    items: OrderItem[];
    shippingAddress: Address;
    billingAddress: Address;
    createdAt: string;
    updatedAt: string;
}

export interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    variantId?: string;
    quantity: number;
    price: number;
    product: Product;
}

export interface Address {
    id: string;
    customerId: string;
    type: 'SHIPPING' | 'BILLING';
    isDefault: boolean;
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    province?: string;
    postalCode: string;
    country: string;
    phone?: string;
}

export interface ApiResponse<T> {
    data?: T;
    error?: {
        message: string;
        statusCode: number;
    };
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}
