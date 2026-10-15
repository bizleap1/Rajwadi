"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { OrderRecord } from "@/types/order";

interface OrderContextType {
  orders: OrderRecord[];
  createOrder: (order: OrderRecord) => void;
  getOrderById: (orderId: string) => OrderRecord | undefined;
  getLatestOrder: () => OrderRecord | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const isLoadedRef = useRef(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("rajwadi_orders");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setOrders(parsed);
        }
      }
    } catch (e) {
      console.warn("Could not load orders from localStorage", e);
    } finally {
      isLoadedRef.current = true;
    }
  }, []);

  // Save to localStorage when orders change
  useEffect(() => {
    if (!isLoadedRef.current) return;
    try {
      localStorage.setItem("rajwadi_orders", JSON.stringify(orders));
    } catch (e) {
      console.warn("Could not save orders to localStorage", e);
    }
  }, [orders]);

  const createOrder = (order: OrderRecord) => {
    setOrders((prev) => [order, ...prev]);
  };

  const getOrderById = (orderId: string): OrderRecord | undefined => {
    // Case-insensitive match, stripping # if present
    const cleanId = orderId.replace(/^#/, "").trim().toLowerCase();
    return orders.find(
      (o) => o.orderId.replace(/^#/, "").trim().toLowerCase() === cleanId
    );
  };

  const getLatestOrder = (): OrderRecord | undefined => {
    return orders[0];
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        createOrder,
        getOrderById,
        getLatestOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
}
