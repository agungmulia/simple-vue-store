<template>
  <div v-if="cart.state.items.length !== 0">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold mb-1">Shopping Cart</h1>
        <p class="text-gray-500 mb-4">
          {{ cart.state.items.length }} item<span
            v-if="cart.state.items.length > 1"
            >s</span
          >
          in your cart
        </p>
      </div>
      <button
        @click="cart.clearCart"
        class="bg-gray-800 p-2 text-white rounded-lg hover:bg-gray-700 duration-300 flex items-center gap-4 cursor-pointer"
      >
        <TrashIcon class="h-4 w-4 text-white" />

        Clear Cart
      </button>
    </div>
    <!-- Cart List -->
    <div class="md:flex gap-4">
      <div class="md:w-2/3">
        <div
          v-for="item in cart.state.items"
          :key="item.id"
          class="flex items-center justify-between border border-gray-200 p-3 gap-4 mb-3 rounded"
        >
          <!-- Product Info -->
          <div class="flex items-center gap-4">
            <img
              :src="item.thumbnail"
              alt=""
              class="w-20 h-20 object-cover rounded"
            />
            <div>
              <div class="font-semibold">{{ item.title }}</div>
              <div class="font-bold text-xl">${{ item.price }}</div>
            </div>
          </div>

          <!-- Quantity controls -->
          <div class="flex items-center gap-2">
            <button
              @click="cart.updateQuantity(item.id, item.quantity - 1)"
              :disabled="item.quantity <= 1"
              class="border px-2 rounded border-gray-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 disabled:hover:bg-transparent"
            >
              -
            </button>

            <span class="min-w-[2rem] text-center">{{ item.quantity }}</span>

            <button
              @click="cart.updateQuantity(item.id, item.quantity + 1)"
              class="border px-2 rounded border-gray-200 cursor-pointer hover:bg-gray-200"
            >
              +
            </button>
          </div>

          <!-- Price + Remove -->
          <div class="flex flex-col items-center">
            <span class="font-bold">
              ${{ (item.quantity * item.price).toFixed(2) }}
            </span>
            <button
              @click="cart.removeFromCart(item.id)"
              class="cursor-pointer"
            >
              <TrashIcon class="h-4 w-4 text-red-500" />
            </button>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="md:w-1/3">
        <div class="rounded border p-4 border-gray-200">
          <div class="text-xl font-semibold mb-3">Order Summary</div>

          <div class="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>${{ subtotal.toFixed(2) }}</span>
          </div>

          <div class="flex justify-between mb-2">
            <span>Shipping</span>
            <span class="text-green-600">Free</span>
          </div>

          <div class="flex justify-between mb-2">
            <span>Tax (10%)</span>
            <span>${{ tax.toFixed(2) }}</span>
          </div>

          <hr class="my-2 text-gray-200" />

          <div class="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>${{ total.toFixed(2) }}</span>
          </div>

          <button
            @click="$router.push('/checkout')"
            Proceed
            to
            Checkout
            class="w-full bg-gray-800 text-white py-2 rounded mt-4 hover:bg-gray-700 duration-300 cursor-pointer"
          >
            Proceed to Checkout
          </button>
          <router-link
            to="/shop"
            class="w-full block text-center border border-gray-300 py-2 rounded mt-2 hover:bg-gray-100 cursor-pointer"
          >
            Continue Shopping
          </router-link>
        </div>
      </div>
    </div>
  </div>
  <div class="w-full flex items-center justify-center text-center" v-else>
    <div class="flex flex-col items-center gap-2">
      <ShoppingBagIcon class="h-40 w-40 text-gray-600" />
      <span class="text-2xl font-bold">Your Cart is Empty</span>
      <span class="text-gray-400 mb-4">Add some products to get started</span>
      <router-link
        to="/shop"
        class="text-white bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-600 cursor-pointer duration-300"
      >
        Continue Shopping
      </router-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useCart } from "../composables/useCart";
import { ShoppingBagIcon, TrashIcon } from "@heroicons/vue/24/outline";

const cart = useCart();

const subtotal = computed(() =>
  cart.state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

const taxRate = 0.1;
const tax = computed(() => subtotal.value * taxRate);

const total = computed(() => subtotal.value + tax.value);
</script>
