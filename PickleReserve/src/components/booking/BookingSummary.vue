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

      <strong>₱{{ props.total.toFixed(2) }}</strong>
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
  max-width: 560px;
  min-height: 84px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(2, 8, 23, 0.82);
  backdrop-filter: blur(16px);
  border-top: 1px solid rgba(148, 163, 184, 0.12);
  box-shadow: 0 -12px 28px rgba(2, 8, 23, 0.4);
}

.booking-total {
  min-width: 136px;
  display: flex;
  flex-direction: column;
}

.booking-total span {
  color: #94a3b8;
  font-size: 11px;
  letter-spacing: 0.02em;
}

.booking-total strong {
  margin-top: 5px;
  font-size: 24px;
  letter-spacing: -0.7px;
  color: #f8fafc;
}

.select-button {
  flex: 1;
  min-height: 48px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, #dfff00 0%, #a3e635 100%);
  color: #020817;
  font-weight: 800;
  box-shadow: 0 8px 20px rgba(163, 230, 53, 0.2);
}

.select-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}
</style>
