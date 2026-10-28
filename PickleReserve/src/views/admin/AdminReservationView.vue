<script setup>
import { ref, onMounted, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import PickleReserveLogo from '@/components/ui/PickleReserveLogo.vue'
import api, { getCached } from '@/services/api'
import AdminNotificationCenter from '@/components/admin/AdminNotificationCenter.vue'
import { logout } from '@/services/logout'

import {
  Search,
  Grid2X2,
  CalendarDays,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  Ban
} from 'lucide-vue-next'

const sidebarOpen = ref(false)
const router = useRouter()
const searchQuery = ref('')
const bookings = ref([])
const isLoading = ref(true)
const updatingBookingIds = ref(new Set())

// Fetch reservations from Laravel backend
const fetchBookings = async () => {
  isLoading.value = true
  try {
    const response = await getCached('/bookings')
    bookings.value = Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error('Failed to load reservations:', error)
  } finally {
    isLoading.value = false
  }
}

// Update Reservation Status (Approve / Reject)
const updateStatus = async (id, newStatus) => {
  const booking = bookings.value.find((item) => item.id === id)
  if (!booking || updatingBookingIds.value.has(id)) return

  const previousStatus = booking.status
  booking.status = newStatus
  updatingBookingIds.value = new Set(updatingBookingIds.value).add(id)

  try {
    const response = await api.patch(`/bookings/${id}/status`, { status: newStatus })
    Object.assign(booking, response.data)
  } catch (error) {
    console.error('Failed to update status:', error)
    booking.status = previousStatus
    alert('Failed to update reservation status.')
  } finally {
    const updatingIds = new Set(updatingBookingIds.value)
    updatingIds.delete(id)
    updatingBookingIds.value = updatingIds
  }
}

// Search filter
const filteredBookings = computed(() => {
  if (!searchQuery.value.trim()) return bookings.value
  const query = searchQuery.value.toLowerCase()
  return bookings.value.filter((b) => {
    const customer = (b.customer_name || b.user?.name || '').toLowerCase()
    const courtName = (b.court?.name || '').toLowerCase()
    const idStr = String(b.id || '')
    return customer.includes(query) || courtName.includes(query) || idStr.includes(query)
  })
})

// Format helpers
const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  const d = new Date(dateStr)
  return isNaN(d) ? dateStr : d.toLocaleDateString()
}

const formatTime = (startStr, endStr) => {
  if (!startStr) return 'N/A'
  const start = new Date(startStr)
  const end = new Date(endStr)
  if (isNaN(start)) return startStr
  const startFormatted = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  if (isNaN(end)) return startFormatted
  const endFormatted = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return `${startFormatted} - ${endFormatted}`
}

const calculateDuration = (startStr, endStr) => {
  if (!startStr || !endStr) return '1 hr'
  const start = new Date(startStr)
  const end = new Date(endStr)
  const diffHours = Math.abs(end - start) / 36e5
  return diffHours ? `${diffHours} hr(s)` : '1 hr'
}

onMounted(fetchBookings)
</script>

