import { reactive, watch } from "vue";
import type { Product } from "../types";

type ShippingInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
};

type Order = {
  id: string;
  date: string;
  products: Product[];
  total: number;
  shipping: ShippingInfo;
};

const savedOrders = localStorage.getItem("orders");
const state = reactive({
  orders: savedOrders ? (JSON.parse(savedOrders) as Order[]) : ([] as Order[]),
});

export function useOrders() {
  const addOrder = (order: Order) => {
    state.orders.unshift(order); 
  };

  const clearOrders = () => {
    state.orders.length = 0;
  };

  watch(
    () => state.orders,
    (newOrders) => {
      localStorage.setItem("orders", JSON.stringify(newOrders));
    },
    { deep: true }
  );

  return {
    state,
    addOrder,
    clearOrders,
  };
}
