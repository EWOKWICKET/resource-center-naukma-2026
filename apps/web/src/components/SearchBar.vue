<template>
  <div class="relative">
    <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
    <input
      type="text"
      :value="modelValue"
      placeholder="Search books..."
      class="border rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      @input="onInput"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

let debounceTimer: ReturnType<typeof setTimeout> | null = null

function onInput(event: Event) {
  const value = (event.target as HTMLInputElement).value
  if (debounceTimer !== null) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    emit('update:modelValue', value)
  }, 300)
}
</script>
