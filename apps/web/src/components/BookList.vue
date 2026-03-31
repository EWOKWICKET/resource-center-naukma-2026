<template>
  <div>
    <!-- Loading skeletons -->
    <div
      v-if="loading"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      <div
        v-for="n in 4"
        :key="n"
        class="animate-pulse bg-gray-200 rounded-lg h-64"
      />
    </div>

    <!-- Empty state -->
    <div
      v-else-if="books.length === 0"
      class="flex items-center justify-center py-16"
    >
      <p class="text-gray-500 text-lg">No books found</p>
    </div>

    <!-- Book grid -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      <BookCard
        v-for="book in books"
        :key="book.id"
        :book="book"
        :admin-view="adminView"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Book } from '@/types'
import BookCard from '@/components/BookCard.vue'

withDefaults(
  defineProps<{
    books: Book[]
    loading?: boolean
    adminView?: boolean
  }>(),
  { loading: false, adminView: false }
)
</script>
