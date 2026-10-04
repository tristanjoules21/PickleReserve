<script setup>
import {
  Search,
  Bell,
  Grid2X2,
  CalendarDays,
  Users,
  Settings,
  LogOut,
  TrendingUp,
  DollarSign,
  Menu,
  X
} from 'lucide-vue-next'

import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const sidebarOpen = ref(false)
const tableSearch = ref('')
</script>

<template>
  <div class="dashboard">

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

        <div class="logo-icon">
          <Grid2X2 :size="17" />
        </div>

        <div class="logo-name">
          Pickle<span>Reserve</span>
        </div>

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

        <button class="nav-item">
          <Settings :size="17" />
          <span>Settings</span>
        </button>

      </nav>


      <!-- LOGOUT -->
      <div class="logout-area">

        <button class="logout">
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

          <button class="notification">

            <Bell :size="18" />

            <span></span>

          </button>


          <!-- USER -->

          <div class="user">

            <div class="avatar">
              <!-- Real user image can be added later -->
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


          <!-- RESERVATIONS -->

          <div class="stat-card">

            <div class="stat-top">

              <div class="stat-icon lime">
                <CalendarDays :size="19" />
              </div>

              <div class="trend">
                <TrendingUp :size="13" />
                --
              </div>

            </div>

            <div class="stat-value">
              --
            </div>

            <div class="stat-label">
              Reservations
            </div>

          </div>


          <!-- COURTS -->

          <div class="stat-card">

            <div class="stat-top">

              <div class="stat-icon yellow">
                <Grid2X2 :size="19" />
              </div>

            </div>

            <div class="stat-value">
              --
            </div>

            <div class="stat-label">
              Active courts
            </div>

          </div>


          <!-- REVENUE -->

          <div class="stat-card">

            <div class="stat-top">

              <div class="stat-icon blue">
                <DollarSign :size="19" />
              </div>

              <div class="trend">
                <TrendingUp :size="13" />
                --
              </div>

            </div>

            <div class="stat-value">
              ₱--
            </div>

            <div class="stat-label">
              Monthly revenue
            </div>

          </div>

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

                <tr>

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

.logo-icon {
  width: 30px;
  height: 30px;

  border-radius: 9px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: white;
  background: #16a34a;
}

.logo-name {
  font-size: 16px;
  font-weight: 750;

  letter-spacing: -0.4px;
}

.logo-name span {
  color: #16a34a;
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
    repeat(4, 1fr);

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

  color: #667085;
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
  padding: 28px 14px;

  border-bottom: 1px solid #f0f2f4;
}

.empty-table {
  text-align: center;

  color: #98a2b3;

  font-size: 11px;
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