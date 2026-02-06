<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import { upperFirst } from 'scule'
import type { TableColumn } from '@nuxt/ui'
import type { User } from '~/types/api'

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const { users, totalUsers, loading, fetchUsers, deactivateUser, activateUser } = useUsers()
const toast = useToast()

const toggleStatus = async (user: any) => {
  const success = user.is_active
    ? await deactivateUser(user.id)
    : await activateUser(user.id)

  if (success) {
    toast.add({
      title: 'Success',
      description: `User ${user.username} has been ${user.is_active ? 'deactivated' : 'activated'}.`,
      color: 'success'
    })
    loadUsers()
  }
}

const columns: TableColumn<User>[] = [
  { id: 'id', accessorKey: 'id', header: 'ID' },
  { id: 'username', accessorKey: 'username', header: 'Username' },
  { id: 'email', accessorKey: 'email', header: 'Email' },
  {
    id: 'name',
    header: 'Full Name',
    cell: ({ row }) => `${row.original.first_name} ${row.original.last_name}`
  },
  {
    id: 'status',
    accessorKey: 'is_active',
    header: 'Status',
    cell: ({ row }) => {
      const active = row.original.is_active
      return h(UBadge, {
        color: active ? 'success' : 'error',
        variant: 'subtle'
      }, () => active ? 'Active' : 'Inactive')
    }
  },
  {
    id: 'role', accessorKey: 'role', header: 'Role',
    cell: ({ row }) => row.original.role.name
  },
  {
    id: 'actions',
    header: 'Actions',
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original
      const items = [
        {
          label: 'Edit User',
          icon: 'i-lucide-user-pen',
          onSelect: () => toast.add({ title: 'Coming Soon', description: 'User editing will be available soon.' })
        }, {
          label: 'Reset Password',
          icon: 'i-lucide-key-round',
          onSelect: () => toast.add({ title: 'Coming Soon', description: 'Password reset will be available soon.' })
        },
        { type: 'separator' },
        {
          label: user.is_active ? 'Deactivate' : 'Activate',
          icon: user.is_active ? 'i-lucide-user-x' : 'i-lucide-user-check',
          color: user.is_active ? 'warning' : 'success' as const,
          onSelect: () => toggleStatus(user)
        },
        { type: 'separator' },
        {
          label: 'Delete User',
          icon: 'i-lucide-trash-2',
          color: 'error' as const,
          onSelect: () => toast.add({ title: 'Danger!', description: 'Delete functionality coming soon.' })
        }
      ]
      return h(UDropdownMenu, {
        items,
        content: { align: 'end' },
        'aria-label': 'User actions'
      }, () => h(UButton, {
        icon: 'i-lucide-ellipsis-vertical',
        color: 'neutral',
        variant: 'ghost'
      }))
    }
  }
]

const table = useTemplateRef('table')
const page = ref(1)
const pageSize = 10
const search = ref('')
const isCreateModalOpen = ref(false)

const loadUsers = async () => {
  await fetchUsers({
    page: page.value,
    page_size: pageSize,
    username: search.value || undefined
  })
}

watch([page, search], loadUsers)
onMounted(loadUsers)

</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">User Management</h1>
      <div class="flex items-center gap-4">
        <UInput v-model="search" icon="i-lucide-search" placeholder="Search users..." class="max-w-xs" />

        <UDropdownMenu :items="table?.tableApi?.getAllColumns().filter(column => column.getCanHide()).map(column => ({
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

        <UButton label="Add User" icon="i-lucide-user-plus" @click="isCreateModalOpen = true" />
      </div>
    </div>

    <UsersCreateUser v-model:open="isCreateModalOpen" @success="loadUsers" />

    <UCard :ui="{ body: 'p-0' }">
      <UTable ref="table" :data="users" :columns="columns" :loading="loading" sticky class="max-h-[600px]" />

      <template #footer>
        <div class="flex items-center justify-center px-4 py-2">
          <UPagination v-model:page="page" :total="totalUsers" :page-count="pageSize" />
        </div>
      </template>
    </UCard>
  </div>
</template>
