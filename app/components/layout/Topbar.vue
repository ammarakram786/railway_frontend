<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const authStore = useAuthStore()

const dropdownItems = computed<DropdownMenuItem[]>(() => [
    {
        label: 'My Profile',
        icon: 'i-lucide-user',
        onSelect: () => navigateTo('/profile')
    },
    { type: 'separator' },
    {
        label: 'Logout',
        icon: 'i-lucide-log-out',
        color: 'error',
        onSelect: async () => {
            await authStore.logout()
        }
    }
])
</script>

<template>
    <UHeader :ui="{ container: 'max-w-none px-4 lg:px-8' }">
        <template #left>
            <NuxtLink to="/" class="flex items-center gap-2">
                <AppLogo class="h-6 w-auto" />
                <span class="font-bold text-xl">Railway Tag & Monitoring</span>
            </NuxtLink>
        </template>

        <template #right>
            <div class="flex items-center gap-2 border-l border-gray-200 dark:border-gray-800 ml-2 pl-4">
                <UColorModeButton />
                <UDropdownMenu :items="dropdownItems" :content="{ align: 'end', class: 'w-48' }">
                    <UButton icon="i-lucide-user" color="neutral" variant="ghost"
                        :label="authStore.user?.username || 'User'" />
                </UDropdownMenu>
            </div>
        </template>
    </UHeader>
</template>
