<script setup lang="ts">
const { menuItems } = useMenu()
</script>

<template>
    <aside class="w-64 border-r border-gray-200 dark:border-gray-800 p-4 hidden lg:block">
        <UNavigationMenu :items="menuItems" orientation="vertical" variant="link" />
    </aside>
</template>
