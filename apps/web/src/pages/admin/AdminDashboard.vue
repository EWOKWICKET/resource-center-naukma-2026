<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

    <!-- Loading skeleton -->
    <div v-if="loading" class="grid grid-cols-3 gap-4 mb-8">
      <div
        v-for="i in 3"
        :key="i"
        class="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-pulse"
      >
        <div class="h-4 bg-gray-200 rounded w-2/3 mb-3" />
        <div class="h-8 bg-gray-200 rounded w-1/3" />
      </div>
    </div>

    <!-- Stats cards -->
    <div v-else-if="stats" class="grid grid-cols-3 gap-4 mb-8">
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <p class="text-sm text-gray-500 mb-1">Total Books</p>
        <p class="text-3xl font-bold text-gray-900">{{ stats.totalBooks }}</p>
      </div>
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <p class="text-sm text-gray-500 mb-1">Active Books</p>
        <p class="text-3xl font-bold text-green-600">{{ stats.activeBooks }}</p>
      </div>
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <p class="text-sm text-gray-500 mb-1">Inactive Books</p>
        <p class="text-3xl font-bold text-red-500">{{ stats.inactiveBooks }}</p>
      </div>
    </div>

    <div v-else-if="fetchError" class="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
      Failed to load stats: {{ fetchError }}
    </div>

    <!-- Actions -->
    <div class="flex gap-4">
      <RouterLink
        to="/admin/books"
        class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Manage Books
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gqlClient } from '@/api/graphql/client'

interface AdminStats {
  totalBooks: number
  activeBooks: number
  inactiveBooks: number
}

const GET_ADMIN_STATS = `
  query GetAdminStats {
    adminStats {
      totalBooks
      activeBooks
      inactiveBooks
    }
  }
`

const stats = ref<AdminStats | null>(null)
const loading = ref(false)
const fetchError = ref<string | null>(null)

onMounted(async () => {
  loading.value = true
  fetchError.value = null
  try {
    const data = await gqlClient.request<{ adminStats: AdminStats }>(GET_ADMIN_STATS)
    stats.value = data.adminStats
  } catch (err: unknown) {
    fetchError.value = (err as Error)?.message ?? 'Unknown error'
  } finally {
    loading.value = false
  }
})
</script>
