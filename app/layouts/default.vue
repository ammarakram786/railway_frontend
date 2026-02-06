<template>
  <div class="min-h-screen flex flex-col">
    <LayoutTopbar />

    <div class="flex-1 flex overflow-hidden">
      <LayoutSidebar />

      <main class="flex-1 overflow-y-auto p-4 lg:p-8">
        <slot />
      </main>
    </div>

    <LayoutFooter />
  </div>
</template>
