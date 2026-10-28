<script setup>
import { ref, computed, onMounted } from 'vue'
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
  Plus,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Trash2,
  Edit
} from 'lucide-vue-next'

// Responsive & Search State
const sidebarOpen = ref(false)
const router = useRouter()
const searchQuery = ref('')

// Modal & Form State
const showAddModal = ref(false)
const isSubmitting = ref(false)
const isLoading = ref(true)
const courtError = ref('')
const formError = ref('')

const courts = ref([])

const newCourt = ref({
  name: '',
  description: '',
  price_per_hour: '',
  is_active: true
})

// Fetch courts from Laravel backend on load
const fetchCourts = async () => {
  courtError.value = ''
  try {
    const response = await getCached('/courts')
    if (!Array.isArray(response.data)) {
      throw new Error('The courts API returned an invalid response.')
    }
    courts.value = response.data
  } catch (error) {
    console.error('Failed to load courts from API:', error)
    courtError.value = 'Could not load courts. Check that the backend is running, then retry.'
  } finally {
    isLoading.value = false
  }
}

// Modal Toggle Handlers
const openAddCourtModal = () => {
  formError.value = ''
  showAddModal.value = true
}

const closeAddCourtModal = () => {
  showAddModal.value = false
  formError.value = ''
  newCourt.value = {
    name: '',
    description: '',
    price_per_hour: '',
    is_active: true
  }
}

// Save Court via POST Request to backend
const saveCourt = async () => {
  if (isSubmitting.value) return
  formError.value = ''
  isSubmitting.value = true

  try {
    const response = await api.post('/courts', {
      name: newCourt.value.name.trim(),
      description: newCourt.value.description.trim(),
      price_per_hour: Number(newCourt.value.price_per_hour),
      is_active: newCourt.value.is_active
    })

    courts.value.unshift(response.data)
    closeAddCourtModal()
  } catch (error) {
    console.error('Error submitting court:', error.response?.data || error)
    formError.value =
      Object.values(error.response?.data?.errors || {}).flat()[0] ||
      error.response?.data?.message ||
      'Could not save this court. Check the backend connection and try again.'
  } finally {
    isSubmitting.value = false
  }
}

// Delete Court
const deleteCourt = async (id) => {
  if (!confirm('Are you sure you want to delete this court?')) return

  try {
    await api.delete(`/courts/${id}`)
    courts.value = courts.value.filter((court) => court.id !== id)
  } catch (error) {
    console.error('Error deleting court:', error)
  }
}

// Filtered courts based on table search query
const filteredCourts = computed(() => {
  if (!searchQuery.value.trim()) return courts.value
  const query = searchQuery.value.toLowerCase()
  return courts.value.filter(
    (court) =>
      court.name.toLowerCase().includes(query) ||
      (court.description && court.description.toLowerCase().includes(query))
  )
})

onMounted(fetchCourts)
</script>

