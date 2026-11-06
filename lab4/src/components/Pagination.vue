<template>
  <div class="pagination-bar">
    <div class="pagination-info">
      Показано с <strong>{{ fromItem }}</strong> по <strong>{{ toItem }}</strong> из <strong>{{ total }}</strong> записей
    </div>

    <div class="pagination-controls">
      <button
        class="btn btn-secondary"
        :disabled="currentPage <= 1 || disabled"
        @click="goToPage(currentPage - 1)"
      >
        &larr; Назад
      </button>

      <span class="page-indicator">
        Стр. {{ currentPage }} из {{ totalPages || 1 }}
      </span>

      <button
        class="btn btn-secondary"
        :disabled="currentPage >= totalPages || disabled"
        @click="goToPage(currentPage + 1)"
      >
        Вперед &rarr;
      </button>

      <select
        :value="pageSize"
        class="filter-select"
        style="min-width: 90px; margin-left: 0.5rem"
        :disabled="disabled"
        @change="onLimitChange"
      >
        <option :value="5">5 / стр</option>
        <option :value="10">10 / стр</option>
        <option :value="25">25 / стр</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    total: number
    currentPage: number
    pageSize: number
    disabled?: boolean
  }>(),
  {
    disabled: false
  }
)

const emit = defineEmits<{
  (e: 'update:currentPage', page: number): void
  (e: 'update:pageSize', size: number): void
  (e: 'change'): void
}>()

const totalPages = computed(() => Math.ceil(props.total / props.pageSize) || 1)

const fromItem = computed(() => {
  if (props.total === 0) return 0
  return (props.currentPage - 1) * props.pageSize + 1
})

const toItem = computed(() => {
  return Math.min(props.currentPage * props.pageSize, props.total)
})

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value) return
  emit('update:currentPage', page)
  emit('change')
}

function onLimitChange(e: Event) {
  const target = e.target as HTMLSelectElement
  emit('update:pageSize', Number(target.value))
  emit('update:currentPage', 1)
  emit('change')
}
</script>

