<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import api from '@/services/api'

const props = defineProps({
  courts: {
    type: Array,
    required: true,
  },
  timeRows: {
    type: Array,
    required: true,
  },
  selection: {
    type: Array,
    required: true,
  },
  selectedDate: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  getStatus: {
    type: Function,
    required: true,
  },
  isSelected: {
    type: Function,
    required: true,
  },
  toggleSlot: {
    type: Function,
    required: true,
  },
  formatDate: {
    type: Function,
    required: true,
  },
  previousDay: {
    type: Function,
    required: true,
  },
  nextDay: {
    type: Function,
    required: true,
  },
  updateSelectedDate: {
    type: Function,
    required: true,
  },
})

const dateInput = ref(null)
const today = new Date()
today.setHours(0, 0, 0, 0)

const reservedSlots = ref([])
const isLoadingSlots = ref(false)
let pollInterval = null

// Format Date to YYYY-MM-DD using local time
function formatInputDate(date) {
  if (!date) return ''
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function isTodayOrEarlier(date) {
  const selected = new Date(date)
  selected.setHours(0, 0, 0, 0)
  return selected <= today
}

function openDatePicker() {
  if (dateInput.value) {
    dateInput.value.showPicker?.()
    if (!dateInput.value.showPicker) {
      dateInput.value.click()
    }
  }
}

function handleDateChange(event) {
  const value = event.target.value
  if (value) {
    props.updateSelectedDate(value)
  }
}

// Fetch reserved/taken slots from backend for current date
const fetchReservedSlots = async () => {
  isLoadingSlots.value = true
  try {
    const formattedDate = formatInputDate(props.selectedDate)
    const response = await api.get('/bookings/reserved-slots', {
      params: { date: formattedDate }
    })
    reservedSlots.value = Array.isArray(response.data) ? response.data : []
    console.log('[BookingSchedule] Reserved slots loaded:', reservedSlots.value)
  } catch (error) {
    console.error('[BookingSchedule] Failed to load reserved slots:', error)
  } finally {
    isLoadingSlots.value = false
  }
}

// Convert "6AM - 7AM" or "6AM – 7AM" to two-digit 24h start hour ("06")
function getHourFromLabel(timeLabel) {
  if (!timeLabel) return ''
  const firstPart = timeLabel.split('–')[0].split('-')[0].trim()
  const match = firstPart.match(/(\d+)(?::(\d+))?\s*(AM|PM)?/i)
  if (!match) return ''

  let hour = parseInt(match[1], 10)
  const modifier = match[3] ? match[3].toUpperCase() : null

  if (modifier === 'PM' && hour < 12) hour += 12
  if (modifier === 'AM' && hour === 12) hour = 0

  return String(hour).padStart(2, '0')
}

// Extract Court Index/ID from string ("Court 1" -> "1") or object
function getCourtId(court, courtIndex) {
  if (typeof court === 'object' && court !== null) {
    return String(court.id)
  }
  const match = String(court).match(/\d+/)
  if (match) return match[0]
  // Fallback to 1-based index if name doesn't contain a number
  return String(courtIndex + 1)
}

// Extract HH from start_time string ("2026-10-19 06:00:00" or ISO format)
function getBookingHour(startTimeStr) {
  if (!startTimeStr) return ''
  const str = String(startTimeStr)
  if (str.includes('T')) {
    return str.split('T')[1].split(':')[0]
  }
  if (str.includes(' ')) {
    return str.split(' ')[1].split(':')[0]
  }
  const d = new Date(startTimeStr)
  return String(d.getHours()).padStart(2, '0')
}

// Check if a slot is reserved by database record or parent state
function isSlotDisabled(court, rowIndex) {
  // Check parent status prop
  const parentStatus = props.getStatus(court, rowIndex)
  if (parentStatus === 'booked' || parentStatus === 'pending') {
    return true
  }

  // Determine Court ID & Hour for current slot cell
  const courtIndex = props.courts.indexOf(court)
  const targetCourtId = getCourtId(court, courtIndex)
  const targetHourStr = getHourFromLabel(props.timeRows[rowIndex])

  if (!targetHourStr) return false

  // Match against database records
  return reservedSlots.value.some((booking) => {
    const bookingCourtId = String(booking.court_id || booking.court?.id || '')
    const bookingHourStr = getBookingHour(booking.start_time)

    const isCourtMatch = bookingCourtId === targetCourtId
    const isHourMatch = bookingHourStr === targetHourStr

    return isCourtMatch && isHourMatch
  })
}

// Safely handle clicks
function handleSlotClick(court, rowIndex) {
  if (isSlotDisabled(court, rowIndex)) {
    return // Block selection completely
  }
  props.toggleSlot(court, rowIndex)
}

// Auto-refresh when tab gains focus or on mount/date change
watch(() => props.selectedDate, fetchReservedSlots, { immediate: true })

onMounted(() => {
  fetchReservedSlots()
  window.addEventListener('focus', fetchReservedSlots)
  pollInterval = setInterval(fetchReservedSlots, 10000) // Poll every 10s
})

onUnmounted(() => {
  window.removeEventListener('focus', fetchReservedSlots)
  if (pollInterval) clearInterval(pollInterval)
})

defineExpose({ fetchReservedSlots })
</script>

<template>
  <section class="booking">
    <div class="instruction">
      <div class="info-circle">i</div>
      <p>Tap a slot to select or deselect an hour.</p>
    </div>

    <div class="date-selector">
      <button type="button" :disabled="isTodayOrEarlier(selectedDate)" @click="previousDay">‹</button>

      <div class="date">
        <input
          ref="dateInput"
          type="date"
          class="hidden-date-input"
          :min="formatInputDate(today)"
          :value="formatInputDate(selectedDate)"
          @change="handleDateChange"
        />

        <button type="button" class="calendar-button" aria-label="Select date" @click="openDatePicker">
          <span class="calendar">▣</span>
        </button>
        <strong>{{ formatDate(selectedDate) }}</strong>
      </div>

      <button type="button" @click="nextDay">›</button>
      <button type="button" class="share">♧</button>
    </div>

    <div class="legend">
      <div>
        <span class="legend-dot free"></span> Free
      </div>
      <div>
        <span class="legend-dot selected-dot"></span> Your selection
      </div>
      <div>
        <span class="legend-dot taken"></span> Taken
      </div>
      <div>
        <span class="legend-dot pending-dot"></span> Awaiting payment
      </div>
    </div>

    <div class="reserved-note">
      <span class="tiny-icon">✓</span> Reserved by the venue
    </div>

    <div class="schedule">
      <table>
        <thead>
          <tr>
            <th class="time-column">Time</th>
            <th v-for="court in courts" :key="typeof court === 'object' ? court.id : court">
              {{ typeof court === 'object' ? court.name : court }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(time, rowIndex) in timeRows" :key="time">
            <td class="time">{{ time }}</td>

            <td v-for="court in courts" :key="typeof court === 'object' ? court.id : court">
              <button
                type="button"
                class="slot"
                :class="{
                  'booked slot-disabled': isSlotDisabled(court, rowIndex),
                  'selected': !isSlotDisabled(court, rowIndex) && isSelected(court, rowIndex)
                }"
                :disabled="isSlotDisabled(court, rowIndex)"
                @click="handleSlotClick(court, rowIndex)"
              >
                <template v-if="isSlotDisabled(court, rowIndex)">
                  Taken
                </template>

                <template v-else-if="isSelected(court, rowIndex)">
                  <span class="check">✓</span> Selected
                </template>

                <template v-else>
                  ₱{{ price }}
                </template>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.booking {
  margin: 16px 12px 0;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.12);
  border-radius: 24px;
  padding: 14px 12px 18px;
  box-shadow: 0 10px 24px rgba(2, 8, 23, 0.15);
}