<template>
  <div class="courts-page pr-admin-skin">

    <!-- Mobile overlay -->
    <div
      v-if="sidebarOpen"
      class="sidebar-overlay"
      @click="sidebarOpen = false"
    ></div>

    <!-- SIDEBAR -->
    <aside
      class="sidebar"
      :class="{ 'sidebar-open': sidebarOpen }"
    >
      <div class="logo-area">
        <PickleReserveLogo />

        <button
          class="mobile-close"
          @click="sidebarOpen = false"
        >
          <X :size="20" />
        </button>
      </div>

      <div class="admin-label">
        ADMIN PANEL
      </div>

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

      <div class="sidebar-bottom">
        <button class="logout" @click="logout(router)">
          <LogOut :size="17" />
          <span>Logout</span>
        </button>
      </div>
    </aside>

    <!-- MAIN CONTENT -->
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
            <h1>Courts</h1>
            <p>Welcome back, Jordan</p>
          </div>
        </div>

        <div class="header-right">
          <div class="header-search">
            <Search :size="16" />
            <input type="text" placeholder="Search..." />
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

      <!-- CONTENT SECTION -->
      <section class="content">

        <!-- PAGE HEADING -->
        <div class="page-heading">
          <div>
            <h2>Manage Courts</h2>
            <p>Add, edit, and control availability of your courts.</p>
          </div>

          <button class="add-court-button" @click="openAddCourtModal">
            <Plus :size="17" />
            <span>Add Court</span>
          </button>
        </div>

        <!-- COURTS TABLE CARD -->
        <div class="courts-card">
          <div class="card-header">
            <h3>All courts</h3>

            <div class="table-search">
              <Search :size="16" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search..."
              />
            </div>
          </div>

          <p v-if="courtError" class="court-error" role="alert">
            {{ courtError }}
            <button type="button" @click="fetchCourts">Retry</button>
          </p>

          <!-- TABLE -->
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Court</th>
                  <th>Type</th>
                  <th>Hourly<br />Rate</th>
                  <th>Availability</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                <tr v-if="isLoading">
                  <td colspan="6" class="empty-state">Loading courts...</td>
                </tr>

                <!-- DYNAMIC ROWS WHEN DATA EXISTS -->
                <tr v-for="court in filteredCourts" :key="court.id" class="table-row">
                  <td class="font-semibold">{{ court.name }}</td>
                  <td>{{ court.description || 'Standard' }}</td>
                  <td>₱{{ parseFloat(court.price_per_hour).toFixed(2) }}/hr</td>
                  <td>
                    <span :class="['badge', court.is_active ? 'badge-success' : 'badge-danger']">
                      {{ court.is_active ? 'Available' : 'Unavailable' }}
                    </span>
                  </td>
                  <td>
                    <span :class="['status-dot', court.is_active ? 'active' : 'inactive']"></span>
                    {{ court.is_active ? 'Active' : 'Inactive' }}
                  </td>
                  <td class="actions-cell">
                    <button class="action-btn text-danger" @click="deleteCourt(court.id)" title="Delete Court">
                      <Trash2 :size="15" />
                    </button>
                  </td>
                </tr>

                <!-- EMPTY STATE -->
                <tr v-if="!isLoading && !courtError && filteredCourts.length === 0">
                  <td colspan="6" class="empty-state">
                    <div class="empty-content">
                      <div class="empty-icon">
                        <Grid2X2 :size="20" />
                      </div>
                      <strong>No courts available</strong>
                      <span>Add a court to start managing your pickleball courts.</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- FOOTER -->
          <div class="table-footer">
            <span>Showing {{ filteredCourts.length }} courts</span>

            <div class="pagination">
              <button disabled>
                <ChevronLeft :size="16" />
              </button>
              <span>1 / 1</span>
              <button disabled>
                <ChevronRight :size="16" />
              </button>
            </div>
          </div>
        </div>

      </section>

    </main>

    <!-- ADD COURT MODAL -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="closeAddCourtModal">
      <div class="modal-card">
        <div class="modal-header">
          <h3>Add New Court</h3>
          <button class="modal-close-btn" @click="closeAddCourtModal">
            <X :size="18" />
          </button>
        </div>

        <form @submit.prevent="saveCourt" class="modal-body">
          <div class="form-group">
            <label>Court Name *</label>
            <input
              v-model="newCourt.name"
              type="text"
              placeholder="e.g., Court 1 - Indoor"
              required
            />
          </div>

          <div class="form-group">
            <label>Description / Type</label>
            <input
              v-model="newCourt.description"
              type="text"
              placeholder="e.g., Covered Hardwood Surface"
            />
          </div>

          <div class="form-group">
            <label>Hourly Rate (₱) *</label>
            <input
              v-model="newCourt.price_per_hour"
              type="number"
              step="0.01"
              placeholder="500.00"
              required
            />
          </div>

          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input v-model="newCourt.is_active" type="checkbox" />
              <span>Court is active & available for booking</span>
            </label>
          </div>

          <div class="modal-footer">
            <p v-if="formError" class="court-error" role="alert">{{ formError }}</p>
            <button type="button" class="btn-cancel" @click="closeAddCourtModal">
              Cancel
            </button>
            <button type="submit" class="btn-save" :disabled="isSubmitting">
              {{ isSubmitting ? 'Saving...' : 'Save Court' }}
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* =================================
   BASE
