<script setup>
import { computed } from 'vue'
import Card from './Card.vue'

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  value: {
    type: [String, Number],
    default: ''
  },
  icon: {
    type: [Object, Function],
    default: null
  },
  trend: {
    type: String,
    default: ''
  },
  accent: {
    type: String,
    default: 'brand'
  }
})

const accentClasses = computed(() => {
  const map = {
    brand: 'bg-emerald-100 text-emerald-700',
    lime: 'bg-lime-100 text-lime-700',
    gold: 'bg-amber-100 text-amber-700',
    blue: 'bg-sky-100 text-sky-700'
  }

  return map[props.accent] || map.brand
})
</script>

<template>
  <Card class="p-4">
    <div class="flex items-start justify-between gap-3">
      <div>
        <p class="text-sm text-slate-500">{{ label }}</p>
        <p class="mt-3 text-2xl font-semibold text-slate-900">{{ value }}</p>

        <p
          v-if="trend"
          class="mt-2 inline-flex rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700"
        >
          {{ trend }}
        </p>
      </div>

      <div
        :class="[
          'flex h-11 w-11 items-center justify-center rounded-lg',
          accentClasses
        ]"
      >
        <component :is="icon" v-if="icon" class="h-5 w-5" />
      </div>
    </div>
  </Card>
</template>