<template>
  <div class="reservations-page pr-admin-skin">

    <!-- MOBILE OVERLAY -->
    <div
      v-if="sidebarOpen"
      class="sidebar-overlay"
      @click="sidebarOpen = false"
    ></div>

    <!-- SIDEBAR -->
    <aside class="sidebar" :class="{ 'sidebar-open': sidebarOpen }">
      <div class="logo-area">
        <PickleReserveLogo />
        <button class="mobile-close" @click="sidebarOpen = false"><X :size="20" /></button>
      </div>

      <div class="admin-label">ADMIN PANEL</div>

      <nav class="navigation">
        <RouterLink to="/admin" class="nav-item" active-class="active" @click="sidebarOpen = false">
          <Grid2X2 :size="17" /><span>Dashboard</span>
        </RouterLink>

        <RouterLink to="/dashboard" class="nav-item" active-class="active" @click="sidebarOpen = false">
          <Grid2X2 :size="17" /><span>Courts</span>
        </RouterLink>

        <RouterLink to="/reservations" class="nav-item" active-class="active" @click="sidebarOpen = false">
          <CalendarDays :size="17" /><span>Reservations</span>
        </RouterLink>

        <RouterLink to="/customers" class="nav-item" active-class="active" @click="sidebarOpen = false">
          <Users :size="17" /><span>Customers</span>
        </RouterLink>

        <RouterLink to="/settings" class="nav-item" active-class="active" @click="sidebarOpen = false">
          <Settings :size="17" /><span>Settings</span>
        </RouterLink>
      </nav>

      <div class="sidebar-bottom">
        <button class="logout" @click="logout(router)"><LogOut :size="17" /><span>Logout</span></button>
      </div>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="main">
      <header class="top-header">
        <div class="header-left">
          <button class="mobile-menu" @click="sidebarOpen = true"><Menu :size="21" /></button>
          <div>
            <h1>Reservations</h1>
            <p>Welcome back, Administrator</p>
          </div>
        </div>

        <div class="header-right">
          <div class="header-search">
            <Search :size="16" />
            <input type="text" placeholder="Search..." />
          </div>

          <AdminNotificationCenter />

          <div class="profile">
            <div class="profile-avatar"><Users :size="15" /></div>
            <div class="profile-info">
              <strong>Administrator</strong><span>Admin</span>
            </div>
          </div>
        </div>
      </header>

      <section class="content">
        <div class="page-heading">
          <h2>Reservation Management</h2>
          <p>Approve, reject, and monitor all bookings.</p>
        </div>

        <div class="card">
          <div class="card-header">
            <h3>All reservations</h3>
            <div class="table-search">
              <Search :size="16" />
              <input v-model="searchQuery" type="text" placeholder="Search..." />
            </div>
          </div>

          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Reservation #</th>
                  <th>Customer</th>
                  <th>Court</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Duration</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>

                <!-- DATA ROWS -->
                <tr v-for="b in filteredBookings" :key="b.id" class="table-row">
                  <td class="font-bold">#{{ b.id }}</td>
                  <td>
                    <div class="font-bold">{{ b.customer_name || b.user?.name || 'Customer' }}</div>
                    <div class="text-sub">{{ b.customer_phone || b.customer_email || '' }}</div>
                  </td>
                  <td>{{ b.court?.name || 'Court #' + b.court_id }}</td>
                  <td>{{ formatDate(b.start_time) }}</td>
                  <td>{{ formatTime(b.start_time, b.end_time) }}</td>
                  <td>{{ calculateDuration(b.start_time, b.end_time) }}</td>
                  <td>
                    <div>₱{{ parseFloat(b.total_price || 0).toFixed(2) }}</div>
                    <div class="text-sub">{{ b.payment_method || 'Venue' }}</div>
                  </td>
                  <td>
                    <span :class="['status-badge', (b.status || 'pending').toLowerCase()]">
                      {{ b.status || 'Pending' }}
                    </span>
                  </td>
                  <td>
                    <div class="actions" v-if="!b.status || b.status === 'Pending'">
                      <button class="btn-approve" @click="updateStatus(b.id, 'Approved')" title="Approve">
                        <Check :size="14" />
                      </button>
                      <button class="btn-reject" @click="updateStatus(b.id, 'Rejected')" title="Reject">
                        <Ban :size="14" />
                      </button>
                    </div>
                    <span v-else class="text-sub">{{ updatingBookingIds.has(b.id) ? 'Saving...' : 'Completed' }}</span>
                  </td>
                </tr>

                <!-- EMPTY STATE -->
                <tr v-if="filteredBookings.length === 0">
                  <td colspan="9" class="empty-state">
                    <div class="empty-content">
                      <div class="empty-icon"><CalendarDays :size="20" /></div>
                      <strong>No reservations available</strong>
                      <span>Reservations will appear here when customers make bookings.</span>
                    </div>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>

          <div class="table-footer">
            <span>Showing {{ filteredBookings.length }} reservations</span>
            <div class="pagination">
              <button :disabled="filteredBookings.length === 0"><ChevronLeft :size="16" /></button>
              <span>{{ filteredBookings.length > 0 ? '1 / 1' : '0 / 0' }}</span>
              <button :disabled="filteredBookings.length === 0"><ChevronRight :size="16" /></button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.reservations-page {
  min-height: 100vh;
  background: #f7f9fa;
  color: #111827;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, sans-serif;
}

.sidebar {
  position: fixed; left: 0; top: 0; bottom: 0; width: 212px;
  background: #ffffff; border-right: 1px solid #edf0f2;
  display: flex; flex-direction: column; z-index: 50;
}

