<template>
  <RouterView />
  <AdminChatWidget v-if="isAdminRoute" />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AdminChatWidget from './components/admin/AdminChatWidget.vue'

const route = useRoute()
const isAdminRoute = computed(() =>
  ['/admin', '/dashboard', '/reservations', '/customers'].includes(route.path)
)
</script>