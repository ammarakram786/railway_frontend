<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { storeToRefs } from 'pinia'
import type { UserDetail } from '~/types/api'

// Page metadata: default layout + auth middleware
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

// Auth store
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

// Users list & loading state
const users = ref<UserDetail[]>([])
const loading = ref<boolean>(true)
const error = ref<string | null>(null)

const { $api } = useNuxtApp()

// Fetch users from backend
const fetchUsers = async () => {
  loading.value = true
  error.value = null

  try {
    // Adjust the API endpoint according to your backend
    const response = await $api<{ data: UserDetail[] }>('/api/users/')
    users.value = response.data || []
  } catch (err) {
    console.error('Failed to fetch users:', err)
    error.value = 'Failed to load users. Please try again.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchUsers)
</script>

<template>
  <div class="min-h-[70vh] p-4">
    <h1 class="text-2xl font-bold mb-4">
      Users
    </h1>

    <!-- Loading state -->
    <div
      v-if="loading"
      class="text-gray-500"
    >
      Loading users...
    </div>

    <!-- Error state -->
    <div
      v-else-if="error"
      class="text-red-500"
    >
      {{ error }}
    </div>

    <!-- Users list -->
    <ul
      v-else
      class="space-y-2"
    >
      <li
        v-for="u in users"
        :key="u.id"
        class="p-2 border rounded hover:bg-gray-50 transition"
      >
        <p class="font-medium">
          {{ u.name }}
        </p>
        <p class="text-sm text-gray-500">
          {{ u.email }}
        </p>
      </li>
    </ul>

    <!-- Empty state -->
    <div
      v-if="!loading && users.length === 0"
      class="text-gray-500"
    >
      No users found.
    </div>
  </div>
</template>
