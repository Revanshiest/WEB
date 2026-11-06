<template>
  <div class="card">
    <h2 class="section-title">Список лауреатов (PWA + Service Worker)</h2>
    <p class="section-desc">
      Приложение работает даже при отключенном интернете. Запросы кешируются Service Worker и восстанавливаются из кеша.
    </p>

    <!-- Оповещение о работе с кешем -->
    <div v-if="isDataFromCache" class="validation-tag" style="background-color: #fffbeb; color: #92400e; border-color: #fde68a;">
      <span>💾</span>
      <span>Данные загружены из офлайн-кеша Service Worker (автономный режим)</span>
    </div>
    <div v-else class="validation-tag">
      <span>🌐</span>
      <span>Данные получены напрямую из сети и сохранены в кеш</span>
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

      <button class="btn btn-secondary" style="margin-left: auto" :disabled="loading" @click="fetchData">
        🔄 Обновить данные
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
import { ref, onMounted, watch } from 'vue'
import DataTable, { Column } from '../components/DataTable.vue'
import Pagination from '../components/Pagination.vue'
import { laureatesService, FormattedLaureate } from '../api/LaureatesService'
import { useNetworkStatus } from '../composables/useNetworkStatus'

const { isOnline } = useNetworkStatus()

const columns: Column<FormattedLaureate>[] = [
  { key: 'name', title: 'Имя / Организация' },
  { key: 'birthOrFounding', title: 'Дата рождения / основания', align: 'center' },
  { key: 'country', title: 'Страна' },
  { key: 'prizesCount', title: 'Присужденные премии' }
]

const laureates = ref<FormattedLaureate[]>([])
const loading = ref(false)
const errorMessage = ref('')
const isDataFromCache = ref(false)
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
    isDataFromCache.value = res.isCached
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

watch(isOnline, (online) => {
  if (online) {
    console.info('Сеть восстановлена, синхронизируем свежие данные с API...')
    fetchData()
  }
})

onMounted(() => {
  fetchData()
})
</script>

