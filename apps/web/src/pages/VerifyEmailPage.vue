<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">

      <!-- Loading -->
      <template v-if="status === 'loading'">
        <div class="flex flex-col items-center gap-3 text-gray-500">
          <svg class="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p>Verifying your email…</p>
        </div>
      </template>

      <!-- Success -->
      <template v-else-if="status === 'success'">
        <div class="space-y-4">
          <div class="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            Email verified! You can now log in.
          </div>
          <RouterLink
            to="/login"
            class="inline-block w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </RouterLink>
        </div>
      </template>

      <!-- Error -->
      <template v-else-if="status === 'error'">
        <div class="space-y-4">
          <div class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            Verification failed. The link may be expired.
          </div>

          <p class="text-sm text-gray-600">Enter your email to request a new verification link:</p>

          <form @submit.prevent="sendNewVerification" novalidate class="space-y-3">
            <div>
              <input
                v-model="resendEmail"
                type="email"
                placeholder="you@example.com"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': resendEmailError }"
              />
              <p v-if="resendEmailError" class="text-red-500 text-sm mt-1">{{ resendEmailError }}</p>
            </div>

            <button
              type="submit"
              :disabled="resending"
              class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {{ resending ? 'Sending…' : 'Send Verification Email' }}
            </button>

            <p v-if="resendMessage" class="text-sm text-gray-600">{{ resendMessage }}</p>
          </form>

          <p class="text-sm text-gray-600">
            <RouterLink to="/login" class="text-blue-600 hover:underline">Back to Login</RouterLink>
          </p>
        </div>
      </template>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { authApi } from '@/api/rest/auth.api'

type Status = 'loading' | 'success' | 'error'

const route = useRoute()
const status = ref<Status>('loading')

const resendEmail = ref('')
const resendEmailError = ref<string | null>(null)
const resending = ref(false)
const resendMessage = ref<string | null>(null)

onMounted(async () => {
  const userId = route.params.userId as string
  try {
    await authApi.verifyUser(userId)
    status.value = 'success'
  } catch {
    status.value = 'error'
  }
})

async function sendNewVerification() {
  resendEmailError.value = null
  resendMessage.value = null

  if (!resendEmail.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resendEmail.value)) {
    resendEmailError.value = 'Please enter a valid email address.'
    return
  }

  resending.value = true
  try {
    await authApi.sendVerificationEmail(resendEmail.value)
    resendMessage.value = 'Verification email sent! Check your inbox.'
  } catch {
    resendMessage.value = 'Failed to send. Please try again.'
  } finally {
    resending.value = false
  }
}
</script>
