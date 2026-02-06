<script setup lang="ts">
const isOpen = defineModel<boolean>('open', { default: false })
const emit = defineEmits(['success'])

const { roles, fetchRoles } = useRoles()
const { createUser, loading } = useUsers()
const toast = useToast()

const form = reactive({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: 'DefaultPassword123!',
    role: 0
})

onMounted(() => {
    fetchRoles({ page_size: 100 })
})

const handleCreateUser = async () => {
    const response = await createUser(form)
    if (response?.status) {
        toast.add({
            title: 'User Created',
            description: `User ${form.username} has been created successfully.`,
            color: 'success'
        })
        isOpen.value = false
        // Reset form
        Object.assign(form, {
            username: '',
            email: '',
            first_name: '',
            last_name: '',
            role: 0
        })
        emit('success')
    } else {
        toast.add({
            title: 'Error',
            description: response?.message || 'Failed to create user',
            color: 'error'
        })
    }
}
</script>

<template>
    <UModal v-model:open="isOpen" title="Create New User" :ui="{ content: 'md:max-w-4xl' }"
        description="Fill in the details to add a new system user.">

        <template #content>
            <UForm :state="form" class="space-y-4 p-4" @submit="handleCreateUser">
                <div class="grid grid-cols-2 gap-4">
                    <UFormField label="Username" name="username" required>
                        <UInput v-model="form.username" placeholder="johndoe" class="w-full" />
                    </UFormField>

                    <UFormField label="Email" name="email" required>
                        <UInput v-model="form.email" type="email" placeholder="john@example.com" class="w-full" />
                    </UFormField>

                    <UFormField label="First Name" name="first_name" required>
                        <UInput v-model="form.first_name" placeholder="John" class="w-full" />
                    </UFormField>

                    <UFormField label="Last Name" name="last_name" required>
                        <UInput v-model="form.last_name" placeholder="Doe" class="w-full" />
                    </UFormField>
                </div>

                <UFormField label="Role" name="role">
                    <USelect v-model="form.role" value-key="id" :items="roles" class="w-48" label-key="name" />
                </UFormField>

                <div class="flex justify-end gap-3 mt-6">
                    <UButton label="Cancel" color="neutral" variant="ghost" @click="isOpen = false" />
                    <UButton type="submit" label="Create User" :loading="loading" />
                </div>
            </UForm>
        </template>
    </UModal>
</template>
