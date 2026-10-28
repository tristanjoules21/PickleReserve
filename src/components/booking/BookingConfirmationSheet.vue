<script setup>
const props = defineProps({
  selectedDate: {
    type: Date,
    required: true,
  },
  selection: {
    type: Array,
    required: true,
  },
  timeRows: {
    type: Array,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['close', 'confirm'])

function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(date)
}
</script>

<template>
  <div>
    <div class="overlay" @click="emit('close')"></div>

    <div class="confirm-sheet">
      <div class="sheet-handle"></div>

      <div class="sheet-header">
        <h2>Confirm reservation</h2>
        <button type="button" @click="emit('close')">×</button>
      </div>

      <p class="sheet-date">{{ formatDate(props.selectedDate) }}</p>

      <div class="selected-list">
        <div v-for="slot in props.selection" :key="`${slot.court}-${slot.row}`">
          <span>{{ slot.court }} · {{ props.timeRows[slot.row] }}</span>
          <strong>₱{{ props.price }}</strong>
        </div>
      </div>

      <div class="sheet-total">
        <span>Total</span>
        <strong>₱{{ props.total }}</strong>
      </div>

      <button type="button" class="confirm" @click="emit('confirm')">Confirm & Pay</button>

      <p class="cancel-note">Free cancellation up to 24h before your slot.</p>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(11, 18, 15, 0.35);
  z-index: 40;
}

.confirm-sheet {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 50;
  background: white;
  border-radius: 24px 24px 0 0;
  padding: 14px 16px 24px;
  box-shadow: 0 -8px 24px rgba(16, 24, 23, 0.1);
}

.sheet-handle {
  width: 50px;
  height: 5px;
  background: #dfe7e4;
  border-radius: 999px;
  margin: 0 auto 12px;
}

.sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.sheet-header h2 {
  margin: 0;
  font-size: 20px;
}

.sheet-header button {
  background: transparent;
  border: none;
  font-size: 30px;
  color: #56615d;
}

.sheet-date {
  margin: 0 0 14px;
  color: #65716d;
  font-size: 13px;
}

.selected-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
}

.selected-list div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f6faf7;
  border: 1px solid #edf0ef;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 13px;
  color: #37413e;
}

.sheet-total {
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid #edf0ef;
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  font-weight: 700;
}

.confirm {
  margin-top: 16px;
  width: 100%;
  min-height: 48px;
  border: none;
  border-radius: 14px;
  background: #16895e;
  color: white;
  font-weight: 700;
}

.cancel-note {
  margin: 10px 0 0;
  text-align: center;
  color: #78837f;
  font-size: 11px;
}
</style>
