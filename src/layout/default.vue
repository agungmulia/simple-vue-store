<template>
  <div class="flex min-h-screen">
    <!-- Sidebar -->
    <aside
      class="bg-gray-50 fixed top-0 left-0 z-20 h-screen text-black overflow-y-auto transition-all duration-300 flex flex-col"
      :class="isSidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full'"
    >
      <!-- Header -->
      <h1 class="text-xl font-semibold mb-6 flex gap-2 px-6 pt-6 line-clamp-1">
        <ShoppingBagIcon class="h-6 w-6" />
        DummyJSON Store
      </h1>

      <!-- Navigation -->
      <span class="text-xs font-semibold text-gray-400 px-4"> Navigation </span>
      <nav class="mt-2 flex-1">
        <ul>
          <li v-for="item in navItems" :key="item.path">
            <router-link
              :to="item.path"
              class="flex items-center gap-2 hover:text-gray-700 hover:bg-gray-100 px-4 py-2 text-sm"
            >
              <component :is="item.icon" class="h-5 w-5" />
              {{ item.label }}
              <span
                v-if="item.label === 'Cart' && totalCount > 0"
                class="ml-auto bg-gray-200 text-black text-xs font-bold px-2 py-0.5 rounded-full"
              >
                {{ totalCount }}
              </span>
            </router-link>
          </li>
        </ul>
      </nav>

      <div class="mt-auto">
        <Menu as="div" class="relative w-full text-left">
          <MenuButton
            class="w-full flex items-center justify-between gap-2 rounded p-2 hover:bg-gray-100 cursor-pointer focus:outline-none"
          >
            <div class="flex items-center gap-2">
              <img
                v-if="userImage"
                :src="userImage"
                alt="Profile"
                class="h-6 w-6 rounded-full object-cover"
              />
              <span class="font-semibold text-gray-800">{{
                userName || "Guest"
              }}</span>
            </div>
            <ChevronUpDownIcon class="h-5 w-5 text-gray-600" />
          </MenuButton>

          <MenuItems
            class="absolute left-0 right-0 bottom-full mb-2 bg-white border border-gray-300 rounded shadow-md overflow-hidden z-30 focus:outline-none"
          >
            <MenuItem v-slot="{ active }">
              <router-link
                to="/account"
                class="block px-4 py-2 text-gray-700"
                :class="{ 'bg-gray-100': active }"
              >
                My Account
              </router-link>
            </MenuItem>

            <MenuItem v-slot="{ active }">
              <router-link
                to="/profile"
                class="block px-4 py-2 text-gray-700"
                :class="{ 'bg-gray-100': active }"
              >
                Profile
              </router-link>
            </MenuItem>

            <MenuItem v-slot="{ active }">
              <button
                @click="logout"
                class="w-full text-left px-4 py-2 text-gray-700"
                :class="{ 'bg-gray-100': active }"
              >
                Logout
              </button>
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
    </aside>
    <!-- Overlay for mobile when sidebar is open -->
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 bg-black opacity-70 z-10 md:hidden"
      @click="toggleSidebar"
    ></div>

    <!-- Main Content -->
    <div
      class="flex-1 flex flex-col transition-all duration-300"
      :class="isSidebarOpen ? 'md:ml-64' : 'md:ml-0'"
    >
      <header
        class="bg-white shadow p-4 flex items-center transition-all duration-300"
      >
        <button
          class="p-2 rounded hover:bg-gray-200 cursor-pointer"
          @click="toggleSidebar"
        >
          <Bars3Icon class="h-6 w-6" />
        </button>
      </header>

      <main class="p-8 flex-1 overflow-y-auto">
        <router-view />
      </main>
    </div>

    <Toast ref="toastRef" />
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Bars3Icon } from "@heroicons/vue/24/solid";
import {
  ShoppingBagIcon,
  CubeIcon,
  BuildingStorefrontIcon,
  ShoppingCartIcon,
  ClockIcon,
} from "@heroicons/vue/24/outline";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import Toast from "../components/Toast.vue";
import { useCart } from "../composables/useCart";

const { totalCount } = useCart();

const isSidebarOpen = ref(true);
const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: BuildingStorefrontIcon },
  { path: "/products", label: "Products", icon: CubeIcon },
  { path: "/shop", label: "Shop", icon: ShoppingBagIcon },
  { path: "/cart", label: "Cart", icon: ShoppingCartIcon },
  { path: "/order", label: "Order", icon: ClockIcon },
];

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
}

const userImage = ref<string | null>(null);
const userName = ref<string>("");

onMounted(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const user = JSON.parse(storedUser);
    userImage.value = user.image;
    userName.value = `${user.firstName} ${user.lastName}`;
  }
});

function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  window.location.href = "/login";
}
</script>
