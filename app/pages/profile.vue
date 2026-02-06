<script setup lang="ts">
const authStore = useAuthStore()
const toast = useToast()

const form = reactive({
    first_name: authStore.user?.first_name || '',
    last_name: authStore.user?.last_name || '',
    email: authStore.user?.email || '',
    username: authStore.user?.username || ''
})

const loading = ref(false)

const handleUpdateProfile = async () => {
    try {
        loading.value = true
        const api = useApi()
        const response = await api<any>('/api/accounts/profile/', {
            method: 'PATCH',
            body: {
                first_name: form.first_name,
                last_name: form.last_name
            }
        })

        if (response?.status) {
            toast.add({
                title: 'Profile Updated',
                description: 'Your profile has been successfully updated.',
                color: 'success'
            })
            // Refresh user data in store
            await authStore.fetchProfile()
        }
    } catch (error) {
        toast.add({
            title: 'Update Failed',
            description: 'An error occurred while updating your profile.',
            color: 'error'
        })
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="max-w-2xl mx-auto space-y-6">
        <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold">My Profile</h1>
        </div>

        <UCard>
            <template #header>
                <div class="flex items-center gap-4">
                    <UAvatar :alt="authStore.user?.username" size="xl" />
                    <div>
                        <h2 class="text-lg font-semibold">{{ authStore.user?.first_name }} {{ authStore.user?.last_name
                            }}</h2>
                        <p class="text-sm text-gray-500">@{{ authStore.user?.username }}</p>
                    </div>
                </div>
            </template>

            <UForm :state="form" class="space-y-4" @submit="handleUpdateProfile">
                <UFormField label="Username" name="username" description="Your unique username cannot be changed here.">
                    <UInput v-model="form.username" disabled />
                </UFormField>

                <UFormField label="Email Address" name="email"
                    description="Your email address is used for notifications.">
                    <UInput v-model="form.email" disabled />
                </UFormField>

                <div class="grid grid-cols-2 gap-4">
                    <UFormField label="First Name" name="first_name">
                        <UInput v-model="form.first_name" placeholder="Enter your first name" />
                    </UFormField>
                    <UFormField label="Last Name" name="last_name">
                        <UInput v-model="form.last_name" placeholder="Enter your last name" />
                    </UFormField>
                </div>

                <div class="flex justify-end pt-4">
                    <UButton type="submit" label="Save Changes" :loading="loading" />
                </div>
            </UForm>
        </UCard>
    </div>
</template>
