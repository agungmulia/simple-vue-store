import { reactive, computed, watch } from "vue";
import type { Product } from "../types";

type CartItem = Product & { quantity: number };

const savedCart = localStorage.getItem("cart");
const state = reactive({
  items: savedCart ? (JSON.parse(savedCart) as CartItem[]) : ([] as CartItem[]),
});

export function useCart() {
  const addToCart = (product: Product) => {
    const existing = state.items.find((p) => p.id === product.id);
    if (existing) {
      existing.quantity++;
    } else {
      state.items.push({ ...product, quantity: 1 });
    }
  };

  const removeFromCart = (id: number) => {
    const index = state.items.findIndex((p) => p.id === id);
    if (index !== -1) state.items.splice(index, 1);
  };

  const clearCart = () => {
    state.items.length = 0;
  };

  const updateQuantity = (id: number, quantity: number) => {
    const item = state.items.find((p) => p.id === id);
    if (item) {
      if (quantity <= 0) {
        removeFromCart(id);
      } else {
        item.quantity = quantity;
      }
    }
  };

  const totalCount = computed(() =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  const totalPrice = computed(() =>
    state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  watch(
    () => state.items,
    (newCart) => {
      localStorage.setItem("cart", JSON.stringify(newCart));
    },
    { deep: true }
  );

  return {
    state,
    addToCart,
    removeFromCart,
    clearCart,
    updateQuantity,
    totalCount,
    totalPrice,
  };
}
