<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    default: ''
  },
  tone: {
    type: String,
    default: 'default'
  }
})

const toneClasses = computed(() => {
  const map = {
    confirmed: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    completed: 'bg-sky-100 text-sky-700',
    cancelled: 'bg-rose-100 text-rose-700',
    default: 'bg-slate-100 text-slate-700'
  }

  const normalized = (props.status || '').toLowerCase()

  if (normalized.includes('confirm')) return map.confirmed
  if (normalized.includes('pending')) return map.pending
  if (normalized.includes('complete')) return map.completed
  if (normalized.includes('cancel')) return map.cancelled

  return map[props.tone] || map.default
})
</script>

<template>
  <span
    :class="[
      'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
      toneClasses
    ]"
  >
    {{ status }}
  </span>
</template>
