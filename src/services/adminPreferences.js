import { ref } from 'vue'

const SHOW_MESSAGES_KEY = 'picklereserve.admin-messages-enabled'

export const ADMIN_MESSAGES_STORAGE_KEY = 'picklereserve.admin-chat-preview'
export const ADMIN_MESSAGES_CLEARED_EVENT = 'picklereserve:admin-messages-cleared'

export const showAdminMessages = ref(localStorage.getItem(SHOW_MESSAGES_KEY) !== 'false')

export function setShowAdminMessages(value) {
  localStorage.setItem(SHOW_MESSAGES_KEY, String(value))
  showAdminMessages.value = value
}
