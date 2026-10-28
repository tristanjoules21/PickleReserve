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
  UserRound,
  Eye,
  Mail,
  Phone,
  Calendar
} from 'lucide-vue-next'

const sidebarOpen = ref(false)
const router = useRouter()
const searchQuery = ref('')
const customers = ref([])
const isLoading = ref(true)

// Drawer state for customer details
const isDrawerOpen = ref(false)
const selectedCustomer = ref(null)
const customerBookings = ref([])
const isLoadingHistory = ref(false)

// Fetch all aggregated customers from Laravel backend
const fetchCustomers = async () => {
  try {
    const response = await getCached('/admin/customers')
    customers.value = response.data
  } catch (error) {
    console.error('Failed to fetch customers:', error)
  } finally {
    isLoading.value = false
  }
}

// Open slide-over drawer and load specific customer's reservations
const openCustomerDetails = async (customer) => {
  selectedCustomer.value = customer
  isDrawerOpen.value = true
  isLoadingHistory.value = true

  try {
    const response = await getCached('/bookings')
    const allBookings = Array.isArray(response.data) ? response.data : []

    // Filter bookings belonging to this customer by email or phone
    customerBookings.value = allBookings.filter(
      (b) =>
        (customer.email && b.customer_email === customer.email) ||
        (customer.phone && b.customer_phone === customer.phone) ||
        (customer.name && b.customer_name === customer.name)
    )
  } catch (error) {
    console.error('Failed to load customer booking history:', error)
  } finally {
    isLoadingHistory.value = false
  }
}

const closeDrawer = () => {
  isDrawerOpen.value = false
  selectedCustomer.value = null
  customerBookings.value = []
}

// Compute filtered list based on search query
const filteredCustomers = computed(() => {
  if (!searchQuery.value.trim()) return customers.value
  const query = searchQuery.value.toLowerCase()
  return customers.value.filter(
    (cust) =>
      (cust.name && cust.name.toLowerCase().includes(query)) ||
      (cust.email && cust.email.toLowerCase().includes(query)) ||
      (cust.phone && cust.phone.includes(query))
  )
})

onMounted(fetchCustomers)
</script>

