import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authApi } from '@/api/rest/auth.api';
import type { User, LoginDto, RegisterDto } from '@/types';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const loading = ref(false);

  const isLoggedIn = computed(() => !!user.value);
  const isAdmin = computed(() => user.value?.role === 'admin');

  async function fetchMe(): Promise<void> {
    try {
      loading.value = true;
      user.value = await authApi.me();
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 401) {
        user.value = null;
      } else {
        throw err;
      }
    } finally {
      loading.value = false;
    }
  }

  async function login(dto: LoginDto): Promise<void> {
    loading.value = true;
    try {
      user.value = await authApi.login(dto);
      const { default: router } = await import('@/router');
      await router.push('/');
    } finally {
      loading.value = false;
    }
  }

  async function logout(): Promise<void> {
    loading.value = true;
    try {
      await authApi.logout();
    } finally {
      user.value = null;
      loading.value = false;
      const { useLibraryStore } = await import('@/stores/library.store');
      useLibraryStore().reset();
      const { default: router } = await import('@/router');
      await router.push('/login');
    }
  }

  async function register(dto: RegisterDto): Promise<User> {
    loading.value = true;
    try {
      return await authApi.register(dto);
    } finally {
      loading.value = false;
    }
  }

  return { user, loading, isLoggedIn, isAdmin, fetchMe, login, logout, register };
});
