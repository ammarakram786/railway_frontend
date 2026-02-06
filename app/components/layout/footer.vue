<script setup lang="ts">
</script>

<template>
  <UFooter>
    <template #left>
      <div class="flex items-center gap-2">
        <AppLogo class="h-5 w-auto" />
        <span class="font-semibold text-sm">Railway</span>
      </div>
    </template>

    <template #center>
      <p class="text-muted text-sm">
        Copyright © {{ new Date().getFullYear() }} Railway Inc.
      </p>
    </template>

    <template #right>
      <div class="flex items-center gap-4">
        <UButton icon="i-lucide-twitter" color="neutral" variant="ghost" size="sm" />
        <UButton icon="i-lucide-github" color="neutral" variant="ghost" size="sm"
          to="https://github.com/ammarakram786/railway_frontend" target="_blank" />
      </div>
    </template>
  </UFooter>
</template>
