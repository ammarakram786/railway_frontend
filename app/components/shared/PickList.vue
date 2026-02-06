<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface Item {
    id: string | number
    name: string
    description?: string
    [key: string]: any
}

const props = defineProps<{
    modelValue: (string | number)[]
    items: Item[]
    sourceHeader?: string
    targetHeader?: string
    sourceFilterPlaceholder?: string
    targetFilterPlaceholder?: string
    dataKey?: string
}>()

const emit = defineEmits(['update:modelValue', 'move'])

const dataKey = props.dataKey || 'id'
const sourceSearch = ref('')
const targetSearch = ref('')

// Track selected items in both lists for bulk movement
const selectedSourceIds = ref<Set<string | number>>(new Set())
const selectedTargetIds = ref<Set<string | number>>(new Set())

const targetItems = computed(() => {
    return props.items.filter(item => props.modelValue.includes(item[dataKey]))
})

const sourceItems = computed(() => {
    return props.items.filter(item => !props.modelValue.includes(item[dataKey]))
})

const filteredSourceItems = computed(() => {
    if (!sourceSearch.value) return sourceItems.value
    const s = sourceSearch.value.toLowerCase()
    return sourceItems.value.filter(item =>
        item.name.toLowerCase().includes(s) ||
        (item.description && item.description.toLowerCase().includes(s))
    )
})

const filteredTargetItems = computed(() => {
    if (!targetSearch.value) return targetItems.value
    const s = targetSearch.value.toLowerCase()
    return targetItems.value.filter(item =>
        item.name.toLowerCase().includes(s) ||
        (item.description && item.description.toLowerCase().includes(s))
    )
})

const toggleSelection = (id: string | number, set: Set<string | number>) => {
    if (set.has(id)) set.delete(id)
    else set.add(id)
}

const moveSelectedToTarget = () => {
    if (selectedSourceIds.value.size === 0) return
    const newValue = [...props.modelValue, ...Array.from(selectedSourceIds.value)]
    emit('update:modelValue', newValue)
    emit('move', { type: 'to-target', ids: Array.from(selectedSourceIds.value) })
    selectedSourceIds.value.clear()
}

const moveAllToTarget = () => {
    const ids = sourceItems.value.map(item => item[dataKey])
    const newValue = [...props.modelValue, ...ids]
    emit('update:modelValue', newValue)
    emit('move', { type: 'to-target-all', ids })
    selectedSourceIds.value.clear()
}

const moveSelectedToSource = () => {
    if (selectedTargetIds.value.size === 0) return
    const newValue = props.modelValue.filter(id => !selectedTargetIds.value.has(id))
    emit('update:modelValue', newValue)
    emit('move', { type: 'to-source', ids: Array.from(selectedTargetIds.value) })
    selectedTargetIds.value.clear()
}

const moveAllToSource = () => {
    emit('update:modelValue', [])
    emit('move', { type: 'to-source-all', ids: props.modelValue })
    selectedTargetIds.value.clear()
}
</script>

<template>
    <div class="flex flex-col md:flex-row gap-4 h-[400px]">
        <!-- Source List -->
        <div
            class="flex-1 flex flex-col border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
            <div
                class="px-4 py-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 font-medium text-sm flex justify-between items-center">
                <span>{{ sourceHeader || 'Available' }}</span>
                <span class="text-xs text-muted">{{ sourceItems.length }}</span>
            </div>
            <div class="p-2 border-b border-gray-200 dark:border-gray-800">
                <UInput v-model="sourceSearch" :placeholder="sourceFilterPlaceholder || 'Search...'"
                    icon="i-lucide-search" size="xs" />
            </div>
            <div class="flex-1 overflow-y-auto p-1 divide-y divide-gray-100 dark:divide-gray-800/50">
                <div v-for="item in filteredSourceItems" :key="item[dataKey]"
                    @click="toggleSelection(item[dataKey], selectedSourceIds)" :class="[
                        'p-2 cursor-pointer transition-colors rounded hover:bg-gray-50 dark:hover:bg-gray-800/50',
                        selectedSourceIds.has(item[dataKey]) ? 'bg-primary-50 dark:bg-primary-900/20 ring-1 ring-primary-500/50' : ''
                    ]">
                    <div class="font-medium text-sm">{{ item.name }}</div>
                    <div v-if="item.description" class="text-xs text-muted truncate">{{ item.description }}</div>
                </div>
                <div v-if="filteredSourceItems.length === 0" class="p-8 text-center text-xs text-muted italic">
                    No items found
                </div>
            </div>
        </div>

        <!-- Controls -->
        <div class="flex md:flex-col justify-center gap-2 px-2">
            <UButton icon="i-lucide-chevrons-right" color="neutral" variant="ghost" @click="moveAllToTarget"
                :disabled="sourceItems.length === 0" class="hidden md:flex" />
            <UButton icon="i-lucide-chevron-right" color="neutral" variant="outline" @click="moveSelectedToTarget"
                :disabled="selectedSourceIds.size === 0" />
            <UButton icon="i-lucide-chevron-left" color="neutral" variant="outline" @click="moveSelectedToSource"
                :disabled="selectedTargetIds.size === 0" />
            <UButton icon="i-lucide-chevrons-left" color="neutral" variant="ghost" @click="moveAllToSource"
                :disabled="targetItems.length === 0" class="hidden md:flex" />
        </div>

        <!-- Target List -->
        <div
            class="flex-1 flex flex-col border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
            <div
                class="px-4 py-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 font-medium text-sm flex justify-between items-center">
                <span>{{ targetHeader || 'Assigned' }}</span>
                <span class="text-xs text-muted">{{ targetItems.length }}</span>
            </div>
            <div class="p-2 border-b border-gray-200 dark:border-gray-800">
                <UInput v-model="targetSearch" :placeholder="targetFilterPlaceholder || 'Search...'"
                    icon="i-lucide-search" size="xs" />
            </div>
            <div class="flex-1 overflow-y-auto p-1 divide-y divide-gray-100 dark:divide-gray-800/50">
                <div v-for="item in filteredTargetItems" :key="item[dataKey]"
                    @click="toggleSelection(item[dataKey], selectedTargetIds)" :class="[
                        'p-2 cursor-pointer transition-colors rounded hover:bg-gray-50 dark:hover:bg-gray-800/50',
                        selectedTargetIds.has(item[dataKey]) ? 'bg-primary-50 dark:bg-primary-900/20 ring-1 ring-primary-500/50' : ''
                    ]">
                    <div class="font-medium text-sm">{{ item.name }}</div>
                    <div v-if="item.description" class="text-xs text-muted truncate">{{ item.description }}</div>
                </div>
                <div v-if="filteredTargetItems.length === 0" class="p-8 text-center text-xs text-muted italic">
                    None assigned
                </div>
            </div>
        </div>
    </div>
</template>
