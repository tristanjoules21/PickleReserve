<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

import {
  Search,
  Bell,
  Grid2X2,
  CalendarDays,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-vue-next'

const sidebarOpen = ref(false)
const searchQuery = ref('')
</script>

<template>
  <div class="reservations-page">

    <!-- =========================
         MOBILE OVERLAY
    ========================== -->

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

        <div class="logo-icon">
          <Search :size="17" />
        </div>

        <div class="logo-text">
          Pickle<span>Reserve</span>
        </div>

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

        <button class="nav-item">
          <Settings :size="17" />
          <span>Settings</span>
        </button>

      </nav>


      <!-- LOGOUT -->

      <div class="sidebar-bottom">

        <button class="logout">
          <LogOut :size="17" />
          <span>Logout</span>
        </button>

      </div>

    </aside>


    <!-- =========================
         MAIN
    ========================== -->

    <main class="main">


      <!-- =========================
           HEADER
      ========================== -->

      <header class="top-header">

        <div class="header-left">

          <button
            class="mobile-menu"
            @click="sidebarOpen = true"
          >
            <Menu :size="21" />
          </button>

          <div>

            <h1>
              Reservations
            </h1>

            <p>
              Welcome back, Jordan
            </p>

          </div>

        </div>


        <div class="header-right">

          <!-- HEADER SEARCH -->

          <div class="header-search">

            <Search :size="16" />

            <input
              type="text"
              placeholder="Search..."
            />

          </div>


          <!-- NOTIFICATION -->

          <button class="notification">

            <Bell :size="18" />

            <span class="notification-dot"></span>

          </button>


          <!-- PROFILE -->

          <div class="profile">

            <div class="profile-avatar">
              <Users :size="15" />
            </div>

            <div class="profile-info">

              <strong>
                Administrator
              </strong>

              <span>
                Administrator
              </span>

            </div>

          </div>

        </div>

      </header>


      <!-- =========================
           CONTENT
      ========================== -->

      <section class="content">


        <!-- PAGE HEADING -->

        <div class="page-heading">

          <div>

            <h2>
              Reservation Management
            </h2>

            <p>
              Approve, reject, and monitor all bookings.
            </p>

          </div>

        </div>


        <!-- =========================
             RESERVATION TABLE
        ========================== -->

        <div class="reservations-card">


          <!-- CARD HEADER -->

          <div class="card-header">

            <h3>
              All reservations
            </h3>


            <!-- SEARCH -->

            <div class="table-search">

              <Search :size="16" />

              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search..."
              />

            </div>

          </div>


          <!-- =========================
               TABLE
          ========================== -->

          <div class="table-wrapper">

            <table>

              <thead>

                <tr>

                  <th>
                    Reservation<br />
                    #
                  </th>

                  <th>
                    Customer
                  </th>

                  <th>
                    Court
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Time
                  </th>

                  <th>
                    Duration
                  </th>

                  <th>
                    Payment
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                <!-- EMPTY STATE -->

                <tr>

                  <td
                    colspan="9"
                    class="empty-state"
                  >

                    <div class="empty-content">

                      <div class="empty-icon">
                        <CalendarDays :size="20" />
                      </div>

                      <strong>
                        No reservations available
                      </strong>

                      <span>
                        Reservations will appear here
                        when customers make bookings.
                      </span>

                    </div>

                  </td>

                </tr>

              </tbody>

            </table>

          </div>


          <!-- =========================
               FOOTER
          ========================== -->

          <div class="table-footer">

            <span>
              Showing 0 reservations
            </span>


            <div class="pagination">

              <button disabled>
                <ChevronLeft :size="16" />
              </button>

              <span>
                0 / 0
              </span>

              <button disabled>
                <ChevronRight :size="16" />
              </button>

            </div>

          </div>

        </div>

      </section>

    </main>

  </div>
</template>


<style scoped>

/* =================================
   BASE
================================= */

.reservations-page {
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


/* =================================
   SIDEBAR
================================= */

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

.logo-area {
  height: 64px;

  padding: 0 16px;

  display: flex;
  align-items: center;

  gap: 8px;
}

.logo-icon {
  width: 30px;
  height: 30px;

  border-radius: 9px;

  background: #16a34a;

  color: white;

  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text {
  font-size: 16px;

  font-weight: 750;

  letter-spacing: -0.4px;
}

.logo-text span {
  color: #16a34a;
}

.admin-label {
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
  width: 100%;

  height: 36px;

  padding: 0 10px;

  border: none;

  border-radius: 10px;

  background: transparent;

  display: flex;
  align-items: center;

  gap: 10px;

  color: #344054;

  font-size: 13px;

  text-align: left;

  cursor: pointer;
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

.sidebar-bottom {
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


/* =================================
   MAIN
================================= */

.main {
  margin-left: 212px;

  min-height: 100vh;
}


/* =================================
   HEADER
================================= */

.top-header {
  height: 64px;

  background: #ffffff;

  border-bottom: 1px solid #edf0f2;

  padding: 0 22px;

  display: flex;
  align-items: center;

  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;

  gap: 12px;
}

.header-left h1 {
  margin: 0;

  font-size: 16px;

  font-weight: 700;
}

.header-left p {
  margin: 2px 0 0;

  font-size: 12px;

  color: #7b8491;
}

.header-right {
  display: flex;
  align-items: center;

  gap: 10px;
}

.header-search,
.table-search {
  height: 33px;

  border: 1px solid #dfe4e8;

  border-radius: 10px;

  background: #ffffff;

  display: flex;
  align-items: center;

  gap: 7px;

  padding: 0 10px;

  color: #98a2b3;
}

.header-search {
  width: 174px;
}

.header-search input,
.table-search input {
  width: 100%;

  border: none;

  outline: none;

  background: transparent;

  font-size: 12px;
}

.notification {
  width: 35px;
  height: 35px;

  border: 1px solid #dfe4e8;

  border-radius: 10px;

  background: white;

  color: #475467;

  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;

  cursor: pointer;
}

.notification-dot {
  position: absolute;

  width: 5px;
  height: 5px;

  top: 7px;
  right: 7px;

  border-radius: 50%;

  background: #fbbf24;
}

.profile {
  display: flex;
  align-items: center;

  gap: 8px;
}

.profile-avatar {
  width: 31px;
  height: 31px;

  border-radius: 50%;

  background: #343434;

  color: white;

  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-info {
  display: flex;
  flex-direction: column;
}

.profile-info strong {
  font-size: 12px;
}

.profile-info span {
  font-size: 10px;

  color: #8a94a3;
}


/* =================================
   CONTENT
================================= */

.content {
  padding: 20px 22px;

  max-width: 1200px;
}


/* =================================
   PAGE HEADING
================================= */

.page-heading {
  margin-bottom: 20px;
}

.page-heading h2 {
  margin: 0;

  font-size: 18px;

  font-weight: 750;

  letter-spacing: -0.3px;
}

.page-heading p {
  margin: 4px 0 0;

  color: #667085;

  font-size: 12px;
}


/* =================================
   RESERVATIONS CARD
================================= */

.reservations-card {
  background: white;

  border: 1px solid #edf0f2;

  border-radius: 13px;

  overflow: hidden;

  box-shadow:
    0 3px 10px
    rgba(16, 24, 40, 0.035);
}


/* =================================
   CARD HEADER
================================= */

.card-header {
  height: 58px;

  padding: 0 14px;

  display: flex;
  align-items: center;

  justify-content: space-between;

  border-bottom: 1px solid #edf0f2;
}

.card-header h3 {
  margin: 0;

  font-size: 13px;

  font-weight: 700;
}

.table-search {
  width: 200px;
}


/* =================================
   TABLE
================================= */

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;

  min-width: 900px;

  border-collapse: collapse;

  table-layout: fixed;

  font-size: 11px;
}

thead {
  background: #fbfcfd;
}

th {
  height: 53px;

  padding: 0 12px;

  text-align: left;

  color: #667085;

  font-weight: 600;

  border-bottom: 1px solid #edf0f2;
}


/* Column widths */

th:nth-child(1) {
  width: 12%;
}

th:nth-child(2) {
  width: 12%;
}

th:nth-child(3) {
  width: 14%;
}

th:nth-child(4) {
  width: 10%;
}

th:nth-child(5) {
  width: 8%;
}

th:nth-child(6) {
  width: 9%;
}

th:nth-child(7) {
  width: 10%;
}

th:nth-child(8) {
  width: 11%;
}

th:nth-child(9) {
  width: 9%;
}


/* =================================
   EMPTY STATE
================================= */

.empty-state {
  height: 300px;

  text-align: center;

  padding: 0 !important;
}

.empty-content {
  height: 300px;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  color: #98a2b3;
}

.empty-icon {
  width: 44px;
  height: 44px;

  border-radius: 12px;

  background: #f0fdf4;

  color: #16a34a;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 10px;
}

.empty-content strong {
  color: #344054;

  font-size: 12px;
}

.empty-content span {
  margin-top: 4px;

  color: #98a2b3;

  font-size: 10px;
}


/* =================================
   FOOTER
================================= */

.table-footer {
  height: 46px;

  padding: 0 14px;

  border-top: 1px solid #edf0f2;

  display: flex;
  align-items: center;

  justify-content: space-between;

  color: #667085;

  font-size: 11px;
}

.pagination {
  display: flex;
  align-items: center;

  gap: 8px;
}

.pagination button {
  width: 26px;
  height: 26px;

  border: 1px solid #e4e7ec;

  border-radius: 7px;

  background: white;

  color: #98a2b3;

  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination button:disabled {
  opacity: 0.65;
}


/* =================================
   MOBILE
================================= */

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


/* =================================
   RESPONSIVE
================================= */

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

  .header-search {
    display: none;
  }

  .profile-info {
    display: none;
  }

  .content {
    padding: 14px;
  }

}

@media (max-width: 500px) {

  .table-search {
    width: 160px;
  }

}

</style>