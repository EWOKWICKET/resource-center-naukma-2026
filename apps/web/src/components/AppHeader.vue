<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const route = useRoute()

const mobileMenuOpen = ref(false)

const isAdminRoute = computed(() => route.path.startsWith('/admin'))

const headerClass = computed(() =>
  isAdminRoute.value
    ? 'bg-gray-800 text-white shadow'
    : 'bg-white shadow'
)

const linkClass = computed(() =>
  isAdminRoute.value
    ? 'text-gray-200 hover:text-white'
    : 'text-gray-700 hover:text-brand-600'
)

const logoClass = computed(() =>
  isAdminRoute.value
    ? 'text-white font-bold text-lg'
    : 'text-brand-600 font-bold text-lg'
)

function toggleMobile() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

async function handleLogout() {
  mobileMenuOpen.value = false
  await authStore.logout()
}

const userFullName = computed(() => {
  const u = authStore.user
  if (!u) return ''
  return [u.firstName, u.lastName].filter(Boolean).join(' ') || u.email
})
</script>

<template>
  <header :class="['sticky top-0 z-50', headerClass]">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <RouterLink to="/" :class="logoClass">
          Resource Center
        </RouterLink>

        <!-- Desktop nav -->
        <nav class="hidden md:flex items-center gap-6">
          <RouterLink
            to="/"
            :class="['text-sm font-medium transition-colors', linkClass]"
          >
            Books
          </RouterLink>

          <template v-if="authStore.isAdmin">
            <RouterLink
              to="/admin"
              :class="['text-sm font-medium transition-colors', linkClass]"
            >
              Admin
            </RouterLink>
          </template>

          <template v-if="authStore.isLoggedIn">
            <span :class="['text-sm', isAdminRoute ? 'text-gray-300' : 'text-gray-600']">
              {{ userFullName }}
            </span>
            <button
              @click="handleLogout"
              :class="[
                'text-sm font-medium transition-colors',
                isAdminRoute
                  ? 'text-gray-200 hover:text-white'
                  : 'text-gray-700 hover:text-brand-600'
              ]"
            >
              Logout
            </button>
          </template>

          <template v-else>
            <RouterLink
              to="/login"
              :class="['text-sm font-medium transition-colors', linkClass]"
            >
              Login
            </RouterLink>
            <RouterLink
              to="/register"
              class="text-sm font-medium bg-brand-600 text-white px-4 py-1.5 rounded hover:bg-brand-700 transition-colors"
            >
              Register
            </RouterLink>
          </template>
        </nav>

        <!-- Mobile hamburger -->
        <button
          class="md:hidden p-2 rounded"
          :class="isAdminRoute ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-brand-600'"
          @click="toggleMobile"
          aria-label="Toggle menu"
        >
          <XMarkIcon v-if="mobileMenuOpen" class="w-6 h-6" />
          <Bars3Icon v-else class="w-6 h-6" />
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <div
      v-show="mobileMenuOpen"
      :class="['md:hidden border-t', isAdminRoute ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100']"
    >
      <div class="container mx-auto px-4 py-3 flex flex-col gap-3">
        <RouterLink
          to="/"
          :class="['text-sm font-medium transition-colors', linkClass]"
          @click="mobileMenuOpen = false"
        >
          Books
        </RouterLink>

        <template v-if="authStore.isAdmin">
          <RouterLink
            to="/admin"
            :class="['text-sm font-medium transition-colors', linkClass]"
            @click="mobileMenuOpen = false"
          >
            Admin
          </RouterLink>
        </template>

        <template v-if="authStore.isLoggedIn">
          <span :class="['text-sm', isAdminRoute ? 'text-gray-300' : 'text-gray-600']">
            {{ userFullName }}
          </span>
          <button
            @click="handleLogout"
            :class="['text-sm font-medium text-left transition-colors', linkClass]"
          >
            Logout
          </button>
        </template>

        <template v-else>
          <RouterLink
            to="/login"
            :class="['text-sm font-medium transition-colors', linkClass]"
            @click="mobileMenuOpen = false"
          >
            Login
          </RouterLink>
          <RouterLink
            to="/register"
            class="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
            @click="mobileMenuOpen = false"
          >
            Register
          </RouterLink>
        </template>
      </div>
    </div>
  </header>
</template>