.instruction {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 4px 8px 12px;
  color: #cbd5e1;
}

.info-circle {
  width: 18px;
  height: 18px;
  flex: 0 0 18px;
  border: 1.5px solid rgba(163, 230, 53, 0.8);
  border-radius: 50%;
  text-align: center;
  font-size: 11px;
  line-height: 15px;
  font-weight: 700;
  color: #dfff00;
}

.instruction p {
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
}

.date-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 6px 14px;
}

.date-selector > button {
  border: 1px solid rgba(148, 163, 184, 0.15);
  background: rgba(15, 23, 42, 0.7);
  color: #e2e8f0;
  font-size: 24px;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  cursor: pointer;
}

.date-selector > button:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

.date-selector .date {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 9px;
  flex: 1;
  min-height: 44px;
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 14px;
}

.date strong {
  font-size: 14px;
  color: #f8fafc;
}

.hidden-date-input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.calendar-button {
  border: 0;
  background: transparent;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.calendar {
  color: #dfff00;
  font-size: 17px;
}

.date-selector .share {
  font-size: 17px;
}

.legend {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 13px;
  padding: 4px 8px 6px;
  color: #cbd5e1;
  font-size: 10px;
}

.legend > div {
  display: flex;
  align-items: center;
  gap: 6px;
}

.legend-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  display: inline-block;
}

.free { background: #a3e635; }
.selected-dot { background: #dfff00; }
.taken { background: #64748b; }
.pending-dot { background: #fbbf24; }

.reserved-note {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px 10px;
  color: #94a3b8;
  font-size: 10px;
}

.tiny-icon { color: #a3e635; }

.schedule {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding-top: 8px;
}

.schedule table {
  width: 100%;
  min-width: 420px;
  border-collapse: separate;
  border-spacing: 4px 6px;
}

.schedule th {
  height: 30px;
  color: #dbeafe;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
}

.schedule th:first-child {
  text-align: left;
  padding-left: 6px;
}

.schedule td { padding: 0; }

.schedule .time {
  width: 86px;
  padding-left: 6px;
  white-space: nowrap;
  color: #cbd5e1;
  font-size: 11px;
  font-weight: 700;
}

.slot {
  width: 100%;
  min-height: 48px;
  border: 1px solid rgba(148, 163, 184, 0.14);
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.78);
  color: #dfff00;
  font-size: 11px;
  font-weight: 700;
  transition: transform 0.15s ease, background 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
  cursor: pointer;
}

.slot:hover:not(:disabled) {
  background: rgba(30, 41, 59, 0.9);
  border-color: rgba(163, 230, 53, 0.4);
  box-shadow: 0 0 18px rgba(163, 230, 53, 0.12);
}

.slot:active:not(:disabled) {
  transform: scale(0.97);
}

.slot.selected {
  background: linear-gradient(135deg, #dfff00 0%, #a3e635 100%) !important;
  border-color: rgba(163, 230, 53, 0.8) !important;
  color: #020817 !important;
  box-shadow: 0 8px 24px rgba(163, 230, 53, 0.24);
}

.slot:disabled,
.slot.slot-disabled,
.slot.booked {
  background: rgba(71, 85, 105, 0.18) !important;
  border-color: rgba(148, 163, 184, 0.12) !important;
  color: #94a3b8 !important;
  cursor: not-allowed !important;
  pointer-events: none !important;
  box-shadow: none !important;
}

.check { margin-right: 4px; }
</style>