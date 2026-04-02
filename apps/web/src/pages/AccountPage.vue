<template>
  <div class="max-w-5xl mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">My Account</h1>
      <p class="text-gray-500 mt-1">{{ authStore.user?.email }}</p>
    </div>

    <h2 class="text-lg font-semibold text-gray-800 mb-4">Saved Books</h2>

    <div v-if="libraryStore.loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <div v-for="n in 4" :key="n" class="animate-pulse bg-gray-200 rounded-lg h-56" />
    </div>

    <div
      v-else-if="!libraryStore.books.length"
      class="flex flex-col items-center justify-center py-20 text-gray-400"
    >
      <p class="text-base">No saved books yet.</p>
      <router-link to="/" class="mt-3 text-blue-600 hover:underline text-sm">Browse books</router-link>
    </div>

    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <div v-for="book in libraryStore.books" :key="book.id" class="relative group">
        <BookCard :book="book" />
        <button
          class="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full px-2 py-1 text-xs text-red-600 hover:bg-red-50 shadow"
          @click.prevent="handleRemove(book.id)"
        >
          Remove
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useLibraryStore } from '@/stores/library.store'
import BookCard from '@/components/BookCard.vue'

const authStore = useAuthStore()
const libraryStore = useLibraryStore()

onMounted(() => {
  libraryStore.fetchLibrary()
})

async function handleRemove(bookId: string): Promise<void> {
  await libraryStore.removeBook(bookId)
}
</script>
