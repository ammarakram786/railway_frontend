import { computed } from 'vue'
import { useAuthStore } from '~/stores/auth'

export const useMenu = () => {
  const authStore = useAuthStore()

  const menuItems = computed(() => {
    const sections = []

    // Section 1: General
    sections.push(
      {
        label: 'Profile',
        icon: 'i-lucide-user',
        to: '/profile'
      }
    )

    // Section 2: Management (Using Children)
    sections.push(
      {
        label: 'User Management',
        icon: 'i-lucide-users',
        defaultOpen: true,
        children: [
          {
            label: 'Users',
            icon: 'i-lucide-users',
            to: '/users'
          },
          {
            label: 'Roles',
            icon: 'i-lucide-shield-check',
            to: '/roles'
          }
        ]
      }
    )
    // Section 3: User


    return sections
  })

  return {
    menuItems
  }
}
