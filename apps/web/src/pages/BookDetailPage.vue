<template>
  <div class="max-w-3xl mx-auto px-4 py-8">
    <!-- Back button -->
    <button
      class="flex items-center gap-1 text-blue-600 hover:text-blue-800 mb-6 text-sm font-medium"
      @click="router.back()"
    >
      <ChevronLeftIcon class="h-4 w-4" />
      Back
    </button>

    <!-- Loading state -->
    <div v-if="booksStore.loading" class="animate-pulse space-y-4">
      <div class="h-8 bg-gray-200 rounded w-2/3" />
      <div class="h-4 bg-gray-200 rounded w-1/3" />
      <div class="h-4 bg-gray-200 rounded w-1/4" />
      <div class="h-32 bg-gray-200 rounded" />
    </div>

    <!-- Not found -->
    <div
      v-else-if="!book"
      class="flex flex-col items-center justify-center py-24 text-gray-500"
    >
      <p class="text-xl font-medium">Book not found</p>
      <router-link to="/" class="mt-4 text-blue-600 hover:underline text-sm">
        Go to homepage
      </router-link>
    </div>

    <!-- Book detail -->
    <div v-else class="space-y-6">
      <div class="flex items-start gap-3 flex-wrap">
        <h1 class="text-3xl font-bold text-gray-900 flex-1">{{ book.title }}</h1>
        <span
          v-if="isAdmin && !book.isActive"
          class="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700"
        >
          Inactive
        </span>
        <button
          v-if="authStore.isLoggedIn"
          :disabled="saving"
          @click="toggleSaved"
          class="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors disabled:opacity-50"
          :class="libraryStore.isSaved(book.id)
            ? 'bg-blue-600 text-white hover:bg-red-600'
            : 'border border-blue-600 text-blue-600 hover:bg-blue-50'"
        >
          {{ libraryStore.isSaved(book.id) ? 'Remove from Library' : 'Save to Library' }}
        </button>
      </div>

      <!-- Authors -->
      <p v-if="book.authors.length" class="text-gray-600 text-base">
        <span class="font-medium text-gray-700">Author{{ book.authors.length > 1 ? 's' : '' }}:</span>
        {{ authorList }}
      </p>

      <!-- Genre badges -->
      <div v-if="book.genres.length" class="flex flex-wrap gap-2">
        <span
          v-for="genre in book.genres"
          :key="genre"
          class="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700"
        >
          {{ genreLabel(genre) }}
        </span>
      </div>

      <!-- Description -->
      <p v-if="book.description" class="text-gray-700 leading-relaxed">
        {{ book.description }}
      </p>

      <!-- Metadata table -->
      <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm border-t pt-6">
        <div v-if="book.isbn">
          <dt class="font-medium text-gray-500">ISBN</dt>
          <dd class="mt-0.5 text-gray-900">{{ book.isbn }}</dd>
        </div>
        <div v-if="book.publisher">
          <dt class="font-medium text-gray-500">Publisher</dt>
          <dd class="mt-0.5 text-gray-900">{{ book.publisher }}</dd>
        </div>
        <div v-if="book.publishedYear">
          <dt class="font-medium text-gray-500">Published year</dt>
          <dd class="mt-0.5 text-gray-900">{{ book.publishedYear }}</dd>
        </div>
        <div v-if="book.language">
          <dt class="font-medium text-gray-500">Language</dt>
          <dd class="mt-0.5 text-gray-900 capitalize">{{ book.language }}</dd>
        </div>
        <div v-if="book.pageCount">
          <dt class="font-medium text-gray-500">Pages</dt>
          <dd class="mt-0.5 text-gray-900">{{ book.pageCount }}</dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ChevronLeftIcon } from '@heroicons/vue/24/outline'
import { useBooksStore } from '@/stores/books.store'
import { useAuthStore } from '@/stores/auth.store'
import { useLibraryStore } from '@/stores/library.store'
import type { Genre } from '@/types'

const route = useRoute()
const router = useRouter()
const booksStore = useBooksStore()
const authStore = useAuthStore()
const libraryStore = useLibraryStore()
const { isAdmin } = authStore

const saving = ref(false)

const book = computed(() => booksStore.selected)

const authorList = computed(() => book.value?.authors.join(', ') ?? '')

function genreLabel(genre: Genre): string {
  return genre
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

async function toggleSaved(): Promise<void> {
  if (!book.value) return
  saving.value = true
  try {
    if (libraryStore.isSaved(book.value.id)) {
      await libraryStore.removeBook(book.value.id)
    } else {
      await libraryStore.addBook(book.value.id)
    }
  } finally {
    saving.value = false
  }
}

// Load library once auth state is confirmed (fetchMe in App.vue completes after mount)
watch(
  () => authStore.isLoggedIn,
  (loggedIn) => {
    if (loggedIn) libraryStore.fetchLibrary()
  },
  { immediate: true },
)

onMounted(() => {
  const id = route.params.id as string
  booksStore.fetchBook(id)
})
</script>
