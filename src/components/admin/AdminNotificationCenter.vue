<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Bell, Check, ChevronRight, Clock3 } from 'lucide-vue-next'
import api, { invalidateApiCache } from '@/services/api'
import { getAuthUser } from '@/services/auth'

const READ_KEY_PREFIX = 'picklereserve.admin-notifications-read'
const POLL_INTERVAL = 15_000

const router = useRouter()
const notifications = ref([])
const readIds = ref(new Set())
const isOpen = ref(false)
const isLoading = ref(true)
const errorMessage = ref('')
const browserAlertMessage = ref('')
const userId = getAuthUser()?.id ?? 'admin'
const readStorageKey = `${READ_KEY_PREFIX}.${userId}`
let pollTimer
let previousIds = null
let fetchInProgress = false

const unreadCount = computed(() =>
  notifications.value.filter((booking) => !readIds.value.has(booking.id)).length
)

const permission = computed(() =>
  typeof Notification === 'undefined' ? 'unsupported' : Notification.permission
)

function loadReadIds() {
  try {
    const stored = JSON.parse(localStorage.getItem(readStorageKey) || '[]')
    return new Set(Array.isArray(stored) ? stored : [])
  } catch (error) {
    console.error('Could not read notification preferences:', error)
    return new Set()
  }
}

function saveReadIds() {
  try {
    localStorage.setItem(readStorageKey, JSON.stringify([...readIds.value]))
  } catch (error) {
    console.error('Could not save notification preferences:', error)
    errorMessage.value = 'Could not save notification read status in this browser.'
  }
}

function notifyForNewBookings(bookings) {
  if (previousIds === null) {
    previousIds = new Set(bookings.map((booking) => booking.id))
    return
  }

  const newBookings = bookings.filter((booking) => !previousIds.has(booking.id))
  previousIds = new Set(bookings.map((booking) => booking.id))
  if (newBookings.length) {
    invalidateApiCache('/bookings', '/dashboard', '/admin/customers')
  }

  if (permission.value !== 'granted') return

  newBookings.forEach((booking) => {
    try {
      new Notification('New reservation request', {
        body: `${booking.customer_name} booked ${booking.court?.name || 'a court'}.`,
        tag: `booking-${booking.id}`
      })
    } catch (error) {
      console.error('Could not display a browser notification:', error)
      browserAlertMessage.value = 'A browser alert could not be displayed. In-app notifications are still available.'
    }
  })
}

async function fetchNotifications() {
  if (fetchInProgress) return
  fetchInProgress = true

  try {
    const response = await api.get('/admin/notifications')
    if (!Array.isArray(response.data)) {
      throw new Error('The notifications API returned an invalid response.')
    }

    notifications.value = response.data
    notifyForNewBookings(response.data)
    errorMessage.value = ''
  } catch (error) {
    console.error('Failed to fetch booking notifications:', error)
    errorMessage.value = 'Could not refresh reservation notifications. Check your connection.'
  } finally {
    isLoading.value = false
    fetchInProgress = false
  }
}

function markAllRead() {
  readIds.value = new Set([
    ...readIds.value,
    ...notifications.value.map((booking) => booking.id)
  ])
  saveReadIds()
}

function openReservation(booking) {
  readIds.value = new Set(readIds.value).add(booking.id)
  saveReadIds()
  invalidateApiCache('/bookings')
  isOpen.value = false
  router.push('/reservations')
}

async function enableBrowserAlerts() {
  browserAlertMessage.value = ''

  if (typeof Notification === 'undefined') {
    browserAlertMessage.value = 'Browser notifications are not supported here.'
    return
  }

  try {
    const result = await Notification.requestPermission()
    browserAlertMessage.value = result === 'granted'
      ? 'Browser alerts are enabled for new bookings.'
      : 'Browser alerts were not enabled. In-app notifications will still work.'
  } catch (error) {
    console.error('Could not request browser notification permission:', error)
    browserAlertMessage.value = 'Could not enable browser alerts. In-app notifications will still work.'
  }
}