================================= */
.courts-page {
  min-height: 100vh;
  background: #f7f9fa;
  color: #111827;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
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
   MAIN & HEADER
================================= */
.main {
  margin-left: 212px;
  min-height: 100vh;
}

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
  width: 187px;
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
   CONTENT & PAGE HEADING
================================= */
.content {
  padding: 22px;
  max-width: 1100px;
}

.page-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
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

.add-court-button {
  height: 35px;
  padding: 0 15px;
  border: none;
  border-radius: 10px;
  background: #16a34a;
  color: white;
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(22, 163, 74, 0.18);
}

.add-court-button:hover {
  background: #15803d;
}

/* =================================
   COURTS CARD & TABLE
================================= */
.courts-card {
  background: white;
  border: 1px solid #edf0f2;
  border-radius: 13px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(16, 24, 40, 0.035);
}

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
  width: 214px;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 11px;
}

thead {
  background: #fbfcfd;
}

th {
  height: 53px;
  padding: 0 14px;
  text-align: left;
  color: #667085;
  font-weight: 600;
  border-bottom: 1px solid #edf0f2;
}

th:nth-child(1) { width: 25%; }
th:nth-child(2) { width: 20%; }
th:nth-child(3) { width: 15%; }
th:nth-child(4) { width: 15%; }
th:nth-child(5) { width: 15%; }
th:nth-child(6) { width: 10%; }

.table-row td {
  padding: 12px 14px;
  border-bottom: 1px solid #edf0f2;
  color: #344054;
  vertical-align: middle;
}

.font-semibold {
  font-weight: 600;
  color: #111827;
}

.badge {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 600;
}

.badge-success {
  background: #f0fdf4;
  color: #16a34a;
}

.badge-danger {
  background: #fef2f2;
  color: #ef4444;
}

.status-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 4px;
}

.status-dot.active {
  background: #16a34a;
}

.status-dot.inactive {
  background: #98a2b3;
}

.action-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
}

.text-danger {
  color: #ef4444;
}

.text-danger:hover {
  background: #fef2f2;
}

/* =================================
   EMPTY STATE & FOOTER
================================= */
.empty-state {
  height: 270px;
  text-align: center;
  padding: 0 !important;
}

.court-error {
  margin: 12px 0;
  color: #b42318;
  font-size: 13px;
}

.court-error button {
  margin-left: 8px;
  border: 0;
  background: transparent;
  color: #087c52;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.empty-content {
  height: 270px;
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
  font-size: 10px;
  color: #98a2b3;
}

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
   MODAL STYLES
================================= */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 16px;
}

.modal-card {
  background: #ffffff;
  width: 100%;
  max-width: 420px;
  border-radius: 14px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid #edf0f2;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
}

.modal-close-btn {
  border: none;
  background: transparent;
  color: #667085;
  cursor: pointer;
}

.modal-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-group label {
  font-size: 11px;
  font-weight: 600;
  color: #344054;
}

.form-group input[type="text"],
.form-group input[type="number"] {
  height: 38px;
  padding: 0 12px;
  border: 1px solid #dfe4e8;
  border-radius: 8px;
  font-size: 12px;
  outline: none;
}

.form-group input:focus {
  border-color: #16a34a;
}

.checkbox-group {
  flex-direction: row;
  align-items: center;
  margin-top: 4px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: #475467;
  cursor: pointer;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

.modal-footer .court-error {
  flex: 1;
  margin: 0;
}

.btn-cancel {
  height: 36px;
  padding: 0 14px;
  border: 1px solid #dfe4e8;
  border-radius: 8px;
  background: white;
  font-size: 12px;
  font-weight: 600;
  color: #344054;
  cursor: pointer;
}

.btn-save {
  height: 36px;
  padding: 0 16px;
  border: none;
  border-radius: 8px;
  background: #16a34a;
  font-size: 12px;
  font-weight: 600;
  color: white;
  cursor: pointer;
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* =================================
   MOBILE RESPONSIVE
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

@media (max-width: 700px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.2s ease;
  }

  .sidebar.sidebar-open {
    transform: translateX(0);
  }

  .sidebar-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.25);
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

  .page-heading {
    align-items: flex-start;
    gap: 15px;
  }

  .add-court-button {
    flex-shrink: 0;
  }
}

@media (max-width: 500px) {
  .page-heading {
    flex-direction: column;
  }

  .add-court-button {
    width: 100%;
    justify-content: center;
  }

  .table-search {
    width: 160px;
  }
}
</style>