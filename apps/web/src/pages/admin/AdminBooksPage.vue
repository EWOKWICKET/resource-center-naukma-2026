<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Manage Books</h1>
      <button
        type="button"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        @click="openCreate"
      >
        + Add Book
      </button>
    </div>

    <!-- Loading -->
    <div v-if="booksStore.loading" class="space-y-2">
      <div
        v-for="i in 5"
        :key="i"
        class="h-12 bg-gray-100 rounded animate-pulse"
      />
    </div>

    <!-- Table -->
    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
      <table class="min-w-full text-sm">
        <thead>
          <tr class="border-b border-gray-200 bg-gray-50 text-left">
            <th class="px-4 py-3 font-medium text-gray-600">Title</th>
            <th class="px-4 py-3 font-medium text-gray-600">Authors</th>
            <th class="px-4 py-3 font-medium text-gray-600">Genres</th>
            <th class="px-4 py-3 font-medium text-gray-600">Year</th>
            <th class="px-4 py-3 font-medium text-gray-600">Status</th>
            <th class="px-4 py-3 font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-if="booksStore.items.length === 0">
            <td colspan="6" class="px-4 py-8 text-center text-gray-400">No books found.</td>
          </tr>
          <tr v-for="book in booksStore.items" :key="book.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">{{ book.title }}</td>
            <td class="px-4 py-3 text-gray-600 max-w-xs truncate">{{ book.authors.join(', ') }}</td>
            <td class="px-4 py-3 text-gray-600">
              <span
                v-for="genre in book.genres"
                :key="genre"
                class="inline-block bg-blue-50 text-blue-700 text-xs px-1.5 py-0.5 rounded mr-1"
              >
                {{ genre }}
              </span>
            </td>
            <td class="px-4 py-3 text-gray-600">{{ book.publishedYear ?? '—' }}</td>
            <td class="px-4 py-3">
              <span
                :class="book.isActive
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-600'"
                class="inline-block text-xs font-medium px-2 py-0.5 rounded-full"
              >
                {{ book.isActive ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="text-sm text-blue-600 hover:underline"
                  @click="openEdit(book)"
                >
                  Edit
                </button>
                <button
                  type="button"
                  class="text-sm hover:underline"
                  :class="book.isActive ? 'text-yellow-600' : 'text-green-600'"
                  @click="toggleStatus(book)"
                >
                  {{ book.isActive ? 'Deactivate' : 'Activate' }}
                </button>
                <button
                  type="button"
                  class="text-sm text-red-600 hover:underline"
                  @click="confirmDelete(book)"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- BookForm modal -->
    <BookForm
      :open="formOpen"
      :book="selectedBook"
      @submitted="onFormSubmitted"
      @cancelled="closeForm"
    />

    <!-- Delete confirmation modal -->
    <div
      v-if="deleteTarget"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-2">Delete Book</h2>
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete <strong>{{ deleteTarget.title }}</strong>? This action cannot be undone.
        </p>
        <div class="flex justify-end gap-3">
          <button
            type="button"
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            @click="deleteTarget = null"
          >
            Cancel
          </button>
          <button
            type="button"
            :disabled="deleting"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            @click="executeDelete"
          >
            {{ deleting ? 'Deleting…' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBooksStore } from '@/stores/books.store'
import type { Book } from '@/types'
import BookForm from '@/components/admin/BookForm.vue'

const booksStore = useBooksStore()

const formOpen = ref(false)
const selectedBook = ref<Book | undefined>(undefined)

const deleteTarget = ref<Book | null>(null)
const deleting = ref(false)

onMounted(() => {
  // undefined clears any accumulated isActive filter so admin sees all books
  booksStore.fetchBooks({ isActive: undefined })
})

function openCreate() {
  selectedBook.value = undefined
  formOpen.value = true
}

function openEdit(book: Book) {
  selectedBook.value = book
  formOpen.value = true
}

function closeForm() {
  formOpen.value = false
  selectedBook.value = undefined
}

function onFormSubmitted() {
  closeForm()
}

async function toggleStatus(book: Book) {
  await booksStore.setBookStatus(book.id, !book.isActive)
}

function confirmDelete(book: Book) {
  deleteTarget.value = book
}

async function executeDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await booksStore.deleteBook(deleteTarget.value.id)
    deleteTarget.value = null
  } finally {
    deleting.value = false
  }
}
</script>
