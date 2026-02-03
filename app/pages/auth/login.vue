<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth'
import type { AuthFormField } from '@nuxt/ui'
import type { CustomTokenObtainPairRequest } from '~/types/api'

definePageMeta({
  layout: 'auth'
})

const authStore = useAuthStore()
const { loading } = storeToRefs(authStore)
const toast = useToast()
const router = useRouter()

const fields = ref<AuthFormField[]>([
  { name: 'email', type: 'text', label: 'Email', placeholder: 'you@example.com' },
  { name: 'password', type: 'password', label: 'Password', placeholder: '••••••••' }
])

// handleSubmit gets called with the form state
const handleSubmit = async (state: Record<string, string>) => {
  const credentials: CustomTokenObtainPairRequest = {
    username: state.data.email,
    password: state.data.password
  }
  const success = await authStore.login(credentials)

  if (success) {
    toast.add({
      title: 'Welcome back',
      description: 'You have successfully signed in.'
    })
    await router.push('/')
  } else {
    toast.add({
      color: 'red',
      title: 'Login failed',
      description: 'Check your credentials and try again.'
    })
  }
}
</script>

<template>
  <div class="min-h-[70vh] flex items-center justify-center px-4">
    <UAuthForm
      title="Welcome back"
      description="Enter your credentials to access your account."
      icon="i-lucide-user"
      :fields="fields"
      :loading="loading"
      class="w-full max-w-md"
      @submit="handleSubmit"
    >
      <template #footer />
    </UAuthForm>
  </div>
</template>
