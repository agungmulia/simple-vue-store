<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50"
    @click="$emit('close')"
  >
    <div
      class="bg-white rounded-lg w-full max-w-2xl p-6 relative mx-2"
      @click.stop
    >
      <h2 class="text-lg font-semibold mb-1">Order #{{ order.id }} Details</h2>
      <p class="text-sm text-gray-500 mb-4">
        Order placed on {{ new Date(order.date).toLocaleDateString() }}
      </p>

      <div class="flex justify-between items-center mb-4">
        <div class="flex flex-col space-y-2">
          <span class="font-semibold">Order Status</span>
          <span
            class="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold"
          >
            completed
          </span>
        </div>
        <div class="flex flex-col space-y-2 items-center">
          <span class="text-xl font-bold">Total Amount</span>
          <span class="text-xl font-bold">${{ order.total.toFixed(2) }}</span>
        </div>
      </div>

      <h3 class="font-semibold mb-2">Items Ordered</h3>
      <div
        v-for="item in order.products"
        :key="item.id"
        class="flex justify-between items-center border border-gray-200 py-2 px-2 rounded-lg"
      >
        <div class="flex items-center gap-3">
          <img
            :src="item.thumbnail"
            alt=""
            class="w-12 h-12 object-cover rounded"
          />
          <div>
            <p class="font-medium">{{ item.title }}</p>
            <p class="text-sm text-gray-500">
              Quantity: {{ item.quantity }} × ${{ item.price }}
            </p>
          </div>
        </div>
        <p class="font-medium">
          ${{ (item.quantity * item.price).toFixed(2) }}
        </p>
      </div>

      <h3 class="font-medium mt-4 mb-2">Shipping Information</h3>
      <div class="bg-gray-100 p-3 rounded text-sm">
        <p class="font-medium text-lg">
          {{ order.shipping.firstName }} {{ order.shipping.lastName }}
        </p>
        <p class="font-medium text-lg">{{ order.shipping.address || "" }}</p>
        <p class="font-medium text-lg mb-2">
          {{ order.shipping.city || "" }}, {{ order.shipping.state || "" }}
          {{ order.shipping.zipCode || "" }}
        </p>
        <p class="text-gray-500">Email: {{ order.shipping.email }}</p>
        <p class="text-gray-500" v-if="order.shipping.phone">
          Phone: {{ order.shipping.phone }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  order: Object,
});

defineEmits(["close"]);
</script>
