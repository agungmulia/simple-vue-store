<template>
  <div class="fixed bottom-4 right-4 z-50 space-y-3 w-80">
    <transition-group
      name="toast"
      tag="div"
      enter-active-class="transform transition duration-300 ease-out"
      enter-from-class="translate-x-10 opacity-0"
      enter-to-class="translate-x-0 opacity-100"
      leave-active-class="transform transition duration-300 ease-in"
      leave-from-class="translate-x-0 opacity-100"
      leave-to-class="translate-x-10 opacity-0"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="p-4 rounded-lg shadow-lg text-white"
        :class="{
          'bg-green-500': toast.type === 'success',
          'bg-red-500': toast.type === 'error',
          'bg-gray-500': toast.type === 'info',
        }"
      >
        <p class="font-semibold">{{ toast.title }}</p>
        <p class="text-sm opacity-90">{{ toast.message }}</p>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { useToasts } from "../composables/useToasts";
const { toasts } = useToasts();
</script>
