<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useSSE } from '@/composables/useSSE'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

const authStore = useAuthStore()

onMounted(async () => {
  await authStore.fetchMe()
  useSSE()
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <AppHeader />
    <main class="flex-1 container mx-auto px-4 py-6">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>
