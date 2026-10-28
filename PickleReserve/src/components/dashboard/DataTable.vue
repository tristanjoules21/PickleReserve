<script setup>
import { computed, ref, watch } from 'vue'
import StatusBadge from '../ui/StatusBadge.vue'

const props = defineProps({
  columns: {
    type: Array,
    default: () => []
  },
  data: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: 'Table'
  },
  searchKeys: {
    type: Array,
    default: () => []
  },
  pageSize: {
    type: Number,
    default: 5
  }
})

const searchTerm = ref('')
const currentPage = ref(1)

const filteredRows = computed(() => {
  const term = searchTerm.value.trim().toLowerCase()

  if (!term) return props.data

  return props.data.filter((row) =>
    props.searchKeys.some((key) =>
      String(row[key] ?? '')
        .toLowerCase()
        .includes(term)
    )
  )
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / props.pageSize)))

const pageRows = computed(() => {
  const start = (currentPage.value - 1) * props.pageSize
  return filteredRows.value.slice(start, start + props.pageSize)
})

watch(filteredRows, () => {
  currentPage.value = 1
})

const formatCell = (row, key) => {
  const value = row[key]
  if (value === null || value === undefined) return ''
  return String(value)
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value += 1
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value -= 1
}
</script>

<template>
  <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h3 class="text-lg font-semibold text-slate-900">{{ title }}</h3>

      <div class="relative w-full max-w-xs">
        <input
          v-model="searchTerm"
          type="search"
          placeholder="Search..."
          class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white"
        />
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full text-left text-sm text-slate-600">
        <thead>
          <tr class="border-b border-slate-200 text-slate-500">
            <th
              v-for="column in columns"
              :key="column.key"
              class="px-3 py-3 font-medium"
            >
              {{ column.header }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="row in pageRows"
            :key="row.id || JSON.stringify(row)"
            class="border-b border-slate-100 last:border-b-0"
          >
            <td
              v-for="column in columns"
              :key="`${row.id || JSON.stringify(row)}-${column.key}`"
              class="px-3 py-3 align-middle"
            >
              <StatusBadge
                v-if="column.key === 'status'"
                :status="formatCell(row, column.key)"
              />

              <span v-else>{{ formatCell(row, column.key) }}</span>
            </td>
          </tr>

          <tr v-if="!pageRows.length">
            <td :colspan="columns.length || 1" class="px-3 py-8 text-center text-slate-500">
              No records found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-4 flex items-center justify-between gap-3 text-sm text-slate-500">
      <span>
        Showing {{ pageRows.length ? (currentPage - 1) * props.pageSize + 1 : 0 }}-
        {{ Math.min(currentPage * props.pageSize, filteredRows.length) }} of {{ filteredRows.length }}
      </span>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="rounded-md border border-slate-200 px-3 py-1.5 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="currentPage === 1"
          @click="prevPage"
        >
          Prev
        </button>

        <button
          type="button"
          class="rounded-md border border-slate-200 px-3 py-1.5 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="currentPage >= totalPages"
          @click="nextPage"
        >
          Next
        </button>
      </div>
    </div>
  </section>
</template>