function formatBookingTime(value) {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(date)
}

function handleDocumentVisibility() {
  if (document.visibilityState === 'visible') fetchNotifications()
}

onMounted(() => {
  readIds.value = loadReadIds()
  fetchNotifications()
  pollTimer = window.setInterval(fetchNotifications, POLL_INTERVAL)
  document.addEventListener('visibilitychange', handleDocumentVisibility)
})

onUnmounted(() => {
  window.clearInterval(pollTimer)
  document.removeEventListener('visibilitychange', handleDocumentVisibility)
})
</script>

<template>
  <div class="notification-center">
    <button
      class="notification"
      type="button"
      :aria-expanded="isOpen"
      :aria-label="`Notifications, ${unreadCount} unread reservations`"
      @click="isOpen = !isOpen"
    >
      <Bell :size="18" />
      <span v-if="unreadCount" class="notification-count">
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
    </button>

    <Transition name="notification-panel">
      <section v-if="isOpen" class="notification-panel" aria-label="Booking notifications">
        <header class="panel-header">
          <div>
            <h2>Notifications</h2>
            <p>New reservation requests</p>
          </div>
          <button
            class="mark-read"
            type="button"
            :disabled="unreadCount === 0"
            @click="markAllRead"
          >
            <Check :size="14" />
            Mark read
          </button>
        </header>

        <p v-if="errorMessage" class="panel-error" role="alert">{{ errorMessage }}</p>
        <p v-if="browserAlertMessage" class="panel-info" role="status">{{ browserAlertMessage }}</p>

        <div v-if="isLoading && !notifications.length" class="panel-empty">
          Checking for reservations...
        </div>
        <div v-else-if="!notifications.length && !errorMessage" class="panel-empty">
          <span class="empty-bell"><Bell :size="19" /></span>
          <strong>You're all caught up</strong>
          <span>New booking requests will appear here.</span>
        </div>

        <div v-else class="notification-list">
          <button
            v-for="booking in notifications"
            :key="booking.id"
            class="notification-item"
            :class="{ unread: !readIds.has(booking.id) }"
            type="button"
            @click="openReservation(booking)"
          >
            <span class="item-indicator"></span>
            <span class="item-copy">
              <strong>New booking request</strong>
              <span>{{ booking.customer_name }} · {{ booking.court?.name || 'Court' }}</span>
              <small><Clock3 :size="12" /> {{ formatBookingTime(booking.created_at) }}</small>
            </span>
            <ChevronRight :size="16" class="item-arrow" />
          </button>
        </div>

        <footer class="panel-footer">
          <button
            v-if="permission === 'default'"
            class="browser-alerts"
            type="button"
            @click="enableBrowserAlerts"
          >
            Enable browser alerts
          </button>
          <span v-else-if="permission === 'granted'" class="alerts-enabled">Browser alerts enabled</span>
          <span v-else-if="permission === 'denied'" class="alerts-enabled">Browser alerts blocked</span>
          <span v-else class="alerts-enabled">Live updates every 15 seconds</span>
          <button class="refresh-button" type="button" aria-label="Refresh notifications" @click="fetchNotifications">
            Refresh
          </button>
        </footer>
      </section>
    </Transition>
  </div>
</template>

