<template>
  <div>
    <div>
      <h1 class="text-3xl font-bold mb-1">Checkout</h1>
      <p class="text-gray-500 mb-4">Complete your purchase</p>
    </div>
    <div class="space-y-4 md:space-x-4 lg:flex w-full md:items-start">
      <div class="w-full">
        <form
          @submit.prevent="completeOrder"
          class="border border-gray-200 p-6 rounded-lg space-y-4"
        >
          <p class="text-xl font-semibold mb-4">Shipping Information</p>
          <!-- Shipping Info -->
          <div class="flex gap-4">
            <div class="w-full">
              <label class="block mb-2 text-xs font-medium">First Name</label>
              <input
                v-model="form.firstName"
                type="text"
                class="border p-2 w-full border-gray-200 rounded-lg"
                required
              />
            </div>
            <div class="w-full">
              <label class="block mb-2 text-xs font-medium">Last Name</label>
              <input
                v-model="form.lastName"
                type="text"
                class="border p-2 w-full border-gray-200 rounded-lg"
                required
              />
            </div>
          </div>
          <div class="flex gap-4">
            <div class="w-full">
              <label class="block mb-2 text-xs font-medium">Email</label>
              <input
                v-model="form.email"
                type="email"
                class="border p-2 w-full border-gray-200 rounded-lg"
                required
              />
            </div>
            <div class="w-full">
              <label class="block mb-2 text-xs font-medium">Phone</label>
              <input
                v-model="form.phone"
                type="tel"
                class="border p-2 w-full border-gray-200 rounded-lg"
              />
            </div>
          </div>
          <div class="w-full">
            <label class="block mb-2 text-xs font-medium">Address</label>
            <input
              v-model="form.address"
              type="tel"
              class="border p-2 w-full border-gray-200 rounded-lg"
              required
            />
          </div>
          <div class="flex gap-4">
            <div class="w-full">
              <label class="block mb-2 text-xs font-medium">City</label>
              <input
                v-model="form.city"
                type="text"
                class="border p-2 w-full border-gray-200 rounded-lg"
                required
              />
            </div>
            <div class="w-full">
              <label class="block mb-2 text-xs font-medium">State</label>
              <input
                v-model="form.state"
                type="text"
                class="border p-2 w-full border-gray-200 rounded-lg"
                required
              />
            </div>
            <div class="w-full">
              <label class="block mb-2 text-xs font-medium">ZIP Code</label>
              <input
                v-model="form.zipCode"
                type="text"
                class="border p-2 w-full border-gray-200 rounded-lg"
                required
              />
            </div>
          </div>
        </form>

        <!-- Payment Information -->
        <div class="border border-gray-200 p-6 rounded-lg space-y-4 mt-4">
          <p class="text-xl font-semibold">Payment Information</p>

          <div>
            <label class="block text-xs font-medium mb-2"
              >Cardholder Name</label
            >
            <input
              type="text"
              class="border p-2 w-full border-gray-200 rounded-lg"
            />
          </div>

          <div>
            <label class="block text-xs font-medium mb-2">Card Number</label>
            <input
              type="text"
              class="border p-2 w-full border-gray-200 rounded-lg"
              placeholder="1234 5678 9012 3456"
            />
          </div>

          <div class="flex gap-4">
            <div class="w-full">
              <label class="block text-xs font-medium mb-2">Expiry Date</label>
              <input
                type="text"
                class="border p-2 w-full border-gray-200 rounded-lg"
                placeholder="MM/YY"
              />
            </div>
            <div class="w-full">
              <label class="block text-xs font-medium mb-2">CVV</label>
              <input
                type="text"
                class="border p-2 w-full border-gray-200 rounded-lg"
                placeholder="123"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="border border-gray-200 p-6 rounded-lg w-full md:w-2/4">
        <p class="text-xl font-semibold mb-4">Order Summary</p>

        <div
          v-for="item in cart.state.items"
          :key="item.id"
          class="flex items-center justify-between mb-2"
        >
          <div class="flex items-center gap-4">
            <img
              :src="item.thumbnail"
              alt=""
              class="w-10 h-10 object-cover rounded"
            />
            <div>
              <p class="font-medium line-clamp-1">{{ item.title }}</p>
              <p class="text-sm text-gray-500">Qty: {{ item.quantity }}</p>
            </div>
          </div>
          <span>${{ item.price * item.quantity }}</span>
        </div>

        <div class="border-t border-gray-200 mt-4 pt-4">
          <div class="flex justify-between">
            <span>Subtotal</span>
            <span>${{ subtotal }}</span>
          </div>
          <div class="flex justify-between">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div class="flex justify-between">
            <span>Tax</span>
            <span>${{ tax.toFixed(2) }}</span>
          </div>

          <div class="flex justify-between font-semibold mt-2">
            <span>Total</span>
            <span>${{ total.toFixed(2) }}</span>
          </div>
        </div>

        <button
          @click="completeOrder"
          class="bg-gray-800 text-white w-full py-2 rounded mt-4 hover:bg-gray-700 duration-300 cursor-pointer"
        >
          Complete Order
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useCart } from "../composables/useCart.ts";
import { useOrders } from "../composables/useOrders.ts";
import router from "../router/index.ts";
import { useToasts } from "../composables/useToasts";
const { showToast } = useToasts();

const cart = useCart();
const orders = useOrders();
const storedUser = localStorage.getItem("user");

const subtotal = computed(() =>
  cart.state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

const taxRate = 0.1;
const tax = computed(() => subtotal.value * taxRate);
const total = computed(() => subtotal.value + tax.value);
const user = JSON.parse(storedUser);

const form = ref({
  firstName: user?.firstName || "",
  lastName: user?.lastName || "",
  email: user?.email || "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
});

async function completeOrder() {
  for (const [key, value] of Object.entries(form.value)) {
    if (!value) {
      showToast(
        "Missing Information",
        `Please fill in your ${key.replace(/([A-Z])/g, " $1").toLowerCase()}.`,
        "error"
      );
      return;
    }
  }

  const user = JSON.parse(storedUser);

  try {
    const res = await fetch("https://dummyjson.com/carts/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        products: cart.state.items.map((cartData) => ({
          id: cartData.id,
          quantity: cartData.quantity,
        })),
      }),
    });

    if (!res.ok) throw new Error("Order failed");

    orders.addOrder({
      id: Date.now(),
      date: new Date().toISOString(),
      products: [...cart.state.items],
      total: total.value,
      shipping: { ...form.value },
    });

    showToast(
      "Checkout Success",
      "You can see your order in order history",
      "success"
    );
    cart.clearCart();
    router.push("/cart");
  } catch (err) {
    console.error(err);
    showToast("Error", "Something went wrong!", "error");
  }
}
</script>
