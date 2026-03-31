<template>
  <RouterLink :to="'/books/' + book.id" class="block">
    <div
      class="rounded-lg shadow hover:shadow-md transition cursor-pointer bg-white overflow-hidden relative"
      :class="{ 'opacity-60': adminView && !book.isActive }"
    >
      <!-- Cover placeholder -->
      <div class="bg-gradient-to-br from-blue-100 to-blue-200 h-40 flex items-center justify-center">
        <span class="text-4xl font-bold text-blue-400 select-none">
          {{ book.title.charAt(0).toUpperCase() }}
        </span>
      </div>

      <!-- Inactive overlay -->
      <div
        v-if="adminView && !book.isActive"
        class="absolute top-2 right-2"
      >
        <span class="text-xs bg-red-100 text-red-700 rounded-full px-2 py-0.5 font-medium">
          Inactive
        </span>
      </div>

      <!-- Body -->
      <div class="p-4 space-y-2">
        <h3 class="font-semibold text-gray-900 leading-tight line-clamp-2">{{ book.title }}</h3>

        <p class="text-sm text-gray-500 truncate">
          {{ book.authors.join(', ') }}
        </p>

        <!-- Genre badges (first 2) -->
        <div class="flex flex-wrap gap-1">
          <span
            v-for="genre in book.genres.slice(0, 2)"
            :key="genre"
            class="text-xs bg-blue-100 text-blue-700 rounded-full px-2 py-0.5"
          >
            {{ genre }}
          </span>
        </div>

        <p v-if="book.publishedYear" class="text-xs text-gray-400">{{ book.publishedYear }}</p>
      </div>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Book } from '@/types'

withDefaults(
  defineProps<{
    book: Book
    adminView?: boolean
  }>(),
  { adminView: false }
)
</script>
