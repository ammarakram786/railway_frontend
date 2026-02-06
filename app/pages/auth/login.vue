<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth'
import type { AuthFormField, FormSubmitEvent } from '@nuxt/ui'
import type { ApiResponse, CustomTokenObtainPairRequest } from '~/types/api'

definePageMeta({
  layout: 'auth'
})

const authStore = useAuthStore()
const { loading } = storeToRefs(authStore)
const toast = useToast()

const fields = ref<AuthFormField[]>([
  { name: 'email', type: 'text', label: 'Email', placeholder: 'you@example.com' },
  { name: 'password', type: 'password', label: 'Password', placeholder: '••••••••' }
])

// handleSubmit gets called with the form state
const handleSubmit = async (event: FormSubmitEvent<any>) => {
  const credentials: CustomTokenObtainPairRequest = {
    username: event.data.email,
    password: event.data.password
  }
  const res: ApiResponse<any> = await authStore.login(credentials)



  if (res.status) {
    toast.add({
      title: 'Welcome back',
      description: 'You have successfully signed in.'
    })
    await navigateTo('/users')
  } else {
    toast.add({
      color: 'error',
      title: 'Login failed',
      description: res.detail || 'Login Failed'
    })
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-4">
    <UAuthForm title="Welcome To Railway Tag & Monitoring App"
      description="Enter your credentials to access your account." icon="i-lucide-train-track" class="sm:max-w-md"
      :fields="fields" :loading="loading" @submit="handleSubmit">
      <template #footer />
    </UAuthForm>
  </div>
</template>
