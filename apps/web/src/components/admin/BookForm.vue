<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    @click.self="emit('cancelled')"
  >
    <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
      <div class="p-6 border-b border-gray-200 flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-900">
          {{ book ? 'Edit Book' : 'Add Book' }}
        </h2>
        <button
          type="button"
          class="text-gray-400 hover:text-gray-600"
          @click="emit('cancelled')"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit="onSubmit" novalidate class="p-6 space-y-4">
        <!-- Title -->
        <div>
          <label for="bf-title" class="block text-sm font-medium text-gray-700 mb-1">Title <span class="text-red-500">*</span></label>
          <input
            id="bf-title"
            v-bind="titleAttrs"
            v-model="title"
            type="text"
            class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="{ 'border-red-500': errors.title, 'border-gray-300': !errors.title }"
          />
          <p v-if="errors.title" class="text-red-500 text-sm mt-1">{{ errors.title }}</p>
        </div>

        <!-- Authors -->
        <div>
          <label for="bf-authors" class="block text-sm font-medium text-gray-700 mb-1">Authors <span class="text-red-500">*</span></label>
          <input
            id="bf-authors"
            v-bind="authorsAttrs"
            v-model="authors"
            type="text"
            placeholder="Author 1, Author 2"
            class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="{ 'border-red-500': errors.authors, 'border-gray-300': !errors.authors }"
          />
          <p v-if="errors.authors" class="text-red-500 text-sm mt-1">{{ errors.authors }}</p>
        </div>

        <!-- Genres -->
        <div>
          <fieldset>
            <legend class="block text-sm font-medium text-gray-700 mb-2">Genres <span class="text-red-500">*</span></legend>
            <div class="grid grid-cols-3 gap-2">
              <label
                v-for="genre in genreOptions"
                :key="genre.value"
                class="flex items-center gap-2 text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  :value="genre.value"
                  v-model="genres"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                {{ genre.label }}
              </label>
            </div>
          </fieldset>
          <p v-if="errors.genres" class="text-red-500 text-sm mt-1">{{ errors.genres }}</p>
        </div>

        <!-- Description -->
        <div>
          <label for="bf-description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            id="bf-description"
            v-bind="descriptionAttrs"
            v-model="description"
            rows="3"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <!-- ISBN -->
          <div>
            <label for="bf-isbn" class="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
            <input
              id="bf-isbn"
              v-bind="isbnAttrs"
              v-model="isbn"
              type="text"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Published Year -->
          <div>
            <label for="bf-year" class="block text-sm font-medium text-gray-700 mb-1">Published Year</label>
            <input
              id="bf-year"
              v-bind="publishedYearAttrs"
              v-model="publishedYear"
              type="number"
              min="1000"
              max="2200"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.publishedYear }"
            />
            <p v-if="errors.publishedYear" class="text-red-500 text-sm mt-1">{{ errors.publishedYear }}</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <!-- Publisher -->
          <div>
            <label for="bf-publisher" class="block text-sm font-medium text-gray-700 mb-1">Publisher</label>
            <input
              id="bf-publisher"
              v-bind="publisherAttrs"
              v-model="publisher"
              type="text"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Language -->
          <div>
            <label for="bf-language" class="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <select
              id="bf-language"
              v-bind="languageAttrs"
              v-model="language"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">— select —</option>
              <option v-for="lang in languageOptions" :key="lang.value" :value="lang.value">
                {{ lang.label }}
              </option>
            </select>
          </div>
        </div>

        <!-- Page Count -->
        <div class="w-1/2">
          <label for="bf-pages" class="block text-sm font-medium text-gray-700 mb-1">Page Count</label>
          <input
            id="bf-pages"
            v-bind="pageCountAttrs"
            v-model="pageCount"
            type="number"
            min="1"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="{ 'border-red-500': errors.pageCount }"
          />
          <p v-if="errors.pageCount" class="text-red-500 text-sm mt-1">{{ errors.pageCount }}</p>
        </div>

        <div v-if="submitError" class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {{ submitError }}
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <button
            type="button"
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            @click="emit('cancelled')"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {{ isSubmitting ? 'Saving…' : (book ? 'Save Changes' : 'Add Book') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { Genre, Language } from '@/types'
import type { Book } from '@/types'
import { useBooksStore } from '@/stores/books.store'

const props = defineProps<{
  book?: Book
  open: boolean
}>()

const emit = defineEmits<{
  submitted: []
  cancelled: []
}>()

const booksStore = useBooksStore()
const submitError = ref<string | null>(null)

const genreOptions = Object.values(Genre).map((v) => ({
  value: v,
  label: v.charAt(0).toUpperCase() + v.slice(1).replace('-', ' '),
}))

const languageOptions = Object.values(Language).map((v) => ({
  value: v,
  label: v.charAt(0).toUpperCase() + v.slice(1),
}))

const schema = toTypedSchema(
  z.object({
    title: z.string().min(1, 'Title is required'),
    authors: z.string().min(1, 'At least one author is required'),
    genres: z.array(z.nativeEnum(Genre)).min(1, 'Select at least one genre'),
    description: z.string().optional(),
    isbn: z.string().optional(),
    publishedYear: z
      .number()
      .int()
      .min(1000)
      .max(2200)
      .optional()
      .or(z.literal(''))
      .transform((v) => (v === '' ? undefined : Number(v))),
    publisher: z.string().optional(),
    language: z
      .nativeEnum(Language)
      .optional()
      .or(z.literal(''))
      .transform((v) => (v === '' ? undefined : v)),
    pageCount: z
      .number()
      .int()
      .positive()
      .optional()
      .or(z.literal(''))
      .transform((v) => (v === '' ? undefined : Number(v))),
  }),
)

const { handleSubmit, errors, isSubmitting, defineField, resetForm } = useForm({
  validationSchema: schema,
})

const [title, titleAttrs] = defineField('title')
const [authors, authorsAttrs] = defineField('authors')
const [genres, genresAttrs] = defineField('genres')
const [description, descriptionAttrs] = defineField('description')
const [isbn, isbnAttrs] = defineField('isbn')
const [publishedYear, publishedYearAttrs] = defineField('publishedYear')
const [publisher, publisherAttrs] = defineField('publisher')
const [language, languageAttrs] = defineField('language')
const [pageCount, pageCountAttrs] = defineField('pageCount')

// Suppress unused warning — vee-validate uses these via v-bind spread
void genresAttrs

function populateForm(book?: Book) {
  resetForm({
    values: {
      title: book?.title ?? '',
      authors: book?.authors.join(', ') ?? '',
      genres: book?.genres ?? [],
      description: book?.description ?? '',
      isbn: book?.isbn ?? '',
      publishedYear: (book?.publishedYear ?? '') as number | '',
      publisher: book?.publisher ?? '',
      language: (book?.language ?? '') as Language | '',
      pageCount: (book?.pageCount ?? '') as number | '',
    },
  })
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      submitError.value = null
      populateForm(props.book)
    }
  },
  { immediate: true },
)

const onSubmit = handleSubmit(async (values) => {
  submitError.value = null
  try {
    const dto = {
      title: values.title,
      authors: values.authors
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean),
      genres: values.genres,
      description: values.description || undefined,
      isbn: values.isbn || undefined,
      publishedYear: values.publishedYear as number | undefined,
      publisher: values.publisher || undefined,
      language: values.language as Language | undefined,
      pageCount: values.pageCount as number | undefined,
    }

    if (props.book) {
      await booksStore.updateBook(props.book.id, dto)
    } else {
      await booksStore.createBook(dto)
    }
    emit('submitted')
  } catch (err: unknown) {
    const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
    submitError.value = msg ?? 'Failed to save book. Please try again.'
  }
})
</script>
