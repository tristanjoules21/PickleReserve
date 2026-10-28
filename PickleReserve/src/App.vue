<template>
  <RouterView />
  <AdminChatWidget v-if="isAdminRoute && showAdminMessages" />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AdminChatWidget from './components/admin/AdminChatWidget.vue'
import { showAdminMessages } from './services/adminPreferences'

const route = useRoute()
const isAdminRoute = computed(() =>
  ['/admin', '/dashboard', '/reservations', '/customers', '/settings'].includes(route.path)
)
</script>