<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">Categories</h1>
    <p class="text-gray-500 text-sm mb-8">
      Categories are read-only in the frontend. To create, edit, or delete categories, use the database directly.
    </p>

    <!-- Loading skeleton -->
    <div v-if="loading" class="space-y-2">
      <div v-for="i in 4" :key="i" class="h-12 bg-gray-100 rounded animate-pulse" />
    </div>

    <!-- Error -->
    <div v-else-if="fetchError" class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
      Failed to load categories: {{ fetchError }}
    </div>

    <!-- Table -->
    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
      <table class="min-w-full text-sm">
        <thead>
          <tr class="border-b border-gray-200 bg-gray-50 text-left">
            <th class="px-4 py-3 font-medium text-gray-600">Name</th>
            <th class="px-4 py-3 font-medium text-gray-600">Description</th>
            <th class="px-4 py-3 font-medium text-gray-600">Status</th>
            <th class="px-4 py-3 font-medium text-gray-600">Active Books</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-if="categories.length === 0">
            <td colspan="4" class="px-4 py-8 text-center text-gray-400">No categories found.</td>
          </tr>
          <tr v-for="cat in categories" :key="cat.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 font-medium text-gray-900">{{ cat.name }}</td>
            <td class="px-4 py-3 text-gray-600">{{ cat.description ?? '—' }}</td>
            <td class="px-4 py-3">
              <span
                :class="cat.isActive
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-600'"
                class="inline-block text-xs font-medium px-2 py-0.5 rounded-full"
              >
                {{ cat.isActive ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="px-4 py-3 text-gray-600">{{ cat.activeBookCount }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gqlClient } from '@/api/graphql/client'
import { GET_CATEGORIES_WITH_STATS } from '@/api/graphql/categories.gql'

interface CategoryWithStats {
  id: string
  name: string
  description?: string
  isActive: boolean
  activeBookCount: number
}

const categories = ref<CategoryWithStats[]>([])
const loading = ref(false)
const fetchError = ref<string | null>(null)

onMounted(async () => {
  loading.value = true
  fetchError.value = null
  try {
    const data = await gqlClient.request<{ categoriesWithStats: CategoryWithStats[] }>(
      GET_CATEGORIES_WITH_STATS,
    )
    categories.value = data.categoriesWithStats
  } catch (err: unknown) {
    fetchError.value = (err as Error)?.message ?? 'Unknown error'
  } finally {
    loading.value = false
  }
})
</script>
