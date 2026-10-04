<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
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

const courts = ['Court 1', 'Court 2', 'Court 3']
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

const total = computed(() => selection.value.length * venue.price)

function getStatus() {
  return 'available'
}

function isSelected(court, row) {
  return selection.value.some((slot) => slot.court === court && slot.row === row)
}

function toggleSlot(court, row) {
  const status = getStatus(court, row)

  if (status !== 'available') return

  const exists = isSelected(court, row)

  if (exists) {
    selection.value = selection.value.filter(
      (slot) => !(slot.court === court && slot.row === row),
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
    price: venue.price,
    total: total.value,
    slots: selection.value.map((slot) => ({
      court: slot.court,
      row: slot.row,
      time: timeRows[slot.row]
    }))
  }
  sessionStorage.setItem('picklereserve.pending-booking', JSON.stringify(booking))
  router.push('/booking-form')
}
</script>

<template>
  <main class="app">
    <header class="top-nav">
      <div class="brand">
        <div class="brand-icon">
          <span>⌕</span>
        </div>
        <strong>Pickle<span>Reserve</span></strong>
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
          <strong>₱{{ venue.price }}<small>/hr</small></strong>
          <span>Starting at</span>
        </div>

        <div class="stat">
          <div class="stat-icon grid">⊞</div>
          <strong>{{ venue.courts }}<small> Courts</small></strong>
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

    <BookingSchedule
      v-if="tab === 'Book'"
      :courts="courts"
      :time-rows="timeRows"
      :selection="selection"
      :selected-date="selectedDate"
      :price="venue.price"
      :get-status="getStatus"
      :is-selected="isSelected"
      :toggle-slot="toggleSlot"
      :format-date="formatDate"
      :previous-day="previousDay"
      :next-day="nextDay"
      :update-selected-date="updateSelectedDate"
    />

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
      :price="venue.price"
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

:global(body) {
  margin: 0;
  background: #f4f6f5;
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #101817;
}

button {
  font: inherit;
  cursor: pointer;
}

.app {
  width: 100%;
  max-width: 520px;
  min-height: 100vh;
  margin: auto;
  padding-bottom: 100px;
  background: #f7f9f8;
}

.top-nav {
  height: 66px;
  padding: 0 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-icon {
  width: 42px;
  height: 42px;
  border-radius: 13px;
  background: #087c52;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 28px;
  font-weight: 300;
}

.brand strong {
  font-size: 20px;
  letter-spacing: -0.7px;
}

.brand strong span {
  color: #168b61;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 13px;
}

.sign-in {
  border: 1px solid #e1e6e4;
  background: white;
  border-radius: 22px;
  padding: 9px 18px;
  font-size: 14px;
  font-weight: 650;
}

.menu {
  border: 0;
  background: transparent;
  font-size: 24px;
  color: #28302e;
}

.venue-card {
  margin: 14px 12px 0;
  padding: 22px 19px 20px;
  background: white;
  border: 1px solid #edf0ef;
  border-radius: 22px;
  box-shadow: 0 3px 14px rgba(17, 48, 37, 0.04);
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
  border-radius: 50%;
  background: #eef4f1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-court {
  width: 39px;
  height: 39px;
  border-radius: 50%;
  background:
    linear-gradient(90deg, transparent 47%, #c5ddd4 48%, #c5ddd4 52%, transparent 53%),
    linear-gradient(transparent 47%, #c5ddd4 48%, #c5ddd4 52%, transparent 53%),
    #196d55;
  border: 2px solid #0c5b47;
  box-shadow: inset 0 0 0 4px rgba(255, 255, 255, 0.1);
}

.venue-title h1 {
  margin: 0 0 5px;
  font-size: 22px;
  letter-spacing: -0.6px;
}

.location {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #697471;
  font-size: 15px;
}

.pin {
  color: #198b61;
}

.venue-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin: 22px -4px 20px;
}

.stat {
  position: relative;
  text-align: center;
  border-right: 1px solid #edf0ef;
}

.stat:last-child {
  border-right: none;
}

.stat-icon {
  color: #14885e;
  font-size: 21px;
  height: 24px;
  margin-bottom: 4px;
}

.stat strong {
  display: block;
  font-size: 15px;
  font-weight: 750;
  line-height: 1.2;
}

.stat strong small {
  font-size: 12px;
  font-weight: 600;
}

.stat span {
  display: block;
  margin-top: 3px;
  color: #7c8582;
  font-size: 11px;
}

.venue-description {
  margin: 0;
  color: #596461;
  font-size: 14px;
  line-height: 1.65;
}

.tabs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  height: 57px;
  margin-top: 10px;
  background: white;
  border-bottom: 1px solid #e9eeec;
}

.tabs button {
  position: relative;
  border: none;
  background: white;
  color: #707976;
  font-size: 14px;
  font-weight: 600;
}

.tabs button.active {
  color: #121a18;
}

.tabs button.active::after {
  content: "";
  position: absolute;
  left: 18px;
  right: 18px;
  bottom: -1px;
  height: 2px;
  background: #17875f;
}

</style>
