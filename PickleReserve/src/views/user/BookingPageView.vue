<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../services/api'
import PickleReserveLogo from '@/components/ui/PickleReserveLogo.vue'
import About from '../../components/booking/About.vue'
import Photos from '../../components/booking/Photos.vue'
import Chat from '../../components/booking/Chat.vue'
import BookingSchedule from '../../components/booking/BookingSchedule.vue'
import BookingSummary from '../../components/booking/BookingSummary.vue'
import BookingConfirmationSheet from '../../components/booking/BookingConfirmationSheet.vue'

const venue = {
  name: 'PickleReserve',
  location: 'Cagayan de Oro City',
  price: 350,
  courts: 3,
  hours: '6AM – 4:00AM',
  description:
    'PickleReserve makes pickleball court reservations simple and convenient. Discover available courts, check schedules, and reserve your preferred time slot with ease.',
}

const tabs = ['Book', 'About', 'Photos', 'Chat']
const tab = ref('Book')
const router = useRouter()

const initialDate = new Date()
initialDate.setHours(0, 0, 0, 0)

const selectedDate = ref(initialDate)
const selection = ref([])
const sheet = ref(false)
const courts = ref([])
const courtsError = ref('')
const isLoadingCourts = ref(true)

const timeRows = [
  '6AM – 7AM',
  '7AM – 8AM',
  '8AM – 9AM',
  '9AM – 10AM',
  '10AM – 11AM',
  '11AM – 12PM',
  '12PM – 1PM',
  '1PM – 2PM',
  '2PM – 3PM',
  '3PM – 4PM',
  '4PM – 5PM',
  '5PM – 6PM',
  '6PM – 7PM',
  '7PM – 8PM',
  '8PM – 9PM',
  '9PM – 10PM',
  '10PM – 11PM',
  '11PM – 12AM',
  '12AM – 1AM',
  '1AM – 2AM',
  '2AM – 3AM',
  '3AM – 4AM',
]

const startingPrice = computed(() =>
  courts.value.length
    ? Math.min(...courts.value.map((court) => Number(court.price_per_hour)))
    : 0,
)
const total = computed(() =>
  selection.value.reduce((sum, slot) => sum + Number(slot.court.price_per_hour), 0),
)

async function fetchCourts() {
  courtsError.value = ''

  try {
    const response = await api.get('/courts')
    if (!Array.isArray(response.data)) {
      throw new Error('The courts API returned an invalid response.')
    }

    courts.value = response.data
      .filter((court) => court.is_active)
      .sort((first, second) =>
        first.name.localeCompare(second.name, undefined, { numeric: true, sensitivity: 'base' }),
      )
    selection.value = selection.value.flatMap((slot) => {
      const court = courts.value.find((item) => item.id === slot.court.id)
      return court ? [{ ...slot, court }] : []
    })
  } catch (error) {
    console.error('Failed to load courts for booking:', error)
    courtsError.value = 'Could not load available courts. Check the backend connection and retry.'
  } finally {
    isLoadingCourts.value = false
  }
}

function getStatus(court) {
  return court.is_active ? 'available' : 'unavailable'
}

function isSelected(court, row) {
  return selection.value.some((slot) => slot.court.id === court.id && slot.row === row)
}

function toggleSlot(court, row) {
  const status = getStatus(court, row)

  if (status !== 'available') return

  const exists = isSelected(court, row)

  if (exists) {
    selection.value = selection.value.filter(
      (slot) => !(slot.court.id === court.id && slot.row === row),
    )
  } else {
    selection.value.push({ court, row })
  }
}

function changeSelectedDate(date) {
  if (Number.isNaN(date.getTime())) return

  const nextDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (nextDate < today) return

  if (nextDate.getTime() !== selectedDate.value.getTime()) {
    selection.value = []
  }

  selectedDate.value = nextDate
}

function previousDay() {
  const date = new Date(selectedDate.value)
  date.setDate(date.getDate() - 1)
  changeSelectedDate(date)
}

function nextDay() {
  const date = new Date(selectedDate.value)
  date.setDate(date.getDate() + 1)
  changeSelectedDate(date)
}

