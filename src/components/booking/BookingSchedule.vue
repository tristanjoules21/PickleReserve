<script setup>
import { ref } from 'vue'

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

function formatInputDate(date) {
  const currentDate = new Date(date)
  const year = currentDate.getFullYear()
  const month = String(currentDate.getMonth() + 1).padStart(2, '0')
  const day = String(currentDate.getDate()).padStart(2, '0')

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
</script>

<template>
  <section class="booking">
    <div class="instruction">
      <div class="info-circle">i</div>
      <p>
        Tap a slot to select or deselect an hour.
      </p>
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
        <span class="legend-dot free"></span>
        Free
      </div>

      <div>
        <span class="legend-dot selected-dot"></span>
        Your selection
      </div>

      <div>
        <span class="legend-dot taken"></span>
        Taken
      </div>

      <div>
        <span class="legend-dot pending-dot"></span>
        Awaiting payment
      </div>
    </div>

    <div class="reserved-note">
      <span class="tiny-icon">✓</span>
      Reserved by the venue
    </div>

    <div class="schedule">
      <table>
        <thead>
          <tr>
            <th class="time-column">Time</th>
            <th v-for="court in courts" :key="court">{{ court }}</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(time, rowIndex) in timeRows" :key="time">
            <td class="time">{{ time }}</td>

            <td v-for="court in courts" :key="court">
              <button
                type="button"
                class="slot"
                :class="[
                  getStatus(court, rowIndex),
                  { selected: isSelected(court, rowIndex) },
                ]"
                @click="toggleSlot(court, rowIndex)"
              >
                <template v-if="isSelected(court, rowIndex)">
                  <span class="check">✓</span>
                  Selected
                </template>

                <template v-else-if="getStatus(court, rowIndex) === 'booked'">
                  Booked
                </template>

                <template v-else-if="getStatus(court, rowIndex) === 'pending'">
                  Pending
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
  background: white;
  padding: 15px 10px 100px;
}

.instruction {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 0 9px 13px;
  color: #58625f;
}

.info-circle {
  width: 17px;
  height: 17px;
  flex: 0 0 17px;
  border: 1.5px solid #65716d;
  border-radius: 50%;
  text-align: center;
  font-size: 11px;
  line-height: 15px;
  font-weight: 700;
}

.instruction p {
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
}

.date-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 3px;
}

.date-selector > button {
  border: 0;
  background: transparent;
  color: #66706c;
  font-size: 27px;
  width: 30px;
  height: 35px;
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
}

.date strong {
  font-size: 14px;
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
  color: #18865d;
  font-size: 17px;
}

.date-selector .share {
  font-size: 19px;
}

.legend {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 13px;
  padding: 7px 9px 3px;
  color: #68726e;
  font-size: 10px;
}

.legend > div {
  display: flex;
  align-items: center;
  gap: 5px;
}

.legend-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

.free {
  background: #258d68;
}

.selected-dot {
  background: #83c4a9;
}

.taken {
  background: #a9afad;
}

.pending-dot {
  background: #e4b97b;
}

.reserved-note {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 9px 10px;
  color: #68726e;
  font-size: 10px;
}

.tiny-icon {
  color: #83908b;
}

.schedule {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.schedule table {
  width: 100%;
  min-width: 400px;
  border-collapse: separate;
  border-spacing: 4px 5px;
}

.schedule th {
  height: 30px;
  color: #3e4744;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
}

.schedule th:first-child {
  text-align: left;
  padding-left: 4px;
}

.schedule td {
  padding: 0;
}

.schedule .time {
  width: 82px;
  padding-left: 4px;
  white-space: nowrap;
  color: #56615d;
  font-size: 11px;
  font-weight: 600;
}

.slot {
  width: 100%;
  min-height: 45px;
  border: 1px solid #e0e7e4;
  border-radius: 11px;
  background: #f8fbfa;
  color: #16815c;
  font-size: 11px;
  font-weight: 700;
  transition: 0.15s;
}

.slot:hover {
  background: #eff8f3;
}

.slot.available {
  background: #f8fbfa;
  color: #16815c;
}

.slot.booked {
  background: #eef1f0;
  color: #7c8582;
  border-color: #e4e9e7;
}

.slot.pending {
  background: #fffaf2;
  color: #986b4c;
  border-color: #e8d7c7;
}

.slot.selected {
  background: #18855f;
  border-color: #18855f;
  color: white;
  box-shadow: 0 2px 6px rgba(24, 133, 95, 0.25);
}

.check {
  margin-right: 3px;
}
</style>
