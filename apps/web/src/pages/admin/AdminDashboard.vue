<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

    <!-- Loading skeleton -->
    <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div
        v-for="i in 4"
        :key="i"
        class="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-pulse"
      >
        <div class="h-4 bg-gray-200 rounded w-2/3 mb-3" />
        <div class="h-8 bg-gray-200 rounded w-1/3" />
      </div>
    </div>

    <!-- Stats cards -->
    <div v-else-if="stats" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <p class="text-sm text-gray-500 mb-1">Total Categories</p>
        <p class="text-3xl font-bold text-blue-600">{{ stats.totalCategories }}</p>
      </div>
    </div>

    <div v-else-if="fetchError" class="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
      Failed to load stats: {{ fetchError }}
    </div>

    <!-- Books by category -->
    <div v-if="stats && stats.booksByCategory.length" class="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">Books by Category</h2>
      </div>
      <ul class="divide-y divide-gray-100">
        <li
          v-for="item in stats.booksByCategory"
          :key="item.categoryId"
          class="flex items-center justify-between px-6 py-3"
        >
          <span class="text-gray-700">{{ item.categoryName }}</span>
          <span class="text-sm font-medium text-gray-900 bg-gray-100 px-2 py-0.5 rounded-full">
            {{ item.count }}
          </span>
        </li>
      </ul>
    </div>

    <!-- Actions -->
    <div class="flex gap-4">
      <RouterLink
        to="/admin/books"
        class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Manage Books
      </RouterLink>
      <RouterLink
        to="/admin/categories"
        class="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
      >
        View Categories
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gqlClient } from '@/api/graphql/client'
import { GET_ADMIN_STATS } from '@/api/graphql/categories.gql'

interface BooksByCategory {
  categoryId: string
  categoryName: string
  count: number
}

interface AdminStats {
  totalBooks: number
  activeBooks: number
  inactiveBooks: number
  totalCategories: number
  booksByCategory: BooksByCategory[]
}

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
