<script setup>
import { computed, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import {
  CalendarDays,
  Grid2X2,
  LogOut,
  Menu,
  MessageCircle,
  Settings,
  ShieldCheck,
  Trash2,
  Users,
  X
} from 'lucide-vue-next'
import PickleReserveLogo from '@/components/ui/PickleReserveLogo.vue'
import AdminNotificationCenter from '@/components/admin/AdminNotificationCenter.vue'
import { getAuthUser } from '@/services/auth'
import { logout } from '@/services/logout'
import {
  ADMIN_MESSAGES_CLEARED_EVENT,
  ADMIN_MESSAGES_STORAGE_KEY,
  setShowAdminMessages,
  showAdminMessages
} from '@/services/adminPreferences'

const router = useRouter()
const sidebarOpen = ref(false)
const statusMessage = ref('')
const errorMessage = ref('')
const user = getAuthUser()
const adminName = computed(() => user?.name || 'Administrator')
const adminEmail = computed(() => user?.email || 'No email available')
const adminInitial = computed(() => adminName.value.trim().charAt(0).toUpperCase() || 'A')

function updateMessagesVisibility(event) {
  statusMessage.value = ''
  errorMessage.value = ''

  try {
    setShowAdminMessages(event.target.checked)
    statusMessage.value = 'Message shortcut preference saved on this browser.'
  } catch {
    errorMessage.value = 'Could not save this preference. Check your browser storage settings.'
  }
}

function clearMessagePreview() {
  statusMessage.value = ''
  errorMessage.value = ''

  try {
    sessionStorage.removeItem(ADMIN_MESSAGES_STORAGE_KEY)
    window.dispatchEvent(new Event(ADMIN_MESSAGES_CLEARED_EVENT))
    statusMessage.value = 'Local message preview history cleared.'
  } catch {
    errorMessage.value = 'Could not clear the local message preview history.'
  }
}
</script>

<template>
  <div class="settings-page pr-admin-skin">
    <div v-if="sidebarOpen" class="sidebar-overlay" @click="sidebarOpen = false"></div>

    <aside class="sidebar" :class="{ 'sidebar-open': sidebarOpen }">
      <div class="logo-area">
        <PickleReserveLogo />
        <button class="mobile-close" type="button" aria-label="Close navigation" @click="sidebarOpen = false">
          <X :size="20" />
        </button>
      </div>

      <div class="admin-label">ADMIN PANEL</div>

      <nav class="navigation" aria-label="Admin navigation">
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
        <button class="logout" type="button" @click="logout(router)">
          <LogOut :size="17" /><span>Logout</span>
        </button>
      </div>
    </aside>

    <main class="main">
      <header class="top-header">
        <div class="header-left">
          <button class="mobile-menu" type="button" aria-label="Open navigation" @click="sidebarOpen = true">
            <Menu :size="21" />
          </button>
          <div>
            <h1>Settings</h1>
            <p>Manage your admin preferences</p>
          </div>
        </div>
        <div class="header-right">
          <AdminNotificationCenter />
        </div>
      </header>

      <section class="content">
        <div class="page-heading">
          <h2>Admin settings</h2>
          <p>Review your account and customize the dashboard experience.</p>
        </div>

        <p v-if="statusMessage" class="feedback success" role="status">{{ statusMessage }}</p>
        <p v-if="errorMessage" class="feedback error" role="alert">{{ errorMessage }}</p>

        <div class="settings-grid">
          <section class="settings-card account-card" aria-labelledby="account-heading">
            <div class="section-heading">
              <span class="section-icon"><ShieldCheck :size="19" /></span>
              <div>
                <h3 id="account-heading">Administrator account</h3>
                <p>Your current dashboard sign-in</p>
              </div>
            </div>

            <div class="account-profile">
              <span class="avatar" aria-hidden="true">{{ adminInitial }}</span>
              <div class="account-details">
                <strong>{{ adminName }}</strong>
                <span>{{ adminEmail }}</span>
              </div>
              <span class="role-badge">ADMIN</span>
            </div>

            <div class="security-note">
              <ShieldCheck :size="17" />
              <span>Admin access is restricted to accounts created by your system administrator.</span>
            </div>
          </section>

          <section class="settings-card" aria-labelledby="messages-heading">
            <div class="section-heading">
              <span class="section-icon"><MessageCircle :size="19" /></span>
              <div>
                <h3 id="messages-heading">Message preferences</h3>
                <p>Control the admin message preview shortcut</p>
              </div>
            </div>

            <label class="preference-row">
              <span class="preference-copy">
                <strong>Show Messages shortcut</strong>
                <small>Display the floating Messages button on admin pages.</small>
              </span>
              <input
                type="checkbox"
                :checked="showAdminMessages"
                aria-label="Show Messages shortcut"
                @change="updateMessagesVisibility"
              />
            </label>

            <div class="preview-notice">
              This is a local preview only. Customer messages are not connected to a live inbox yet.
            </div>

            <button class="clear-button" type="button" @click="clearMessagePreview">
              <Trash2 :size="16" />
              Clear local preview history
            </button>
          </section>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.settings-page { min-height: 100vh; }
.sidebar { position: fixed; top: 0; bottom: 0; left: 0; z-index: 50; display: flex; width: 212px; flex-direction: column; border-right: 1px solid #edf0f2; background: #fff; }
.logo-area { height: 64px; flex: 0 0 auto; padding: 0 16px; display: flex; align-items: center; gap: 8px; }
.admin-label { margin: 2px 0 10px; padding: 0 16px; color: #98a2b3; font-size: 9px; font-weight: 700; letter-spacing: .7px; }
.navigation { padding: 0 10px; display: flex; flex-direction: column; gap: 3px; }
.nav-item { width: 100%; height: 36px; padding: 0 10px; border: 0; border-radius: 10px; background: transparent; display: flex; align-items: center; gap: 10px; color: #344054; font-size: 13px; text-decoration: none; }
.nav-item:hover { background: #f5f8f6; }
.nav-item.active { background: #effbf3; color: #119447; font-weight: 600; }
.sidebar-bottom { margin-top: auto; padding: 10px; border-top: 1px solid #edf0f2; }
.logout { border: 0; background: transparent; display: flex; align-items: center; gap: 9px; padding: 10px; color: #ef4444; font-size: 13px; cursor: pointer; }
.mobile-menu, .mobile-close { display: none; }
.settings-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; max-width: 1180px; }
.settings-card { min-width: 0; padding: 22px; border: 1px solid var(--admin-line); border-radius: 16px; background: linear-gradient(145deg, rgba(25, 37, 57, .94), rgba(17, 27, 44, .94)); box-shadow: 0 16px 40px rgba(0, 0, 0, .14), inset 0 1px 0 rgba(255, 255, 255, .025); }
.section-heading { display: flex; align-items: center; gap: 12px; }
.section-icon { width: 42px; height: 42px; flex: 0 0 auto; display: grid; place-items: center; border: 1px solid rgba(163, 230, 53, .2); border-radius: 12px; background: rgba(163, 230, 53, .08); color: var(--admin-lime); }
.section-heading h3 { margin: 0; color: var(--admin-text); font-size: 15px; font-weight: 720; letter-spacing: -.02em; }
.section-heading p { margin: 5px 0 0; color: var(--admin-muted); font-size: 12px; }
.account-profile { display: flex; align-items: center; gap: 13px; margin-top: 24px; padding: 16px; border: 1px solid var(--admin-line); border-radius: 12px; background: rgba(255, 255, 255, .025); }
.avatar { width: 44px; height: 44px; flex: 0 0 auto; display: grid; place-items: center; border: 1px solid rgba(163, 230, 53, .28); border-radius: 14px; background: linear-gradient(145deg, #263a35, #18243a); color: var(--admin-lime); font-size: 18px; font-weight: 750; }
.account-details { display: flex; min-width: 0; flex: 1; flex-direction: column; gap: 5px; }
.account-details strong { overflow: hidden; color: var(--admin-text); font-size: 13px; text-overflow: ellipsis; white-space: nowrap; }
.account-details span { overflow: hidden; color: var(--admin-muted); font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
.role-badge { padding: 5px 8px; border: 1px solid rgba(163, 230, 53, .2); border-radius: 999px; background: rgba(163, 230, 53, .08); color: var(--admin-lime); font-size: 9px; font-weight: 800; letter-spacing: .08em; }
.security-note { display: flex; align-items: flex-start; gap: 9px; margin-top: 19px; color: var(--admin-muted); font-size: 11px; line-height: 1.6; }
.security-note svg { flex: 0 0 auto; color: var(--admin-lime); }
.preference-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-top: 24px; padding: 16px 0; border-top: 1px solid var(--admin-line); border-bottom: 1px solid var(--admin-line); cursor: pointer; }
.preference-copy { display: flex; flex-direction: column; gap: 5px; }
.preference-copy strong { color: var(--admin-text); font-size: 12px; }
.preference-copy small { color: var(--admin-muted); font-size: 11px; line-height: 1.5; }
.preference-row input { width: 42px; height: 23px; flex: 0 0 auto; margin: 0; accent-color: #a3e635; cursor: pointer; }
.preview-notice { margin: 14px 0; padding: 11px 12px; border: 1px solid rgba(163, 230, 53, .14); border-radius: 10px; background: rgba(163, 230, 53, .045); color: #c3d0df; font-size: 11px; line-height: 1.55; }
.clear-button { min-height: 38px; display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 0 12px; border: 1px solid rgba(248, 113, 113, .2); border-radius: 9px; background: rgba(248, 113, 113, .055); color: #fda29b; font: inherit; font-size: 11px; font-weight: 650; cursor: pointer; transition: background 160ms ease, border-color 160ms ease; }
.clear-button:hover { border-color: rgba(248, 113, 113, .38); background: rgba(248, 113, 113, .1); }
.feedback { max-width: 1180px; margin: 0 0 16px; padding: 11px 14px; border: 1px solid; border-radius: 10px; font-size: 12px; }
.feedback.success { border-color: rgba(163, 230, 53, .2); background: rgba(163, 230, 53, .055); color: #d9f99d; }
.feedback.error { border-color: rgba(248, 113, 113, .3); background: rgba(127, 29, 29, .22); color: #fecaca; }
@media (max-width: 900px) { .settings-grid { grid-template-columns: 1fr; } }
@media (max-width: 560px) { .settings-card { padding: 17px; } .account-profile { gap: 10px; padding: 13px; } .role-badge { padding: 4px 6px; font-size: 8px; } }
</style>
