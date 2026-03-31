import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

export function requireAuth(_to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext): void {
  const authStore = useAuthStore();
  if (!authStore.isLoggedIn) {
    next('/login');
  } else {
    next();
  }
}

export function requireAdmin(_to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext): void {
  const authStore = useAuthStore();
  if (!authStore.isAdmin) {
    next('/');
  } else {
    next();
  }
}

export function guestOnly(_to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext): void {
  const authStore = useAuthStore();
  if (authStore.isLoggedIn) {
    next('/');
  } else {
    next();
  }
}
