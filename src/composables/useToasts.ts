import { ref } from "vue";

export type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  title: string;
  message: string;
  type: ToastType;
}

const toasts = ref<Toast[]>([]);

export function useToasts() {
  function showToast(title: string, message: string, type: ToastType = "info") {
    const id = Date.now();
    toasts.value.push({ id, title, message, type });

    setTimeout(() => removeToast(id), 3000);
  }

  function removeToast(id: number) {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
  }

  return {
    toasts,
    showToast,
    removeToast,
  };
}
