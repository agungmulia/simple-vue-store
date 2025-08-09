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
        <h1 class="text-2xl font-bold">Products</h1>
        <span class="text-gray-600">Manage your product inventory</span>
      </div>
      <button
        @click="Add()"
        class="flex text-white bg-gray-800 p-2 gap-x-4 items-center rounded-lg cursor-pointer hover:bg-gray-700 duration-300"
      >
        <PlusIcon class="w-4 h-4 text-gray-00" />

        Add Product
      </button>
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
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="border rounded p-4 border-gray-200"
      >
        <img :src="product.thumbnail" alt="" class="w-full object-cover mb-2" />
        <h2 class="font-semibold text-x line-clamp-1">
          {{ product.title }}
        </h2>
        <p class="text-gray-500 text-sm mb-2 line-clamp-2">
          {{ product.description }}
        </p>
        <div class="flex justify-between items-center mb-4">
          <p class="font-bold">${{ product.price }}</p>

          <p class="text-gray-600 flex items-center gap-x-1">
            <StarIcon class="w-5 h-5 text-yellow-300" />
            {{ product.rating }}
          </p>
        </div>
        <div class="flex items-center justify-between mb-4">
          <span
            class="bg-gray-100 py-0.5 px-2 rounded-4xl font-medium text-sm"
            >{{
              product.tags?.length ? capitalizeFirst(product.tags[0]) : "No Tag"
            }}</span
          >
          <span class="text-gray-600"> Stock: {{ product.stock }} </span>
        </div>
        <button
          @click="edit(product)"
          class="border border-gray-200 p-2 w-fit rounded-lg cursor-pointer hover:bg-gray-100 mr-2"
        >
          <PencilSquareIcon class="w-5 h-5 text-gray-00" />
        </button>
        <button
          @click="deleteProduct(product.id)"
          class="border border-gray-200 p-2 w-fit rounded-lg cursor-pointer hover:bg-gray-100"
        >
          <TrashIcon class="w-5 h-5 text-gray-00" />
        </button>
      </div>
    </div>

    <!-- Modal -->
    <ProductModal
      v-model="isEditModalOpen"
      :product="selectedProduct"
      :key="selectedProduct ? selectedProduct.id : 'new'"
      @save="saveProduct"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import type { Category, Product } from "../types";
import {
  StarIcon,
  PlusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/vue/24/solid";
import { PencilSquareIcon, TrashIcon } from "@heroicons/vue/24/outline";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import ProductModal from "../components/ProductModal.vue";
import { useToasts } from "../composables/useToasts";

const { showToast } = useToasts();

const products = ref<Product[]>([]);
const isEditModalOpen = ref(false);
const selectedProduct = ref<Product | null>(null);
const searchQuery = ref("");

const edit = (product: Product) => {
  selectedProduct.value = product;
  isEditModalOpen.value = true;
};

const Add = () => {
  selectedProduct.value = null;
  isEditModalOpen.value = true;
};

const capitalizeFirst = (text: string) => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const filteredProducts = computed(() => {
  return products.value.filter((product) => {
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

const saveProduct = async (product: Product) => {
  const token = localStorage.getItem("accessToken");

  try {
    if (product.id) {
      const res = await axios.put(
        `https://dummyjson.com/products/${product.id}`,
        product,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const idx = products.value.findIndex((p) => p.id === product.id);
      if (idx !== -1) products.value[idx] = res.data;
      showToast(
        "Product Updated",
        `${product.title} has been updated`,
        "success"
      );
    } else {
      const res = await axios.post(
        "https://dummyjson.com/products/add",
        product,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      products.value.push(res.data);
      showToast("Product Added", `${product.title} has been added`, "success");
    }
  } catch (err) {
    showToast("Action Failed", "Could not save product", "error");
  }
};

const deleteProduct = async (id: number) => {
  const token = localStorage.getItem("accessToken");

  try {
    const product = products.value.find((p) => p.id === id);
    await axios.delete(`https://dummyjson.com/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    products.value = products.value.filter((p) => p.id !== id);
    showToast(
      "Product Deleted",
      `${product?.title || "Item"} has been deleted`,
      "success"
    );
  } catch (err) {
    showToast("Delete Failed", "Could not delete product", "error");
  }
};
</script>
