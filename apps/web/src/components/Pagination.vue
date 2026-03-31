<template>
  <div v-if="total > limit" class="flex flex-wrap items-center justify-between gap-4 mt-6">
    <!-- Summary -->
    <p class="text-sm text-gray-600">
      Showing {{ rangeStart }}–{{ rangeEnd }} of {{ total }}
    </p>

    <!-- Controls -->
    <div class="flex items-center gap-1">
      <!-- Prev -->
      <button
        :disabled="page <= 1"
        class="px-3 py-1.5 rounded border text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
        @click="emit('update:page', page - 1)"
      >
        Prev
      </button>

      <!-- Page numbers -->
      <button
        v-for="p in pageNumbers"
        :key="p"
        :class="[
          'px-3 py-1.5 rounded border text-sm transition',
          p === page
            ? 'bg-blue-600 text-white border-blue-600'
            : 'hover:bg-gray-50',
        ]"
        @click="emit('update:page', p)"
      >
        {{ p }}
      </button>

      <!-- Next -->
      <button
        :disabled="page >= totalPages"
        class="px-3 py-1.5 rounded border text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
        @click="emit('update:page', page + 1)"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  total: number
  page: number
  limit: number
}>()

const emit = defineEmits<{
  (e: 'update:page', value: number): void
}>()

const totalPages = computed(() => Math.ceil(props.total / props.limit))

const rangeStart = computed(() => Math.min((props.page - 1) * props.limit + 1, props.total))
const rangeEnd = computed(() => Math.min(props.page * props.limit, props.total))

/** Show at most 5 page numbers centred around the current page */
const pageNumbers = computed(() => {
  const total = totalPages.value
  const current = props.page
  const window = 2 // pages on each side

  let start = Math.max(1, current - window)
  let end = Math.min(total, current + window)

  // Adjust window edges so we always show up to 5 pages
  if (end - start < 4) {
    if (start === 1) end = Math.min(total, start + 4)
    else start = Math.max(1, end - 4)
  }

  const pages: number[] = []
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})
</script>
