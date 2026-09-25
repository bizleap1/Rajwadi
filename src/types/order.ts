import { CartItem } from "@/context/CartContext";

export type PaymentStatus = "PAID" | "FAILED" | "CANCELLED" | "PENDING";
export type OrderStatus = "CONFIRMED" | "IN_ATELIER" | "DISPATCHED" | "DELIVERED";

export interface DeliveryAddress {
  fullName: string;
  mobile: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderRecord {
  orderId: string;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  deliveryAddress: DeliveryAddress;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
  estimatedDelivery: {
    from: string;
    to: string;
    rangeString?: string;
  };
}
