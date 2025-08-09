<template>
  <div v-if="orders.state.orders.length !== 0">
    <h1 class="text-2xl font-bold mb-4">Order History</h1>
    <div v-if="orders.state.orders.length === 0">No orders found.</div>

    <div
      v-for="order in orders.state.orders"
      :key="order.id"
      class="mb-6 border border-gray-200 p-4 rounded"
    >
      <span class="font-semibold text-xl"
        >Order #{{ order.id }}
        <span class="bg-green-500 text-white text-xs px-2 py-1 rounded-xl"
          >completed</span
        ></span
      >
      <div class="flex justify-between items-center">
        <div class="flex gap-4">
          <p class="font-semibold flex items-center text-gray-500 gap-1">
            <CalendarIcon class="h-4 w-4" />
            {{ new Date(order.date).toLocaleDateString() }}
          </p>
          <p class="font-semibold flex items-center text-gray-500 gap-1">
            <CurrencyDollarIcon class="h-4 w-4" />
            {{ order.total.toFixed(2) }}
          </p>
          <p class="font-semibold flex items-center text-gray-500 gap-1">
            <CubeIcon class="h-4 w-4" />
            {{ order.products.length }} Items
          </p>
        </div>
        <button
          @click="openOrder(order)"
          class="border border-gray-200 rounded-lg flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-200 duration-300"
        >
          <EyeIcon class="h-4 w-4" />
          <span> Details </span>
        </button>
      </div>
      <div
        v-for="item in order.products"
        :key="item.id"
        class="flex justify-between mt-2"
      >
        <img
          :src="item.thumbnail"
          alt=""
          class="w-15 h-15 object-cover rounded"
        />
      </div>
    </div>
  </div>
  <div class="w-full flex items-center justify-center text-center" v-else>
    <div class="flex flex-col items-center gap-2">
      <CubeIcon class="h-40 w-40 text-gray-600" />
      <span class="text-2xl font-bold">No orders yet</span>
      <span class="text-gray-400 mb-4"
        >Your order history will appear here</span
      >
    </div>
  </div>

  <OrderDetailsModal
    :show="showModal"
    :order="selectedOrder"
    @close="showModal = false"
  />
</template>

<script setup>
import { useOrders } from "../composables/useOrders.ts";
import OrderDetailsModal from "../components/OrderDetailsModal.vue";
import {
  CubeIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  EyeIcon,
} from "@heroicons/vue/24/outline";
import { ref } from "vue";

const showModal = ref(false);
const selectedOrder = ref(null);

function openOrder(order) {
  selectedOrder.value = order;
  showModal.value = true;
}

const orders = useOrders();
</script>
