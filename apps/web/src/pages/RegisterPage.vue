<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
      <h1 class="text-2xl font-bold mb-6 text-center">Create Account</h1>

      <!-- Success state -->
      <template v-if="registeredEmail">
        <div class="text-center space-y-4">
          <div class="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            Check your email to verify your account.
          </div>

          <p class="text-sm text-gray-600">Didn't receive the email?</p>

          <button
            type="button"
            :disabled="resending"
            @click="resendVerification"
            class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {{ resending ? 'Sending…' : 'Resend Verification Email' }}
          </button>

          <p v-if="resendMessage" class="text-sm text-gray-600">{{ resendMessage }}</p>
        </div>

        <p class="mt-6 text-center text-sm text-gray-600">
          Already verified?
          <RouterLink to="/login" class="text-blue-600 hover:underline">Sign in</RouterLink>
        </p>
      </template>

      <!-- Registration form -->
      <template v-else>
        <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {{ errorMessage }}
        </div>

        <form @submit="onSubmit" novalidate class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                id="firstName"
                v-bind="firstNameAttrs"
                v-model="firstName"
                type="text"
                autocomplete="given-name"
                placeholder="Jane"
                class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': errors.firstName, 'border-gray-300': !errors.firstName }"
              />
              <p v-if="errors.firstName" class="text-red-500 text-sm mt-1">{{ errors.firstName }}</p>
            </div>

            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                id="lastName"
                v-bind="lastNameAttrs"
                v-model="lastName"
                type="text"
                autocomplete="family-name"
                placeholder="Doe"
                class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': errors.lastName, 'border-gray-300': !errors.lastName }"
              />
              <p v-if="errors.lastName" class="text-red-500 text-sm mt-1">{{ errors.lastName }}</p>
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              v-bind="emailAttrs"
              v-model="email"
              type="email"
              autocomplete="email"
              placeholder="you@example.com"
              class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.email, 'border-gray-300': !errors.email }"
            />
            <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password"
              v-bind="passwordAttrs"
              v-model="password"
              type="password"
              autocomplete="new-password"
              placeholder="At least 8 characters"
              class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.password, 'border-gray-300': !errors.password }"
            />
            <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              id="confirmPassword"
              v-bind="confirmPasswordAttrs"
              v-model="confirmPassword"
              type="password"
              autocomplete="new-password"
              placeholder="Repeat your password"
              class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.confirmPassword, 'border-gray-300': !errors.confirmPassword }"
            />
            <p v-if="errors.confirmPassword" class="text-red-500 text-sm mt-1">{{ errors.confirmPassword }}</p>
          </div>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {{ isSubmitting ? 'Creating account…' : 'Create Account' }}
          </button>
        </form>

        <p class="mt-6 text-center text-sm text-gray-600">
          Already have an account?
          <RouterLink to="/login" class="text-blue-600 hover:underline">Sign in</RouterLink>
        </p>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { useAuthStore } from '@/stores/auth.store'
import { authApi } from '@/api/rest/auth.api'

const schema = toTypedSchema(
  z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  }).refine(d => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }),
)

const { handleSubmit, errors, isSubmitting, defineField } = useForm({ validationSchema: schema })

const [firstName, firstNameAttrs] = defineField('firstName')
const [lastName, lastNameAttrs] = defineField('lastName')
const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')
const [confirmPassword, confirmPasswordAttrs] = defineField('confirmPassword')

const authStore = useAuthStore()
const errorMessage = ref<string | null>(null)
const registeredEmail = ref<string | null>(null)
const resending = ref(false)
const resendMessage = ref<string | null>(null)

const onSubmit = handleSubmit(async (values) => {
  errorMessage.value = null
  try {
    await authStore.register({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
    })
    registeredEmail.value = values.email
  } catch (err: unknown) {
    const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
    errorMessage.value = msg ?? 'Registration failed. Please try again.'
  }
})

async function resendVerification() {
  if (!registeredEmail.value) return
  resending.value = true
  resendMessage.value = null
  try {
    await authApi.sendVerificationEmail(registeredEmail.value)
    resendMessage.value = 'Verification email sent!'
  } catch {
    resendMessage.value = 'Failed to resend. Please try again.'
  } finally {
    resending.value = false
  }
}
</script>
