<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import { upperFirst } from 'scule'
import type { TableColumn } from '@nuxt/ui'
import type { RoleList, Permission } from '~/types/api'

const { roles, totalRoles, loading, fetchRoles, createRole } = useRoles()
const { permissions, fetchPermissions } = usePermissions()
const toast = useToast()

const columns: TableColumn<RoleList>[] = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Role Name' },
    { accessorKey: 'permissions_count', header: 'Permissions Count' }
]

const table = useTemplateRef('table')
const page = ref(1)
const pageSize = 10
const isModalOpen = ref(false)

const form = reactive({
    name: '',
    code_name: '',
    permission_ids: [] as number[]
})

const loadRoles = async () => {
    await fetchRoles({
        page: page.value,
        page_size: pageSize
    })
}

watch(page, loadRoles)
onMounted(() => {
    loadRoles()
    fetchPermissions({ page_size: 100 }) // Load permissions for the form
})

const handleCreateRole = async () => {
    const response = await createRole(form)
    if (response?.status) {
        toast.add({
            title: 'Role Created',
            description: `Role ${form.name} has been created successfully.`,
            color: 'success'
        })
        isModalOpen.value = false
        Object.assign(form, { name: '', code_name: '', permission_ids: [] })
        loadRoles()
    } else {
        toast.add({
            title: 'Error',
            description: response?.message || 'Failed to create role',
            color: 'error'
        })
    }
}
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold">Roles Management</h1>
            <div class="flex items-center gap-4">
                <UDropdownMenu :items="table?.tableApi?.getAllColumns().filter((column: any) => column.getCanHide()).map((column: any) => ({
                    label: upperFirst(column.id),
                    type: 'checkbox' as const,
                    checked: column.getIsVisible(),
                    onUpdateChecked(checked: boolean) {
                        table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
                    },
                    onSelect(e: Event) {
                        e.preventDefault()
                    }
                }))" :content="{ align: 'end' }">
                    <UButton label="Columns" color="neutral" variant="outline" trailing-icon="i-lucide-chevron-down" />
                </UDropdownMenu>
                <UButton label="Add Role" icon="i-lucide-shield-plus" @click="isModalOpen = true" />
            </div>
        </div>

        <!-- Create Role Modal -->
        <UModal v-model:open="isModalOpen" title="Create New Role" :ui="{ content: 'sm:max-w-3xl' }"
            description="Define a name and assign permissions for this role.">
            <template #content>
                <UForm :state="form" class="space-y-4 p-4" @submit="handleCreateRole">
                    <div class="grid grid-cols-2 gap-4">

                        <UFormField label="Role Name" name="name" required>
                            <UInput v-model="form.name" placeholder="Administrator" class="w-full" />
                        </UFormField>

                        <UFormField label="Role Code Name" name="code_name" required>
                            <UInput v-model="form.code_name" placeholder="admin" class="w-full" />
                        </UFormField>
                    </div>

                    <UFormField label="Assign Permissions" name="permission_ids" required>
                        <SharedPickList v-model="form.permission_ids" :items="permissions"
                            source-header="Available Permissions" target-header="Assigned Permissions"
                            source-filter-placeholder="Search available permissions..."
                            target-filter-placeholder="Search assigned permissions..." />
                    </UFormField>

                    <div class="flex justify-end gap-3 mt-6">
                        <UButton label="Cancel" color="neutral" variant="ghost" @click="isModalOpen = false" />
                        <UButton type="submit" label="Create Role" :loading="loading" />
                    </div>
                </UForm>
            </template>
        </UModal>

        <UCard :ui="{ body: 'p-0' }">
            <UTable ref="table" :data="roles" :columns="columns" :loading="loading" sticky class="max-h-[600px]" />

            <template #footer>
                <div class="flex items-center justify-center px-4 py-2">
                    <UPagination v-model:page="page" :total="totalRoles" :page-count="pageSize" />
                </div>
            </template>
        </UCard>
    </div>
</template>
