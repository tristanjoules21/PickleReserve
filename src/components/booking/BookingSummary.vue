<script setup>
const props = defineProps({
  selection: {
    type: Array,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['open-sheet'])
</script>

<template>
  <footer class="booking-bar">
    <div class="booking-total">
      <span>
        {{
          props.selection.length
            ? `${props.selection.length} slot${props.selection.length > 1 ? 's' : ''} selected`
            : 'No slots selected'
        }}
      </span>

      <strong>₱{{ props.total }}</strong>
    </div>

    <button type="button" class="select-button" :disabled="!props.selection.length" @click="emit('open-sheet')">
      {{ props.selection.length ? 'Reserve' : 'Select a slot' }}
    </button>
  </footer>
</template>

<style scoped>
.booking-bar {
  position: fixed;
  z-index: 20;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 520px;
  min-height: 84px;
  padding: 12px 13px;
  display: flex;
  align-items: center;
  gap: 13px;
  background: rgba(255, 255, 255, 0.97);
  border-top: 1px solid #e3e9e6;
  box-shadow: 0 -4px 16px rgba(15, 30, 24, 0.06);
}

.booking-total {
  min-width: 126px;
  display: flex;
  flex-direction: column;
}

.booking-total span {
  color: #77817e;
  font-size: 11px;
}

.booking-total strong {
  margin-top: 4px;
  font-size: 24px;
  letter-spacing: -0.6px;
  color: #111b18;
}

.select-button {
  flex: 1;
  min-height: 48px;
  border: none;
  border-radius: 14px;
  background: #16895e;
  color: white;
  font-weight: 700;
}

.select-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
