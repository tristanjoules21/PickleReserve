<script setup>
import {
  Search,
  Grid2X2,
  CalendarDays,
  Users,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-vue-next'

import { ref, onMounted, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import PickleReserveLogo from '@/components/ui/PickleReserveLogo.vue'
import { getCached } from '@/services/api'
import AdminNotificationCenter from '@/components/admin/AdminNotificationCenter.vue'
import { logout } from '@/services/logout'

const sidebarOpen = ref(false)
const router = useRouter()
const tableSearch = ref('')
const isLoading = ref(true)

// Reactive State from Laravel API
const stats = ref({
  total_reservations: 0,
  active_courts: 0,
  monthly_revenue: 0,
  today_reservations: 0,
  daily_capacity: 0,
  capacity_percentage: 0,
  total_courts: 0,
  courts: [],
  monthly_revenue_change: null,
  peak_hours_revenue: 0,
  off_peak_revenue: 0,
  peak_hours_start: '17:00:00',
  peak_hours_end: '22:00:00',
  revenue_by_day: []
})

const recentReservations = ref([])
const revenueSparkline = computed(() => {
  const values = stats.value.revenue_by_day.map((day) => Number(day.revenue))
  if (values.length < 2) return { line: '', area: '' }

  const min = Math.min(0, ...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const points = values.map((value, index) => ({
    x: (index / (values.length - 1)) * 400,
    y: 130 - ((value - min) / range) * 100,
  }))
  const line = points.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`
    const previous = points[index - 1]
    const midpoint = (previous.x + point.x) / 2
    return `${path} C ${midpoint} ${previous.y}, ${midpoint} ${point.y}, ${point.x} ${point.y}`
  }, '')

  return {
    line,
    area: `${line} L ${points[points.length - 1].x} 150 L ${points[0].x} 150 Z`,
  }
})

const formatCurrency = (value) => Number(value).toLocaleString('en-PH', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const formatPeakHour = (time) => {
  const hour = Number(time.slice(0, 2))
  const displayHour = hour % 12 || 12
  return `${displayHour}${hour < 12 ? 'AM' : 'PM'}`
}

// Fetch aggregated dashboard metrics on mount
const fetchDashboardData = async () => {
  try {
    const response = await getCached('/dashboard')
    stats.value = response.data.metrics
    recentReservations.value = response.data.recent_reservations
  } catch (error) {
    console.error('Failed to fetch dashboard metrics:', error)
  } finally {
    isLoading.value = false
  }
}

// Compute table rows based on search input
const filteredReservations = computed(() => {
  if (!tableSearch.value.trim()) return recentReservations.value
  const query = tableSearch.value.toLowerCase()
  return recentReservations.value.filter(
    (res) =>
      (res.customer_name && res.customer_name.toLowerCase().includes(query)) ||
      (res.court?.name && res.court.name.toLowerCase().includes(query)) ||
      String(res.id).includes(query)
  )
})

onMounted(fetchDashboardData)
</script>

<template>
  <div class="dashboard pr-admin-skin">

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
      <div class="logo">
        <PickleReserveLogo />

        <button
          class="mobile-close"
          @click="sidebarOpen = false"
        >
          <X :size="20" />
        </button>

      </div>


      <!-- LABEL -->
      <div class="sidebar-label">
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
      <div class="logout-area">

        <button class="logout" @click="logout(router)">
          <LogOut :size="17" />
          <span>Logout</span>
        </button>

      </div>

    </aside>


    <!-- =========================
         MAIN CONTENT
    ========================== -->

    <main class="main">


      <!-- HEADER -->

      <header class="header">

        <div class="header-title">

          <button
            class="mobile-menu"
            @click="sidebarOpen = true"
          >
            <Menu :size="21" />
          </button>

          <div>
            <h1>Dashboard</h1>
            <p>Welcome back</p>
          </div>

        </div>


        <div class="header-actions">

          <!-- SEARCH -->

          <div class="search-box">

            <Search :size="16" />

            <input
              type="text"
              placeholder="Search..."
            />

          </div>


          <!-- NOTIFICATION -->

          <AdminNotificationCenter />


          <!-- USER -->

          <div class="user">

            <div class="avatar">
              <Users :size="15" />
            </div>

            <div class="user-details">
              <strong>Administrator</strong>
              <small>Admin</small>
            </div>

          </div>

        </div>

      </header>


      <!-- =========================
           CONTENT
      ========================== -->

      <section class="content">


        <!-- =========================
             STATISTICS
        ========================== -->

        <div class="stats">


          <article class="stat-card stat-reservations">
            <div class="stat-top">
              <div class="stat-title">
                <span class="stat-icon lime"><CalendarDays :size="18" /></span>
                <span>Bookings today</span>
              </div>
              <span class="live-indicator" role="img" aria-label="Live updates"></span>
            </div>

            <div class="stat-value">{{ isLoading ? '--' : stats.today_reservations }}</div>

            <div class="capacity-summary">
              <div class="capacity-track" role="progressbar" aria-label="Daily booking capacity"
                :aria-valuenow="isLoading ? 0 : stats.capacity_percentage" aria-valuemin="0" aria-valuemax="100">
                <span :style="{ width: `${isLoading ? 0 : stats.capacity_percentage}%` }"></span>
              </div>
              <span>{{ isLoading ? 'Loading capacity...' : `${stats.capacity_percentage}% of daily capacity filled` }}</span>
            </div>
          </article>

          <article class="stat-card stat-courts">
            <div class="stat-top">
              <div class="stat-title">
                <span class="stat-icon yellow"><Grid2X2 :size="18" /></span>
                <span>Active courts</span>
              </div>
            </div>

            <div class="stat-value court-count">
              <span>{{ isLoading ? '--' : stats.active_courts }}</span>
              <small>/ {{ isLoading ? '--' : stats.total_courts }} courts</small>
            </div>

            <div class="court-status-list" aria-label="Court status">
              <span v-for="court in stats.courts" :key="court.id"
                class="court-status-pill" :class="{
                  'court-status-reserved': court.is_active && court.is_reserved_today,
                  'court-status-open': court.is_active && !court.is_reserved_today,
                  'court-status-offline': !court.is_active
                }">
                <i></i>{{ court.name }}
                <small>{{ !court.is_active ? 'Offline' : court.is_reserved_today ? 'Reserved' : 'Open' }}</small>
              </span>
            </div>
          </article>

          <article class="stat-card stat-revenue">
            <div class="stat-top">
              <div class="stat-title">Monthly revenue</div>
              <span class="live-indicator" role="img" aria-label="Live updates"></span>
            </div>

            <div class="stat-value">
              {{ isLoading ? '--' : `₱${formatCurrency(stats.monthly_revenue)}` }}
            </div>

            <svg v-if="revenueSparkline.line" class="revenue-sparkline" viewBox="0 0 400 160"
              preserveAspectRatio="none" role="img" aria-label="Daily revenue trend this month">
              <defs>
                <linearGradient id="revenue-area-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stop-color="#a3e635" stop-opacity="0.24" />
                  <stop offset="100%" stop-color="#a3e635" stop-opacity="0" />
                </linearGradient>
              </defs>
              <path class="revenue-sparkline-area" :d="revenueSparkline.area" />
              <path class="revenue-sparkline-line" :d="revenueSparkline.line" />
            </svg>
            <div v-else class="revenue-sparkline-empty">
              More booking history is needed to show a trend.
            </div>

            <div class="revenue-footer">
              <div class="revenue-trend" :class="{ 'revenue-trend-down': stats.monthly_revenue_change < 0 }">
                <span v-if="stats.monthly_revenue_change !== null">
                  {{ stats.monthly_revenue_change > 0 ? '+' : '' }}{{ stats.monthly_revenue_change.toFixed(1) }}% vs last month
                </span>
                <span v-else>No prior-month baseline</span>
              </div>
              <div class="revenue-breakdown">
                Peak ({{ formatPeakHour(stats.peak_hours_start) }}–{{ formatPeakHour(stats.peak_hours_end) }}):
                ₱{{ formatCurrency(stats.peak_hours_revenue) }}
                <span aria-hidden="true">·</span>
                Off-peak: ₱{{ formatCurrency(stats.off_peak_revenue) }}
              </div>
            </div>
          </article>

        </div>


        <!-- =========================
             CHARTS
        ========================== -->

        <div class="charts">


          <!-- RESERVATIONS CHART -->

          <div class="chart-card">

            <h2>
              Reservations per month
            </h2>

            <div class="empty-chart">

              <div class="chart-y-axis">
                <span>600</span>
                <span>450</span>
                <span>300</span>
                <span>150</span>
                <span>0</span>
              </div>

              <div class="chart-placeholder">

                <div class="chart-grid"></div>

                <div class="empty-message">
                  No reservation data
                </div>

              </div>

            </div>

          </div>


          <!-- REVENUE CHART -->

          <div class="chart-card">

            <h2>
              Revenue
            </h2>

            <div class="empty-chart">

              <div class="chart-y-axis">
                <span>16000</span>
                <span>12000</span>
                <span>8000</span>
                <span>4000</span>
                <span>0</span>
              </div>

              <div class="chart-placeholder">

                <div class="chart-grid"></div>

                <div class="empty-message">
                  No revenue data
                </div>

              </div>

            </div>

          </div>

        </div>


        <!-- =========================
             RECENT RESERVATIONS
        ========================== -->

        <div class="table-card">

          <div class="table-header">

            <h2>
              Recent reservations
            </h2>

            <div class="table-search">

              <Search :size="16" />

              <input
                v-model="tableSearch"
                type="text"
                placeholder="Search..."
              />

            </div>

          </div>


          <div class="table-container">

            <table>

              <thead>

                <tr>
                  <th>Reservation</th>
                  <th>Customer</th>
                  <th>Court</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>

              </thead>

              <tbody>

                <!-- DYNAMIC DATA ROWS -->
                <tr v-for="res in filteredReservations" :key="res.id" class="table-row">
                  <td class="font-semibold">#{{ res.id }}</td>
                  <td>{{ res.customer_name || 'Guest Customer' }}</td>
                  <td>{{ res.court?.name || 'Court #' + res.court_id }}</td>
                  <td>{{ new Date(res.start_time).toLocaleDateString() }}</td>
                  <td>
                    <span class="status-badge confirmed">
                      {{ res.status || 'Confirmed' }}
                    </span>
                  </td>
                </tr>

                <!-- EMPTY STATE -->
                <tr v-if="filteredReservations.length === 0">

                  <td
                    colspan="5"
                    class="empty-table"
                  >
                    No reservations available
                  </td>

                </tr>

              </tbody>

            </table>

          </div>

        </div>

      </section>

    </main>

  </div>
</template>


<style scoped>

/* =====================================
   BASE
===================================== */

.dashboard {
  min-height: 100vh;
  background: #f7f9fa;
  color: #111827;

  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}


/* =====================================
   SIDEBAR
===================================== */

.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;

  width: 212px;

  background: #ffffff;
  border-right: 1px solid #edf0f2;

  display: flex;
  flex-direction: column;

  z-index: 50;
}

.logo {
  height: 64px;

  display: flex;
  align-items: center;

  padding: 0 16px;

  gap: 8px;
}

.sidebar-label {
  padding: 0 16px;

  margin-top: 2px;
  margin-bottom: 10px;

  color: #98a2b3;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.7px;
}

.navigation {
  padding: 0 10px;

  display: flex;
  flex-direction: column;

  gap: 3px;
}

.nav-item {
  height: 36px;

  width: 100%;

  border: none;
  border-radius: 10px;

  background: transparent;

  display: flex;
  align-items: center;

  gap: 10px;

  padding: 0 10px;

  color: #344054;

  font-size: 13px;

  cursor: pointer;

  text-align: left;
  text-decoration: none;
}

.nav-item:hover {
  background: #f5f8f6;
}

.nav-item.active {
  background: #effbf3;

  color: #119447;

  font-weight: 600;
}

.logout-area {
  margin-top: auto;

  padding: 10px;

  border-top: 1px solid #edf0f2;
}

.logout {
  border: none;
  background: transparent;

  display: flex;
  align-items: center;

  gap: 9px;

  padding: 10px;

  color: #ef4444;

  font-size: 13px;

  cursor: pointer;
}


/* =====================================
   MAIN
===================================== */

.main {
  margin-left: 212px;

  min-height: 100vh;
}


/* =====================================
   HEADER
===================================== */

.header {
  height: 64px;

  background: #ffffff;

  border-bottom: 1px solid #edf0f2;

  padding: 0 22px;

  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-title {
  display: flex;
  align-items: center;

  gap: 12px;
}

.header-title h1 {
  margin: 0;

  font-size: 16px;
  font-weight: 700;
}

.header-title p {
  margin: 2px 0 0;

  font-size: 12px;

  color: #7b8491;
}

.header-actions {
  display: flex;
  align-items: center;

  gap: 10px;
}

.search-box,
.table-search {
  height: 33px;

  border: 1px solid #dfe4e8;

  border-radius: 10px;

  display: flex;
  align-items: center;

  gap: 7px;

  padding: 0 10px;

  color: #98a2b3;

  background: #ffffff;
}

.search-box {
  width: 187px;
}

.search-box input,
.table-search input {
  border: none;

  outline: none;

  width: 100%;

  background: transparent;

  font-size: 12px;
}

.notification {
  width: 35px;
  height: 35px;

  border: 1px solid #dfe4e8;

  border-radius: 10px;

  background: white;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #475467;

  position: relative;

  cursor: pointer;
}

.notification span {
  position: absolute;

  width: 5px;
  height: 5px;

  top: 7px;
  right: 7px;

  border-radius: 50%;

  background: #fbbf24;
}

.user {
  display: flex;
  align-items: center;

  gap: 8px;
}

.avatar {
  width: 31px;
  height: 31px;

  border-radius: 50%;

  background: #f1f5f3;

  color: #667085;

  display: flex;
  align-items: center;
  justify-content: center;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-details strong {
  font-size: 12px;
}

.user-details small {
  font-size: 10px;

  color: #8a94a3;
}


/* =====================================
   CONTENT
===================================== */

.content {
  padding: 20px;
}


/* =====================================
   STATS
===================================== */

.stats {
  display: grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap: 14px;
}

.stat-card {
  min-height: 130px;

  background: white;

  border: 1px solid #edf0f2;

  border-radius: 13px;

  padding: 17px;

  box-shadow:
    0 2px 8px
    rgba(16, 24, 40, 0.025);
}

.stat-top {
  display: flex;

  align-items: flex-start;
  justify-content: space-between;
}

.stat-icon {
  width: 37px;
  height: 37px;

  border-radius: 10px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.green {
  color: #16a34a;
  background: #effbf3;
}

.lime {
  color: #65a30d;
  background: #ecfccb;
}

.yellow {
  color: #d89b00;
  background: #fef7c7;
}

.blue {
  color: #2563eb;
  background: #eff6ff;
}

.trend {
  color: #16a34a;

  font-size: 10px;
  font-weight: 600;

  display: flex;
  align-items: center;

  gap: 3px;
}

.stat-value {
  margin-top: 13px;

  font-size: 21px;
  font-weight: 750;

  color: #111827;
}

.stat-label {
  margin-top: 2px;

  color: #697586;

  font-size: 11px;
}


/* =====================================
   CHARTS
===================================== */

.charts {
  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: 20px;

  margin-top: 20px;
}

.chart-card {
  height: 267px;

  background: white;

  border: 1px solid #edf0f2;

  border-radius: 13px;

  padding: 18px;

  box-shadow:
    0 2px 8px
    rgba(16, 24, 40, 0.025);
}

.chart-card h2,
.table-header h2 {
  margin: 0;

  font-size: 13px;
  font-weight: 700;
}


/* =====================================
   EMPTY CHART
===================================== */

.empty-chart {
  display: flex;

  height: 205px;

  margin-top: 8px;
}

.chart-y-axis {
  width: 40px;

  height: 165px;

  display: flex;
  flex-direction: column;

  justify-content: space-between;

  align-items: flex-end;

  padding-right: 8px;

  color: #8792a2;

  font-size: 9px;
}

.chart-placeholder {
  position: relative;

  flex: 1;

  height: 165px;
}

.chart-grid {
  position: absolute;

  inset: 0;

  background:
    repeating-linear-gradient(
      to bottom,
      transparent 0,
      transparent 32px,
      #edf1f3 33px,
      transparent 34px
    );

  border-bottom: 1px solid #edf1f3;
}

.empty-message {
  position: absolute;

  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #a0a9b5;

  font-size: 11px;
}


/* =====================================
   TABLE
===================================== */

.table-card {
  margin-top: 20px;

  background: white;

  border: 1px solid #edf0f2;

  border-radius: 13px;

  overflow: hidden;

  box-shadow:
    0 2px 8px
    rgba(16, 24, 40, 0.025);
}

.table-header {
  height: 57px;

  padding: 0 14px;

  display: flex;
  align-items: center;
  justify-content: space-between;
}

.table-search {
  width: 213px;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;

  border-collapse: collapse;

  font-size: 11px;
}

thead {
  background: #fbfcfd;

  border-top: 1px solid #edf0f2;
  border-bottom: 1px solid #edf0f2;
}

th {
  padding: 11px 14px;

  text-align: left;

  color: #667085;

  font-weight: 600;
}

td {
  padding: 16px 14px;

  border-bottom: 1px solid #f0f2f4;
}

.font-semibold {
  font-weight: 600;
  color: #111827;
}

.status-badge.confirmed {
  background: #f0fdf4;
  color: #16a34a;
  padding: 3px 7px;
  border-radius: 5px;
  font-size: 10px;
  font-weight: 600;
}

.empty-table {
  text-align: center;

  color: #98a2b3;

  font-size: 11px;
  padding: 28px 14px;
}


/* =====================================
   MOBILE
===================================== */

.mobile-menu,
.mobile-close {
  display: none;

  border: none;

  background: transparent;

  cursor: pointer;
}

.sidebar-overlay {
  display: none;
}


/* =====================================
   RESPONSIVE
===================================== */

@media (max-width: 900px) {

  .stats {
    grid-template-columns:
      repeat(2, 1fr);
  }

  .charts {
    grid-template-columns: 1fr;
  }

}


@media (max-width: 700px) {

  .sidebar {
    transform: translateX(-100%);

    transition:
      transform 0.2s ease;
  }

  .sidebar.sidebar-open {
    transform: translateX(0);
  }

  .sidebar-overlay {
    display: block;

    position: fixed;

    inset: 0;

    background:
      rgba(0, 0, 0, 0.25);

    z-index: 40;
  }

  .main {
    margin-left: 0;
  }

  .mobile-menu {
    display: flex;

    color: #344054;
  }

  .mobile-close {
    display: block;

    margin-left: auto;
  }

  .search-box {
    display: none;
  }

  .user-details {
    display: none;
  }

  .content {
    padding: 14px;
  }

}


@media (max-width: 480px) {

  .stats {
    grid-template-columns: 1fr;
  }

  .charts {
    gap: 14px;
  }

}

</style>