.logo-area { height: 64px; padding: 0 16px; display: flex; align-items: center; gap: 8px; }
.admin-label { padding: 0 16px; margin: 2px 0 10px; color: #98a2b3; font-size: 9px; font-weight: 700; letter-spacing: 0.7px; }

.navigation { padding: 0 10px; display: flex; flex-direction: column; gap: 3px; }
.nav-item { height: 36px; padding: 0 10px; border: none; border-radius: 10px; background: transparent; display: flex; align-items: center; gap: 10px; color: #344054; font-size: 13px; text-decoration: none; }
.nav-item:hover { background: #f5f8f6; }
.nav-item.active { background: #effbf3; color: #119447; font-weight: 600; }

.sidebar-bottom { margin-top: auto; padding: 10px; border-top: 1px solid #edf0f2; }
.logout { border: none; background: transparent; display: flex; align-items: center; gap: 9px; padding: 10px; color: #ef4444; font-size: 13px; cursor: pointer; }

.main { margin-left: 212px; min-height: 100vh; }
.top-header { height: 64px; background: #ffffff; border-bottom: 1px solid #edf0f2; padding: 0 22px; display: flex; align-items: center; justify-content: space-between; }
.header-left { display: flex; align-items: center; gap: 12px; }
.header-left h1 { margin: 0; font-size: 16px; font-weight: 700; }
.header-left p { margin: 2px 0 0; font-size: 12px; color: #7b8491; }
.header-right { display: flex; align-items: center; gap: 10px; }

.header-search, .table-search { height: 33px; border: 1px solid #dfe4e8; border-radius: 10px; background: #ffffff; display: flex; align-items: center; gap: 7px; padding: 0 10px; color: #98a2b3; }
.header-search { width: 187px; }
.header-search input, .table-search input { width: 100%; border: none; outline: none; background: transparent; font-size: 12px; }

.notification { width: 35px; height: 35px; border: 1px solid #dfe4e8; border-radius: 10px; background: white; display: flex; align-items: center; justify-content: center; position: relative; cursor: pointer; }
.notification-dot { position: absolute; width: 5px; height: 5px; top: 7px; right: 7px; border-radius: 50%; background: #fbbf24; }

.profile { display: flex; align-items: center; gap: 8px; }
.profile-avatar { width: 31px; height: 31px; border-radius: 50%; background: #343434; color: white; display: flex; align-items: center; justify-content: center; }
.profile-info { display: flex; flex-direction: column; }
.profile-info strong { font-size: 12px; }
.profile-info span { font-size: 10px; color: #8a94a3; }

.content { padding: 22px; max-width: 1200px; }
.page-heading { margin-bottom: 20px; }
.page-heading h2 { margin: 0; font-size: 18px; font-weight: 750; }
.page-heading p { margin: 4px 0 0; color: #667085; font-size: 12px; }

.card { background: white; border: 1px solid #edf0f2; border-radius: 13px; overflow: hidden; box-shadow: 0 3px 10px rgba(16, 24, 40, 0.035); }
.card-header { height: 58px; padding: 0 14px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #edf0f2; }
.card-header h3 { margin: 0; font-size: 13px; font-weight: 700; }
.table-search { width: 214px; }

.table-wrapper { overflow-x: auto; }
table { width: 100%; min-width: 900px; border-collapse: collapse; font-size: 11px; text-align: left; }
thead { background: #fbfcfd; }
th { height: 48px; padding: 0 14px; color: #667085; font-weight: 600; border-bottom: 1px solid #edf0f2; }
td { padding: 12px 14px; border-bottom: 1px solid #edf0f2; color: #344054; vertical-align: middle; }

.font-bold { font-weight: 600; color: #111827; }
.text-sub { color: #8792a2; font-size: 10px; }

.status-badge { padding: 3px 8px; border-radius: 5px; font-size: 10px; font-weight: 600; text-transform: capitalize; }
.status-badge.approved { background: #f0fdf4; color: #16a34a; }
.status-badge.pending { background: #fef7c7; color: #d89b00; }
.status-badge.rejected { background: #fef2f2; color: #ef4444; }

.actions { display: flex; gap: 6px; }
.btn-approve { background: #16a34a; color: white; border: none; padding: 5px; border-radius: 5px; cursor: pointer; display: flex; align-items: center; }
.btn-reject { background: #ef4444; color: white; border: none; padding: 5px; border-radius: 5px; cursor: pointer; display: flex; align-items: center; }

.empty-state { height: 260px; text-align: center; }
.empty-content { display: flex; flex-direction: column; align-items: center; justify-content: center; color: #98a2b3; }
.empty-icon { width: 44px; height: 44px; border-radius: 12px; background: #ecfccb; color: #65a30d; display: flex; align-items: center; justify-content: center; margin-bottom: 10px; }

.table-footer { height: 46px; padding: 0 14px; border-top: 1px solid #edf0f2; display: flex; align-items: center; justify-content: space-between; color: #667085; font-size: 11px; }
.pagination { display: flex; align-items: center; gap: 8px; }
.pagination button { width: 26px; height: 26px; border: 1px solid #e4e7ec; border-radius: 7px; background: white; color: #98a2b3; display: flex; align-items: center; justify-content: center; }

.mobile-menu, .mobile-close { display: none; border: none; background: transparent; cursor: pointer; }
.sidebar-overlay { display: none; }

@media (max-width: 700px) {
  .sidebar { transform: translateX(-100%); transition: transform 0.2s ease; }
  .sidebar.sidebar-open { transform: translateX(0); }
  .sidebar-overlay { display: block; position: fixed; inset: 0; background: rgba(0, 0, 0, 0.25); z-index: 40; }
  .main { margin-left: 0; }
  .mobile-menu, .mobile-close { display: flex; }
  .header-search, .profile-info { display: none; }
}
</style>