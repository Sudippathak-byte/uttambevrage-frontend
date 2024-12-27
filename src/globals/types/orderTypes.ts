// orderTypes.ts

export interface OrderData {
    phoneNumber: string; // Customer's phone number
    shippingAddress: string; // Address where the order will be shipped
    totalAmount: number; // Total amount for the order
    paymentDetails: {
        paymentMethod: PaymentMethod; // Method of payment (e.g., COD, Khalti)
        paymentStatus?: PaymentStatus; // Status of the payment (optional)
        pidx?: string; // Payment ID for transaction verification (optional)
    };
    items: OrderDetails[]; // Array of items in the order
}

export interface OrderDetails {
    quantity: number; // Quantity of the product ordered
    productId: string; // ID of the product being ordered
}

export enum PaymentMethod {
    Cod = "cod", // Cash on Delivery
    Khalti = "khalti", // Khalti payment method
}

export enum PaymentStatus {
    Paid = "paid", // Payment has been completed
    Unpaid = "unpaid", // Payment is pending
}

export interface KhaltiResponse {
    pidx: string; // Payment ID from Khalti
    payment_url: string; // URL for payment
    expires_at: Date | string; // Expiration date of the payment
    expires_in: number; // Time until expiration in seconds
    user_fee: number; // User fee for the transaction
}

export interface TransactionVerificationResponse {
    pidx: string; // Payment ID
    total_amount: number; // Total amount of the transaction
    status: TransactionStatus; // Status of the transaction
    transaction_id: string; // Transaction ID from Khalti
    fee: number; // Transaction fee
    refunded: boolean; // Indicates if the transaction was refunded
}

export enum TransactionStatus {
    Completed = "completed", // Transaction completed successfully
    Refunded = "refunded", // Transaction was refunded
    Pending = "pending", // Transaction is pending
    Initiated = "initiated", // Transaction has been initiated
}

export enum OrderStatus {
    Pending = "pending", // Order is pending
    Cancelled = "cancelled", // Order has been cancelled
    Ontheway = "ontheway", // Order is on the way
    Delivered = "delivered", // Order has been delivered
    Preparation = "preparation", // Order is being prepared
}
