<script setup lang="ts">
const items = [{
    label: 'Users',
    icon: 'i-lucide-users',
    to: '/users'
}, {
    label: 'Roles',
    icon: 'i-lucide-shield-check',
    to: '/roles'
}]
</script>

<template>
    <aside class="w-64 border-r border-gray-200 dark:border-gray-800 p-4 hidden lg:block">
        <UNavigationMenu :items="items" orientation="vertical" variant="link" />
    </aside>
</template>