<template>
  <div class="customers-page pr-admin-skin">

    <!-- MOBILE OVERLAY -->
    <div
      v-if="sidebarOpen"
      class="sidebar-overlay"
      @click="sidebarOpen = false"
    ></div>


    <!-- =========================
         SIDEBAR
    ========================== -->

    <aside
      class="sidebar"
      :class="{ 'sidebar-open': sidebarOpen }"
    >

      <!-- LOGO -->
      <div class="logo-area">
        <PickleReserveLogo />
        <button
          class="mobile-close"
          @click="sidebarOpen = false"
        >
          <X :size="20" />
        </button>
      </div>

      <!-- ADMIN LABEL -->
      <div class="admin-label">
        ADMIN PANEL
      </div>

      <!-- NAVIGATION -->
      <nav class="navigation">
        <RouterLink to="/admin" class="nav-item" active-class="active" @click="sidebarOpen = false">
          <Grid2X2 :size="17" />
          <span>Dashboard</span>
        </RouterLink>

        <RouterLink to="/dashboard" class="nav-item" active-class="active" @click="sidebarOpen = false">
          <Grid2X2 :size="17" />
          <span>Courts</span>
        </RouterLink>

        <RouterLink to="/reservations" class="nav-item" active-class="active" @click="sidebarOpen = false">
          <CalendarDays :size="17" />
          <span>Reservations</span>
        </RouterLink>

        <RouterLink to="/customers" class="nav-item" active-class="active" @click="sidebarOpen = false">
          <Users :size="17" />
          <span>Customers</span>
        </RouterLink>

        <RouterLink to="/settings" class="nav-item" active-class="active" @click="sidebarOpen = false">
          <Settings :size="17" />
          <span>Settings</span>
        </RouterLink>
      </nav>

      <!-- LOGOUT -->
      <div class="sidebar-bottom">
        <button class="logout" @click="logout(router)">
          <LogOut :size="17" />
          <span>Logout</span>
        </button>
      </div>

    </aside>


    <!-- =========================
         MAIN
    ========================== -->

    <main class="main">

      <!-- HEADER -->
      <header class="top-header">
        <div class="header-left">
          <button
            class="mobile-menu"
            @click="sidebarOpen = true"
          >
            <Menu :size="21" />
          </button>

          <div>
            <h1>Customers</h1>
            <p>Welcome back, Administrator</p>
          </div>
        </div>

        <div class="header-right">
          <div class="header-search">
            <Search :size="16" />
            <input
              type="text"
              placeholder="Search..."
            />
          </div>

          <AdminNotificationCenter />

          <div class="profile">
            <div class="profile-avatar">
              <Users :size="15" />
            </div>
            <div class="profile-info">
              <strong>Administrator</strong>
              <span>Administrator</span>
            </div>
          </div>
        </div>
      </header>


      <!-- CONTENT -->
      <section class="content">

        <!-- PAGE HEADING -->
        <div class="page-heading">
          <div>
            <h2>Customer Management</h2>
            <p>Manage your players and their accounts.</p>
          </div>
        </div>

        <!-- CUSTOMERS CARD -->
        <div class="customers-card">

          <div class="card-header">
            <h3>All customers</h3>
            <div class="table-search">
              <Search :size="16" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search..."
              />
            </div>
          </div>

          <!-- TABLE -->
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Reservations</th>
                  <th>Joined</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                <!-- CLICKABLE DATA ROWS -->
                <tr
                  v-for="(customer, index) in filteredCustomers"
                  :key="index"
                  class="data-row"
                  @click="openCustomerDetails(customer)"
                >
                  <td class="customer-cell">
                    <strong class="cust-name">{{ customer.name }}</strong>
                    <span class="cust-email">{{ customer.email }}</span>
                  </td>

                  <td>
                    {{ customer.phone || 'N/A' }}
                  </td>

                  <td>
                    {{ customer.total_reservations }} booking(s)
                  </td>

                  <td>
                    {{ new Date(customer.joined).toLocaleDateString() }}
                  </td>

                  <td>
                    <span class="status-badge active">Active</span>
                  </td>

                  <td>
                    <button
                      class="btn-view"
                      @click.stop="openCustomerDetails(customer)"
                    >
                      <Eye :size="14" />
                      <span>View Details</span>
                    </button>
                  </td>
                </tr>

                <!-- EMPTY STATE -->
                <tr v-if="filteredCustomers.length === 0">
                  <td
                    colspan="6"
                    class="empty-state"
                  >
                    <div class="empty-content">
                      <div class="empty-icon">
                        <UserRound :size="20" />
                      </div>
                      <strong>No customers available</strong>
                      <span>Customer accounts will appear here when users register or book.</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- FOOTER -->
          <div class="table-footer">
            <span>Showing {{ filteredCustomers.length }} customers</span>
            <div class="pagination">
              <button :disabled="filteredCustomers.length === 0">
                <ChevronLeft :size="16" />
              </button>
              <span>{{ filteredCustomers.length > 0 ? '1 / 1' : '0 / 0' }}</span>
              <button :disabled="filteredCustomers.length === 0">
                <ChevronRight :size="16" />
              </button>
            </div>
          </div>

        </div>

      </section>

    </main>


    <!-- =========================
         CUSTOMER DETAILS DRAWER
    ========================== -->

    <div
      v-if="isDrawerOpen"
      class="drawer-overlay"
      @click="closeDrawer"
    >
      <div class="drawer-content" @click.stop>

        <div class="drawer-header">
          <div>
            <h2>Customer Details</h2>
            <p>Account profile & reservation history</p>
          </div>
          <button class="close-btn" @click="closeDrawer">
            <X :size="18" />
          </button>
        </div>

        <div class="drawer-body" v-if="selectedCustomer">

          <!-- PROFILE OVERVIEW CARD -->
          <div class="profile-card">
            <div class="profile-avatar-lg">
              {{ selectedCustomer.name ? selectedCustomer.name.charAt(0).toUpperCase() : 'U' }}
            </div>
            <div class="profile-meta">
              <h3>{{ selectedCustomer.name }}</h3>
              <p><Mail :size="13" /> {{ selectedCustomer.email }}</p>
              <p><Phone :size="13" /> {{ selectedCustomer.phone || 'No phone provided' }}</p>
            </div>
          </div>

          <!-- STATS SUMMARY -->
          <div class="drawer-stats">
            <div class="d-stat">
              <span>Total Bookings</span>
              <strong>{{ selectedCustomer.total_reservations }}</strong>
            </div>
            <div class="d-stat">
              <span>First Booking</span>
              <strong>{{ new Date(selectedCustomer.joined).toLocaleDateString() }}</strong>
            </div>
          </div>

          <!-- RESERVATION HISTORY LIST -->
          <div class="history-section">
            <h4>Reservation History</h4>

            <div v-if="isLoadingHistory" class="loading-state">
              Loading history...
            </div>

            <div v-else class="history-list">
              <div
                v-for="b in customerBookings"
                :key="b.id"
                class="history-item"
              >
                <div class="history-left">
                  <strong>{{ b.court?.name || 'Court #' + b.court_id }}</strong>
                  <small><Calendar :size="11" /> {{ new Date(b.start_time).toLocaleString() }}</small>
                </div>
                <div class="history-right">
                  <span class="price">₱{{ parseFloat(b.total_price || 0).toFixed(2) }}</span>
                  <span :class="['badge', (b.status || 'pending').toLowerCase()]">
                    {{ b.status || 'Pending' }}
                  </span>
                </div>
              </div>

              <div v-if="customerBookings.length === 0" class="no-history">
                No reservation history found.
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>

  </div>
