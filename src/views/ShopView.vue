<template>
  <div v-if="loading" class="flex justify-center items-center py-20">
    <svg
      class="animate-spin h-8 w-8 text-gray-800"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
      ></path>
    </svg>
  </div>
  <div v-else>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Shop</h1>
        <span class="text-gray-600">Browse and purchase products</span>
      </div>
    </div>

    <div class="flex items-center mb-6 gap-x-4">
      <div
        class="flex items-center border rounded border-gray-200 px-3 py-2 w-full focus-within:border-gray-800 focus-within:ring-2 focus-within:ring-gray-800"
      >
        <MagnifyingGlassIcon class="w-5 h-5 text-gray-400" />
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search Products..."
          class="flex-grow ml-2 outline-none text-black focus:border-gray-800"
        />
      </div>
      <div class="relative w-full max-w-xs">
        <Listbox v-model="selected">
          <ListboxButton
            class="w-full border border-gray-300 rounded p-2 text-left cursor-pointer focus:border-gray-800 focus:ring-2 focus:ring-gray-800 focus:outline-none"
          >
            {{ selected.label }}
          </ListboxButton>

          <ListboxOptions
            class="absolute z-10 mt-1 w-full border py-2 border-gray-300 rounded bg-white shadow max-h-60 overflow-auto"
          >
            <ListboxOption
              v-for="option in categories"
              :key="option.value"
              :value="option"
              class="select-none p-2 mx-2 hover:bg-gray-200 rounded-xl"
            >
              {{ option.label }}
            </ListboxOption>
          </ListboxOptions>
        </Listbox>
      </div>
      <div class="relative w-full max-w-xs">
        <Listbox v-model="selectedSort">
          <ListboxButton
            class="w-full border border-gray-300 rounded p-2 text-left cursor-pointer focus:border-gray-800 focus:ring-2 focus:ring-gray-800 focus:outline-none"
          >
            {{ selectedSort.name }}
          </ListboxButton>
          <ListboxOptions
            class="absolute z-10 mt-1 w-full border py-2 border-gray-300 rounded bg-white shadow max-h-60 overflow-auto"
          >
            <ListboxOption
              v-for="option in sortOptions"
              :key="option.id"
              :value="option"
              class="select-none p-2 mx-2 hover:bg-gray-200 rounded-xl"
            >
              {{ option.name }}
            </ListboxOption>
          </ListboxOptions>
        </Listbox>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="border rounded p-4 border-gray-200 relative"
      >
        <span
          v-if="product.discountPercentage"
          class="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded"
        >
          -{{ Math.round(product.discountPercentage) }}%
        </span>

        <img :src="product.thumbnail" alt="" class="w-full object-cover mb-2" />
        <h2 class="font-semibold text-x line-clamp-1">
          {{ product.title }}
        </h2>
        <p class="text-gray-500 text-sm mb-2 line-clamp-2">
          {{ product.description }}
        </p>

        <div class="flex justify-between items-center mb-4 text-2xl">
          <p class="font-bold">${{ product.price }}</p>
          <p class="text-gray-600 flex items-center gap-x-1">
            <StarIcon class="w-5 h-5 text-yellow-300" />
            {{ product.rating }}
          </p>
        </div>

        <div class="flex items-center justify-between mb-4">
          <span
            class="bg-gray-100 py-0.5 px-2 rounded-4xl font-medium text-sm"
            >{{ capitalizeFirst(product.tags[0]) }}</span
          >
          <span class="text-gray-600"> {{ product.stock }} in stock</span>
        </div>

        <button
          @click="handleAddToCart(product)"
          class="bg-gray-900 w-full text-white rounded-lg py-2 flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-800"
        >
          <ShoppingCartIcon class="h-5 w-5" />
          Add to Cart
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import type { Category, Product } from "../types";
import { StarIcon, MagnifyingGlassIcon } from "@heroicons/vue/24/solid";
import { ShoppingCartIcon } from "@heroicons/vue/24/outline";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import { useCart } from "../composables/useCart";
import { useToasts } from "../composables/useToasts.ts";
const { showToast } = useToasts();

const { addToCart } = useCart();

const handleAddToCart = (product: Product) => {
  addToCart(product);
  showToast(
    "Add to cart success",
    `You can see it on checkout page`,
    "success"
  );
};
const products = ref<Product[]>([]);

const searchQuery = ref("");

const sortOptions = [
  { id: "default", name: "Default" },
  { id: "name-asc", name: "Name A-Z" },
  { id: "price-asc", name: "Price: Low to High" },
  { id: "price-desc", name: "Price: High to Low" },
  { id: "rating-desc", name: "Highest Rated" },
];
const selectedSort = ref(sortOptions[0]);

const capitalizeFirst = (text: string) => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const filteredProducts = computed(() => {
  let result = products.value.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.description
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase());

    const matchesCategory =
      selected.value.value === "all" ||
      product.tags.some(
        (tag) => tag.toLowerCase() === selected.value.value.toLowerCase()
      );

    return matchesSearch && matchesCategory;
  });

  switch (selectedSort.value.id) {
    case "name-asc":
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "price-asc":
      result = [...result].sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result = [...result].sort((a, b) => b.price - a.price);
      break;
    case "rating-desc":
      result = [...result].sort((a, b) => b.rating - a.rating);
      break;
  }

  return result;
});

const categories = ref<{ value: string; label: string }[]>([]);
const selected = ref<{ value: string; label: string }>({
  value: "all",
  label: "All Categories",
});

const loading = ref(true);

onMounted(async () => {
  loading.value = true;
  try {
    const token = localStorage.getItem("accessToken");

    const [productsRes, categoriesRes] = await Promise.all([
      axios.get<{ products: Product[] }>("https://dummyjson.com/products", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get<Category[]>("https://dummyjson.com/products/categories", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    products.value = productsRes.data.products;

    categories.value = [
      { value: "all", label: "All Categories" },
      ...categoriesRes.data.map((category) => ({
        value: category.name,
        label: category.name.charAt(0).toUpperCase() + category.name.slice(1),
      })),
    ];

    selected.value = categories.value[0];
  } catch (err) {
    showToast("Load Failed", "Could not fetch products", "error");
  } finally {
    loading.value = false;
  }
});
</script>
