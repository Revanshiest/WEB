<template>
  <div class="card">
    <h2 class="section-title">Список лауреатов</h2>
    <p class="section-desc">
      Данные API строго типизированы с помощью <strong>io-ts</strong> и декодируются функцией <code>decodeOrThrow</code> (fp-ts Either).
    </p>

    <!-- Индикатор активной строгой типизации -->
    <div class="validation-tag">
      <span>&#10004;</span>
      <span>Схема данных защищена: кодек <code>LaureatesApiResponseCodec (io-ts)</code></span>
    </div>

    <!-- Блок фильтрации -->
    <div class="filters-bar">
      <div class="filter-group" style="flex: 1">
        <label>Поиск по имени или организации</label>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Например: Marie Curie, Einstein, Red Cross..."
          class="filter-input"
          @keyup.enter="applyFilters"
        />
      </div>

      <button class="btn btn-primary" :disabled="loading" @click="applyFilters">
        Найти
      </button>

      <button class="btn btn-secondary" :disabled="loading" @click="resetFilters">
        Сбросить
      </button>
    </div>

    <!-- Сообщение об ошибке (если есть) -->
    <div v-if="errorMessage" class="error-banner">
      {{ errorMessage }}
    </div>

    <!-- Таблица данных -->
    <DataTable :columns="columns" :data="laureates" :loading="loading">
      <template #cell-prizesCount="{ value, row }">
        <span class="badge" :class="{ 'badge-gold': value > 1 }">
          {{ value }} {{ value > 1 ? 'премии' : 'премия' }}
        </span>
        <small style="margin-left: 8px; color: var(--text-muted)">({{ row.prizesSummary }})</small>
      </template>
    </DataTable>

    <!-- Пагинация -->
    <Pagination
      v-model:currentPage="currentPage"
      v-model:pageSize="pageSize"
      :total="totalCount"
      :disabled="loading"
      @change="fetchData"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DataTable, { Column } from '../components/DataTable.vue'
import Pagination from '../components/Pagination.vue'
import { laureatesService, FormattedLaureate } from '../api/LaureatesService'

const columns: Column<FormattedLaureate>[] = [
  { key: 'name', title: 'Имя / Организация' },
  { key: 'birthOrFounding', title: 'Дата рождения / основания', align: 'center' },
  { key: 'country', title: 'Страна' },
  { key: 'prizesCount', title: 'Присужденные премии' }
]

const laureates = ref<FormattedLaureate[]>([])
const loading = ref(false)
const errorMessage = ref('')
const searchQuery = ref('')

const currentPage = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)

async function fetchData() {
  loading.value = true
  errorMessage.value = ''
  try {
    const offset = (currentPage.value - 1) * pageSize.value
    const res = await laureatesService.getLaureates({
      offset,
      limit: pageSize.value,
      name: searchQuery.value || undefined
    })
    laureates.value = res.items
    totalCount.value = res.total
  } catch (err: any) {
    errorMessage.value = err.message
  } finally {
    loading.value = false
  }
}

function applyFilters() {
  currentPage.value = 1
  fetchData()
}

function resetFilters() {
  searchQuery.value = ''
  currentPage.value = 1
  fetchData()
}

onMounted(() => {
  fetchData()
})
</script>

