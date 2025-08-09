<template>
  <Transition
    enter-active-class="duration-100 ease-out"
    enter-from-class="opacity-0 "
    enter-to-class="opacity-100 "
    leave-active-class="duration-150 ease-in"
    leave-from-class="opacity-100 "
    leave-to-class="opacity-0 "
  >
    <div
      v-if="modelValue"
      @click="$emit('update:modelValue', false)"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 duration-300"
    >
      <div
        class="bg-white p-6 rounded-lg w-full max-w-md shadow-lg text-gray-800"
        @click.stop
      >
        <div class="mb-4">
          <h2 class="text-lg font-semibold">
            {{ localProduct.id ? "Edit" : "Add" }} Product
          </h2>
          <span class="text-gray-500"
            >{{ localProduct.id ? "Edit" : "Add" }} Product Information</span
          >
        </div>

        <label class="block text-sm font-medium text-gray-600 mb-1"
          >Title</label
        >
        <input
          v-model="localProduct.title"
          type="text"
          class="border p-2 rounded w-full mb-3 border-gray-200"
        />

        <label class="block text-sm font-medium mb-1">Description</label>
        <textarea
          v-model="localProduct.description"
          class="border p-2 rounded w-full mb-3 border-gray-200"
          rows="3"
        ></textarea>

        <div class="flex gap-4 mb-4">
          <div class="w-1/2">
            <label class="block text-sm font-medium mb-1">Price</label>
            <input
              v-model.number="localProduct.price"
              type="number"
              class="border p-2 rounded w-full border-gray-200"
            />
          </div>
          <div class="w-1/2">
            <label class="block text-sm font-medium mb-1">Stock</label>
            <input
              v-model.number="localProduct.stock"
              type="number"
              class="border p-2 rounded w-full border-gray-200"
            />
          </div>
        </div>

        <div class="flex justify-end mt-8">
          <button
            @click="saveChanges"
            class="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 cursor-pointer"
          >
            {{ localProduct.id ? "Edit" : "Add" }} Product
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { Product } from "../types";

const props = defineProps<{
  modelValue: boolean;
  product: Product | null;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "save", value: Product): void;
}>();

const defaultProduct: Product = {
  id: 0,
  title: "",
  description: "",
  price: 0,
  thumbnail: "",
  rating: 0,
  stock: 0,
  discountPercentage: 0,
  tags: [],
};

const localProduct = ref<Product>({ ...defaultProduct });

watch(
  () => props.product,
  (newProduct) => {
    if (newProduct) {
      localProduct.value = { ...newProduct };
    }
  },
  { immediate: true }
);

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen && !props.product) {
      localProduct.value = { ...defaultProduct };
    }
  }
);

const saveChanges = () => {
  emit("save", localProduct.value);
  emit("update:modelValue", false);
};
</script>
