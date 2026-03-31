import { ref, readonly } from 'vue';

interface Toast {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
}

let nextId = 0;
const toasts = ref<Toast[]>([]);

export function useToast() {
  function addToast(type: Toast['type'], message: string): void {
    const id = nextId++;
    toasts.value.push({ id, type, message });
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id);
    }, 3000);
  }

  function showSuccess(message: string): void {
    addToast('success', message);
  }

  function showError(message: string): void {
    addToast('error', message);
  }

  function showInfo(message: string): void {
    addToast('info', message);
  }

  return { toasts: readonly(toasts), showSuccess, showError, showInfo };
}