function updateSelectedDate(dateValue) {
  changeSelectedDate(new Date(`${dateValue}T00:00:00`))
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

function openSheet() {
  if (selection.value.length) {
    sheet.value = true
  }
}

function closeSheet() {
  sheet.value = false
}

function confirmReservation() {
  sheet.value = false
  const date = selectedDate.value
  const booking = {
    date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
    price: startingPrice.value,
    total: total.value,
    slots: selection.value.map((slot) => ({
      court: slot.court.name,
      courtId: slot.court.id,
      price: Number(slot.court.price_per_hour),
      row: slot.row,
      time: timeRows[slot.row]
    }))
  }
  sessionStorage.setItem('picklereserve.pending-booking', JSON.stringify(booking))
  router.push('/booking-form')
}

onMounted(() => {
  fetchCourts()
  window.addEventListener('focus', fetchCourts)
})

onUnmounted(() => {
  window.removeEventListener('focus', fetchCourts)
})
</script>

<template>
  <main class="app">
    <header class="top-nav">
      <div class="brand">
        <PickleReserveLogo />
      </div>

      <div class="nav-actions">
        <button class="sign-in">Sign In</button>
        <button class="menu">☰</button>
      </div>
    </header>

    <section class="venue-card">
      <div class="venue-top">
        <div class="venue-avatar">
          <div class="avatar-court"></div>
        </div>

        <div class="venue-title">
          <h1>{{ venue.name }}</h1>

          <div class="location">
            <span class="pin">♧</span>
            {{ venue.location }}
          </div>
        </div>
      </div>

      <div class="venue-stats">
        <div class="stat">
          <div class="stat-icon tag">◇</div>
          <strong>₱{{ startingPrice }}<small>/hr</small></strong>
          <span>Starting at</span>
        </div>

        <div class="stat">
          <div class="stat-icon grid">⊞</div>
          <strong>{{ courts.length }}<small> Courts</small></strong>
          <span>Covered</span>
        </div>

        <div class="stat">
          <div class="stat-icon clock">◷</div>
          <strong>{{ venue.hours }}</strong>
          <span>Open daily</span>
        </div>
      </div>

      <p class="venue-description">
        {{ venue.description }}
      </p>
    </section>

    <nav class="tabs">
      <button
        v-for="item in tabs"
        :key="item"
        :class="{ active: tab === item }"
        @click="tab = item"
      >
        {{ item }}
      </button>
    </nav>

    <div v-if="tab === 'Book' && courtsError" class="booking-error" role="alert">
      {{ courtsError }}
      <button type="button" @click="fetchCourts">Retry</button>
    </div>

    <p v-else-if="tab === 'Book' && isLoadingCourts" class="booking-loading">Loading courts...</p>

    <BookingSchedule
      v-else-if="tab === 'Book' && courts.length"
      :courts="courts"
      :time-rows="timeRows"
      :selection="selection"
      :selected-date="selectedDate"
      :price="startingPrice"
      :get-status="getStatus"
      :is-selected="isSelected"
      :toggle-slot="toggleSlot"
      :format-date="formatDate"
      :previous-day="previousDay"
      :next-day="nextDay"
      :update-selected-date="updateSelectedDate"
    />

    <p v-else-if="tab === 'Book'" class="booking-loading">No active courts are available for booking.</p>

    <About v-else-if="tab === 'About'" :venue="venue" />
    <Photos v-else-if="tab === 'Photos'" />
    <Chat v-else-if="tab === 'Chat'" />

    <BookingSummary
      :selection="selection"
      :total="total"
      @open-sheet="openSheet"
    />

    <BookingConfirmationSheet
      v-if="sheet"
      :selected-date="selectedDate"
      :selection="selection"
      :time-rows="timeRows"
      :total="total"
      @close="closeSheet"
      @confirm="confirmReservation"
    />
  </main>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.booking-error,
.booking-loading {
  margin: 24px 16px 100px;
  text-align: center;
  color: rgba(226, 232, 240, 0.75);
  font-size: 14px;
}

.booking-error {
  color: #fca5a5;
}

.booking-error button {
  display: block;
  margin: 10px auto 0;
  border: 0;
  background: transparent;
  color: #a3e635;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

:global(body) {
  margin: 0;
  background:
    radial-gradient(circle at top, rgba(163, 230, 53, 0.14), transparent 30%),
    linear-gradient(180deg, #020817 0%, #0f172a 100%);
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #e2e8f0;
}

button {
  font: inherit;
  cursor: pointer;
}

.app {
  width: 100%;
  max-width: 560px;
  min-height: 100vh;
  margin: auto;
  padding-bottom: 100px;
  background: transparent;
}

.top-nav {
  position: sticky;
  top: 0;
  z-index: 10;
  height: 72px;
  padding: 0 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(148, 163, 184, 0.12);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sign-in {
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(15, 23, 42, 0.6);
  color: #e2e8f0;
  border-radius: 999px;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 700;
}

.menu {
  border: 1px solid rgba(148, 163, 184, 0.15);
  background: rgba(15, 23, 42, 0.5);
  border-radius: 12px;
  width: 42px;
  height: 42px;
  font-size: 20px;
  color: #dfe7f1;
}

.venue-card {
  margin: 16px 12px 0;
  padding: 20px 18px 18px;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.15);
  border-radius: 26px;
  box-shadow: 0 18px 36px rgba(2, 8, 23, 0.34), inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.venue-top {
  display: flex;
  align-items: center;
  gap: 14px;
}

.venue-avatar {
  width: 64px;
  height: 64px;
  flex: 0 0 64px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(163, 230, 53, 0.18), rgba(56, 189, 248, 0.12));
  border: 1px solid rgba(163, 230, 53, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 0 20px rgba(163, 230, 53, 0.08);
}

.avatar-court {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background:
    linear-gradient(90deg, transparent 47%, rgba(163, 230, 53, 0.8) 48%, rgba(163, 230, 53, 0.8) 52%, transparent 53%),
    linear-gradient(transparent 47%, rgba(163, 230, 53, 0.8) 48%, rgba(163, 230, 53, 0.8) 52%, transparent 53%),
    rgba(34, 197, 94, 0.38);
  border: 2px solid rgba(163, 230, 53, 0.9);
  box-shadow: 0 0 20px rgba(163, 230, 53, 0.18);
}

.venue-title h1 {
  margin: 0 0 6px;
  font-size: 26px;
  letter-spacing: -0.8px;
  color: #f8fafc;
}

.location {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #cbd5e1;
  font-size: 14px;
}

.pin {
  color: #a3e635;
}

.venue-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin: 22px 0 18px;
}

.stat {
  position: relative;
  text-align: center;
  padding: 14px 12px 12px;
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(148, 163, 184, 0.12);
  border-radius: 18px;
}

.stat-icon {
  color: #dfff00;
  font-size: 20px;
  height: 24px;
  margin-bottom: 8px;
}

.stat strong {
  display: block;
  font-size: 15px;
  font-weight: 800;
  line-height: 1.2;
  color: #f8fafc;
}

.stat strong small {
  font-size: 11px;
  font-weight: 600;
  opacity: 0.8;
}

.stat span {
  display: block;
  margin-top: 4px;
  color: #94a3b8;
  font-size: 11px;
}

.venue-description {
  margin: 0;
  color: #cbd5e1;
  font-size: 14px;
  line-height: 1.7;
}

.tabs {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  height: 58px;
  margin: 18px 12px 0;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.12);
  border-radius: 16px;
  overflow: hidden;
}

.tabs button {
  position: relative;
  border: none;
  background: transparent;
  color: #9aa8b8;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.tabs button.active {
  color: #f8fafc;
  background: rgba(163, 230, 53, 0.08);
}

.tabs button.active::after {
  content: "";
  position: absolute;
  left: 18px;
  right: 18px;
  bottom: 8px;
  height: 2px;
  border-radius: 999px;
  background: linear-gradient(90deg, #dfff00, #a3e635);
}

</style>
