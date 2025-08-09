<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-semibold">Dashboard</h1>
      <p class="text-gray-500">Overview of your e-commerce metrics</p>
    </div>
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      <div class="p-4 border rounded border-gray-200">
        <div class="flex justify-between">
          <h2 class="text-sm font-semibold">Total Products</h2>
          <CubeIcon class="h-4 w-5" />
        </div>
        <p class="text-2xl font-bold">{{ products?.total || 0 }}</p>
        <p class="text-gray-500 text-xs">Available in store</p>
      </div>

      <div class="p-4 border rounded border-gray-200">
        <div class="flex justify-between">
          <h2 class="text-sm font-semibold">Total Users</h2>
          <UsersIcon class="h-4 w-5" />
        </div>
        <p class="text-2xl font-bold">{{ users?.total || 0 }}</p>
        <p class="text-gray-500 text-xs">Registered customers</p>
      </div>

      <div class="p-4 border rounded border-gray-200">
        <div class="flex justify-between">
          <h2 class="text-sm font-semibold">Active Carts</h2>
          <ShoppingCartIcon class="h-4 w-5" />
        </div>
        <p class="text-2xl font-bold">{{ carts?.total }}</p>
        <p class="text-gray-500 text-xs">Items in carts</p>
      </div>

      <div class="p-4 border rounded border-gray-200">
        <div class="flex justify-between">
          <h2 class="text-sm font-semibold">Total Revenue</h2>
          <ArrowTrendingUpIcon class="h-4 w-5" />
        </div>
        <p class="text-2xl font-bold">${{ totalRevenue.toFixed(2) }}</p>
        <p class="text-gray-500 text-xs">From all carts</p>
      </div>
    </div>

    <!-- Chart -->
    <div class="grid md:grid-cols-2 gap-4">
      <div class="p-4 border rounded border-gray-200">
        <div class="flex justify-between">
          <h2 class="text-lg font-semibold line-clamp-1">
            Products by Category
          </h2>
        </div>
        <p class="text-gray-500 text-xs">
          Distribution of products across categories
        </p>
        <div class="w-full h-80">
          <Bar :data="barData" :options="barOptions" />
        </div>
      </div>
      <div class="p-4 border rounded border-gray-200">
        <div class="flex justify-between">
          <h2 class="text-lg font-semibold line-clamp-1">
            Category Distribution
          </h2>
        </div>
        <p class="text-gray-500 text-xs">
          Pie chart view of product categories
        </p>
        <div class="w-full flex justify-center mt-4">
          <div class="h-80 w-80">
            <Pie :data="pieData" :options="pieOptions" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import axios from "axios";

import {
  ArrowTrendingUpIcon,
  CubeIcon,
  ShoppingCartIcon,
  UsersIcon,
} from "@heroicons/vue/24/outline";
import type { Cart, Product, User } from "../types/index.ts";
import { useToasts } from "../composables/useToasts.ts";
const { showToast } = useToasts();

import { Bar, Pie } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
);

const pieOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const total = context.dataset.data.reduce(
            (sum: number, val: number) => sum + val,
            0
          );
          const value = context.parsed;
          const percentage = ((value / total) * 100).toFixed(2) + "%";
          return `${context.label}: ${percentage}`;
        },
      },
    },
  },
};

const barOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: false },
  },
};
const products = ref<{ limit: number; products: Product[]; total: number }>({
  limit: 0,
  products: [],
  total: 0,
});
const users = ref<{ limit: number; users: User[]; total: number }>({
  limit: 0,
  users: [],
  total: 0,
});
const carts = ref<{ limit: number; carts: Cart[]; total: number }>({
  limit: 0,
  carts: [],
  total: 0,
});

const totalRevenue = computed(() =>
  carts.value?.carts.reduce((sum, cart) => sum + cart.total, 0)
);

const categories = ["beauty", "fragrances", "furniture", "groceries"];

const categoryStats = computed(() => {
  const counts = categories.map(
    (cat) => products.value.products.filter((p) => p.category === cat).length
  );

  const total = products.value.products.length || 1;
  const percentages = counts.map((count) => (count / total) * 100);

  return { counts, percentages };
});

const barData = computed(() => ({
  labels: categories,
  datasets: [
    {
      label: "Products",
      backgroundColor: "rgba(106, 90, 205, 0.6)",
      data: categoryStats.value.counts,
    },
  ],
}));

const pieData = computed(() => {
  const counts = categoryStats.value.counts;
  return {
    labels: categories,
    datasets: [
      {
        backgroundColor: ["#36A2EB", "#4BC0C0", "#FFCE56", "#FF6384"],
        data: counts,
      },
    ],
  };
});

onMounted(async () => {
  try {
    const token = localStorage.getItem("accessToken");

    const [productsRes, userRes, cartRes] = await Promise.all([
      axios.get<{ limit: number; products: Product[]; total: number }>(
        "https://dummyjson.com/products?limit=100",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      ),
      axios.get<{ limit: number; users: User[]; total: number }>(
        "https://dummyjson.com/users",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      ),
      axios.get<{ limit: number; carts: Cart[]; total: number }>(
        "https://dummyjson.com/carts",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      ),
    ]);

    products.value = productsRes.data;
    users.value = userRes.data;
    carts.value = cartRes.data;
  } catch (err) {
    showToast("Load Failed", "Could not fetch products", "error");
  }
});
</script>

<style scoped>
.chart-container {
  height: 300px;
}
</style>
