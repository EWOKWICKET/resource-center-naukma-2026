<template>
  <div class="flex flex-wrap gap-4 items-center">
    <!-- Genre dropdown -->
    <select
      :value="modelValue.genre ?? ''"
      class="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      @change="onGenreChange"
    >
      <option value="">All genres</option>
      <option v-for="genre in genres" :key="genre" :value="genre">
        {{ genreLabel(genre) }}
      </option>
    </select>

    <!-- Show inactive checkbox (admin only) -->
    <label v-if="showInactiveOption" class="flex items-center gap-2 cursor-pointer select-none">
      <input
        type="checkbox"
        :checked="modelValue.isActive === undefined"
        class="h-4 w-4 accent-blue-600"
        @change="onShowInactiveChange"
      />
      <span class="text-sm text-gray-700">Show inactive</span>
    </label>
  </div>
</template>

<script setup lang="ts">
import { Genre, type BookFilters } from '@/types'

const props = withDefaults(
  defineProps<{
    modelValue: BookFilters
    showInactiveOption?: boolean
  }>(),
  { showInactiveOption: false }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: BookFilters): void
}>()

const genres = Object.values(Genre)

function genreLabel(genre: Genre): string {
  return genre
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function onGenreChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  emit('update:modelValue', {
    ...props.modelValue,
    genre: value ? (value as Genre) : undefined,
  })
}

function onShowInactiveChange(event: Event) {
  const checked = (event.target as HTMLInputElement).checked
  // checked = show all (isActive: undefined); unchecked = show only active (isActive: true)
  emit('update:modelValue', {
    ...props.modelValue,
    isActive: checked ? undefined : true,
  })
}
</script>
