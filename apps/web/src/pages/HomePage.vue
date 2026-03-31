<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-6">Books</h1>

    <div class="flex flex-col sm:flex-row gap-4 mb-8">
      <div class="flex-1">
        <SearchBar v-model="searchQuery" />
      </div>
      <FilterPanel
        v-model="panelFilters"
        :show-inactive-option="isAdmin"
      />
    </div>

    <BookList
      :books="visibleBooks"
      :loading="booksStore.loading"
      :admin-view="isAdmin"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useBooksStore } from '@/stores/books.store'
import { useAuthStore } from '@/stores/auth.store'
import SearchBar from '@/components/SearchBar.vue'
import FilterPanel from '@/components/FilterPanel.vue'
import BookList from '@/components/BookList.vue'
import type { BookFilters } from '@/types'

const booksStore = useBooksStore()
const { isAdmin } = useAuthStore()

const searchQuery = ref('')
const panelFilters = ref<BookFilters>({})

const activeFilters = computed<BookFilters>(() => ({
  ...panelFilters.value,
  search: searchQuery.value || undefined,
}))

const visibleBooks = computed(() => {
  if (isAdmin) return booksStore.items
  return booksStore.items.filter((b) => b.isActive)
})

watch(activeFilters, (filters) => {
  booksStore.fetchBooks(filters)
})

onMounted(() => {
  const initialFilters: BookFilters = isAdmin ? {} : { isActive: true }
  booksStore.fetchBooks(initialFilters)
})
</script>
