<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="bg-white p-8 rounded-lg shadow-sm">
      <h2 class="text-2xl text-black font-semibold text-center mb-4">
        Sign in
      </h2>
      <p class="text-gray-500 text-center mb-6">
        Enter your credentials to access the e-commerce dashboard
      </p>

      <form @submit.prevent="login" class="text-start">
        <div>
          <label class="block mb-2 text-sm text-black">Username</label>
          <input
            v-model="username"
            type="text"
            class="w-full px-4 py-2 border rounded mb-4 border-gray-200 text-black"
          />
        </div>

        <label class="block mb-2 text-sm text-black">Password</label>
        <input
          v-model="password"
          type="password"
          class="w-full px-4 py-2 border rounded mb-4 border-gray-200 text-black"
        />

        <button
          type="submit"
          class="w-full bg-black text-white py-2 rounded hover:bg-gray-800 flex items-center justify-center"
          :disabled="loading"
        >
          <svg
            v-if="loading"
            class="animate-spin h-5 w-5 mr-2 text-white"
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
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <span>{{ loading ? "Signing in..." : "Sign in" }}</span>
        </button>
      </form>

      <div class="bg-blue-50 text-blue-800 p-4 mt-4 rounded text-sm text-start">
        <strong>Demo Credentials:</strong><br />
        Username: emilys<br />
        Password: emilyspass
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import axios from "axios";
import type { User } from "../types";
import { useToasts } from "../composables/useToasts.ts";
const { showToast } = useToasts();

export default defineComponent({
  setup() {
    const username = ref("");
    const password = ref("");
    const loading = ref(false);

    const login = async () => {
      loading.value = true;
      try {
        const res = await axios.post<User & { accessToken: string }>(
          "https://dummyjson.com/auth/login",
          { username: username.value, password: password.value }
        );

        localStorage.setItem("accessToken", res.data.accessToken || "");
        localStorage.setItem("user", JSON.stringify(res.data));

        showToast(
          "Login successful",
          `Welcome Back ${res.data.firstName || ""}`,
          "success"
        );
        window.location.href = "/dashboard";
      } catch (err) {
        showToast("Login Failed", "Invalid credentials", "error");
      } finally {
        loading.value = false;
      }
    };

    return { username, password, login, loading };
  },
});
</script>