</template>


<style scoped>

/* BASE */
.customers-page {
  min-height: 100vh;
  background: #f7f9fa;
  color: #111827;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, sans-serif;
}

/* SIDEBAR */
.sidebar {
  position: fixed; left: 0; top: 0; bottom: 0; width: 212px;
  background: #ffffff; border-right: 1px solid #edf0f2;
  display: flex; flex-direction: column; z-index: 50;
}

.logo-area { height: 64px; padding: 0 16px; display: flex; align-items: center; gap: 8px; }

.admin-label { padding: 0 16px; margin-top: 2px; margin-bottom: 10px; color: #98a2b3; font-size: 9px; font-weight: 700; letter-spacing: 0.7px; }

.navigation { padding: 0 10px; display: flex; flex-direction: column; gap: 3px; }
.nav-item { width: 100%; height: 36px; padding: 0 10px; border: none; border-radius: 10px; background: transparent; display: flex; align-items: center; gap: 10px; color: #344054; font-size: 13px; cursor: pointer; text-decoration: none; }
.nav-item:hover { background: #f5f8f6; }
.nav-item.active { background: #effbf3; color: #119447; font-weight: 600; }

.sidebar-bottom { margin-top: auto; padding: 10px; border-top: 1px solid #edf0f2; }
.logout { border: none; background: transparent; display: flex; align-items: center; gap: 9px; padding: 10px; color: #ef4444; font-size: 13px; cursor: pointer; }

/* MAIN */
.main { margin-left: 212px; min-height: 100vh; }

.top-header { height: 64px; background: #ffffff; border-bottom: 1px solid #edf0f2; padding: 0 22px; display: flex; align-items: center; justify-content: space-between; }
.header-left { display: flex; align-items: center; gap: 12px; }
.header-left h1 { margin: 0; font-size: 16px; font-weight: 700; }
.header-left p { margin: 2px 0 0; font-size: 12px; color: #7b8491; }

.header-right { display: flex; align-items: center; gap: 10px; }
.header-search, .table-search { height: 33px; border: 1px solid #dfe4e8; border-radius: 10px; background: #ffffff; display: flex; align-items: center; gap: 7px; padding: 0 10px; color: #98a2b3; }
.header-search { width: 187px; }
.header-search input, .table-search input { width: 100%; border: none; outline: none; background: transparent; font-size: 12px; }

.notification { width: 35px; height: 35px; border: 1px solid #dfe4e8; border-radius: 10px; background: white; color: #475467; display: flex; align-items: center; justify-content: center; position: relative; cursor: pointer; }
.notification-dot { position: absolute; width: 5px; height: 5px; top: 7px; right: 7px; border-radius: 50%; background: #fbbf24; }

.profile { display: flex; align-items: center; gap: 8px; }
.profile-avatar { width: 31px; height: 31px; border-radius: 50%; background: #343434; color: white; display: flex; align-items: center; justify-content: center; }
.profile-info { display: flex; flex-direction: column; }
.profile-info strong { font-size: 12px; }
.profile-info span { font-size: 10px; color: #8a94a3; }

.content { padding: 22px; max-width: 1100px; }
.page-heading { margin-bottom: 20px; }
.page-heading h2 { margin: 0; font-size: 18px; font-weight: 750; letter-spacing: -0.3px; }
.page-heading p { margin: 4px 0 0; color: #667085; font-size: 12px; }

.customers-card { background: white; border: 1px solid #edf0f2; border-radius: 13px; overflow: hidden; box-shadow: 0 3px 10px rgba(16, 24, 40, 0.035); }
.card-header { height: 58px; padding: 0 14px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #edf0f2; }
.card-header h3 { margin: 0; font-size: 13px; font-weight: 700; }
.table-search { width: 214px; }

/* TABLE */
.table-wrapper { overflow-x: auto; }
table { width: 100%; min-width: 800px; border-collapse: collapse; font-size: 11px; }
thead { background: #fbfcfd; }
th { height: 53px; padding: 0 14px; text-align: left; color: #667085; font-weight: 600; border-bottom: 1px solid #edf0f2; }
td { padding: 14px; border-bottom: 1px solid #edf0f2; color: #344054; }

.data-row { cursor: pointer; transition: background 0.15s ease; }
.data-row:hover { background: #f8fafc; }

.customer-cell { display: flex; flex-direction: column; }
.cust-name { font-weight: 600; color: #111827; }
.cust-email { color: #667085; font-size: 10px; }

.status-badge.active { background: #f0fdf4; color: #16a34a; padding: 3px 8px; border-radius: 5px; font-weight: 600; font-size: 10px; }

.btn-view {
  display: inline-flex; align-items: center; gap: 5px;
  background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0;
  padding: 5px 10px; border-radius: 6px; font-size: 11px; font-weight: 600;
  cursor: pointer; transition: all 0.2s ease;
}
.btn-view:hover { background: #16a34a; color: white; }

/* DRAWER STYLES */
.drawer-overlay {
  position: fixed; inset: 0; background: rgba(0, 0, 0, 0.35);
  z-index: 100; display: flex; justify-content: flex-end;
}
.drawer-content {
  width: 380px; max-width: 100%; background: white; height: 100%;
  display: flex; flex-direction: column; box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.2s ease-out;
}
@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.drawer-header {
  padding: 18px; border-bottom: 1px solid #edf0f2;
  display: flex; justify-content: space-between; align-items: flex-start;
}
.drawer-header h2 { margin: 0; font-size: 15px; font-weight: 750; }
.drawer-header p { margin: 2px 0 0; font-size: 11px; color: #667085; }
.close-btn { border: none; background: transparent; cursor: pointer; color: #667085; }

.drawer-body { padding: 18px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; }

.profile-card {
  display: flex; align-items: center; gap: 14px;
  padding: 14px; background: #f8fafc; border: 1px solid #edf0f2; border-radius: 10px;
}
.profile-avatar-lg {
  width: 42px; height: 42px; border-radius: 50%; background: #16a34a;
  color: white; font-size: 18px; font-weight: 700; display: flex;
  align-items: center; justify-content: center;
}
.profile-meta h3 { margin: 0; font-size: 14px; font-weight: 700; }
.profile-meta p { margin: 3px 0 0; font-size: 11px; color: #667085; display: flex; align-items: center; gap: 5px; }

.drawer-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.d-stat { background: #f8fafc; padding: 10px 12px; border-radius: 8px; border: 1px solid #edf0f2; display: flex; flex-direction: column; }
.d-stat span { font-size: 10px; color: #64748b; }
.d-stat strong { font-size: 14px; color: #0f172a; margin-top: 3px; }

.history-section h4 { margin: 0 0 10px; font-size: 12px; font-weight: 700; }
.history-list { display: flex; flex-direction: column; gap: 8px; }
.history-item {
  padding: 10px 12px; border: 1px solid #edf0f2; border-radius: 8px;
  display: flex; justify-content: space-between; align-items: center;
}
.history-left small { display: flex; align-items: center; gap: 4px; color: #667085; font-size: 10px; margin-top: 2px; }
.history-right { display: flex; flex-direction: column; align-items: flex-end; gap: 3px; }
.price { font-weight: 700; font-size: 11px; }

.badge { padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: 600; text-transform: capitalize; }
.badge.approved { background: #f0fdf4; color: #16a34a; }
.badge.pending { background: #fef7c7; color: #d89b00; }
.badge.rejected { background: #fef2f2; color: #ef4444; }

.loading-state, .no-history { font-size: 11px; color: #98a2b3; text-align: center; padding: 20px 0; }

/* FOOTER */
.table-footer { height: 46px; padding: 0 14px; border-top: 1px solid #edf0f2; display: flex; align-items: center; justify-content: space-between; color: #667085; font-size: 11px; }
.pagination { display: flex; align-items: center; gap: 8px; }
.pagination button { width: 26px; height: 26px; border: 1px solid #e4e7ec; border-radius: 7px; background: white; color: #98a2b3; display: flex; align-items: center; justify-content: center; cursor: pointer; }

/* RESPONSIVE */
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