<style scoped>
.notification-center { position: relative; display: inline-flex; flex: 0 0 auto; align-items: center; }
.notification { position: relative; display: inline-flex; flex: 0 0 auto; align-items: center; justify-content: center; cursor: pointer; }
.notification-count { position: absolute; top: -5px; right: -5px; width: auto !important; height: auto !important; min-width: 17px; padding: 2px 4px; border: 1px solid #0f172a !important; border-radius: 999px; background: #ef4444 !important; color: #fff; box-shadow: none !important; font-size: 9px; font-weight: 800; line-height: 1.1; text-align: center; animation: none !important; }
.notification-panel { position: absolute; z-index: 100; top: calc(100% + 12px); right: 0; width: min(370px, calc(100vw - 28px)); overflow: hidden; border: 1px solid rgba(226, 232, 240, .13); border-radius: 15px; background: #111c30; box-shadow: 0 22px 65px rgba(0, 0, 0, .45); color: #f8fafc; }
.panel-header { min-height: 72px; padding: 14px 16px; border-bottom: 1px solid rgba(226, 232, 240, .09); display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.panel-header h2 { margin: 0; color: #f8fafc; font-size: 14px; font-weight: 750; }
.panel-header p { margin: 5px 0 0; color: #a3b0c2; font-size: 11px; }
.mark-read { display: inline-flex; align-items: center; gap: 5px; padding: 7px 8px; border: 1px solid rgba(163, 230, 53, .16); border-radius: 8px; background: rgba(163, 230, 53, .055); color: #c9ef91; font: inherit; font-size: 10px; cursor: pointer; }
.mark-read:disabled { opacity: .45; cursor: not-allowed; }
.panel-empty { min-height: 154px; padding: 24px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: #93a2b7; font-size: 11px; text-align: center; }
.panel-empty strong { color: #e8eef6; font-size: 12px; }
.empty-bell { width: 38px; height: 38px; margin-bottom: 2px; border: 1px solid rgba(163, 230, 53, .15); border-radius: 12px; display: grid; place-items: center; background: rgba(163, 230, 53, .06); color: #a3e635; }
.notification-list { max-height: 330px; overflow-y: auto; }
.notification-item { width: 100%; padding: 13px 15px; border: 0; border-bottom: 1px solid rgba(226, 232, 240, .065); background: transparent; display: flex; align-items: flex-start; gap: 11px; color: inherit; text-align: left; cursor: pointer; transition: background .15s ease; }
.notification-item:hover, .notification-item.unread { background: rgba(163, 230, 53, .045); }
.item-indicator { width: 7px; height: 7px; flex: 0 0 auto; margin-top: 5px; border-radius: 50%; background: transparent; }
.unread .item-indicator { background: #a3e635; box-shadow: 0 0 8px rgba(163, 230, 53, .5); }
.item-copy { min-width: 0; flex: 1; display: flex; flex-direction: column; gap: 4px; }
.item-copy strong { color: #eaf0f8; font-size: 11px; font-weight: 700; }
.item-copy > span { overflow: hidden; color: #a3b0c2; font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
.item-copy small { display: inline-flex; align-items: center; gap: 4px; margin-top: 2px; color: #8291a7; font-size: 9px; }
.item-arrow { flex: 0 0 auto; margin-top: 8px; color: #718198; }
.panel-error, .panel-info { margin: 10px 12px 0; padding: 9px 10px; border: 1px solid rgba(248, 113, 113, .2); border-radius: 8px; background: rgba(127, 29, 29, .15); color: #fecaca; font-size: 10px; line-height: 1.45; }
.panel-info { border-color: rgba(163, 230, 53, .17); background: rgba(163, 230, 53, .045); color: #d9f99d; }
.panel-footer { min-height: 47px; padding: 8px 13px; border-top: 1px solid rgba(226, 232, 240, .08); display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.browser-alerts, .refresh-button { padding: 5px 0; border: 0; background: transparent; color: #b7e96b; font: inherit; font-size: 10px; cursor: pointer; }
.refresh-button { color: #a3b0c2; }
.alerts-enabled { color: #8795a9; font-size: 9px; }
.notification-panel-enter-active, .notification-panel-leave-active { transition: opacity .15s ease, transform .15s ease; transform-origin: top right; }
.notification-panel-enter-from, .notification-panel-leave-to { opacity: 0; transform: translateY(-5px) scale(.98); }
@media (max-width: 480px) { .notification-panel { right: -54px; } }
@media (prefers-reduced-motion: reduce) { .notification-panel-enter-active, .notification-panel-leave-active { transition: none; } }
</style>
