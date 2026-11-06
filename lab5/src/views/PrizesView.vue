<template>
  <div class="card">
    <h2 class="section-title">Список нобелевских премий (PWA + Service Worker)</h2>
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
      <div class="filter-group">
        <label>Категория</label>
        <select v-model="selectedCategory" class="filter-select">
          <option value="">Все категории</option>
          <option value="phy">Физика (Physics)</option>
          <option value="che">Химия (Chemistry)</option>
          <option value="med">Медицина (Physiology or Medicine)</option>
          <option value="lit">Литература (Literature)</option>
          <option value="pea">Премия мира (Peace)</option>
          <option value="eco">Экономика (Economic Sciences)</option>
        </select>
      </div>

      <div class="filter-group">
        <label>Год вручения</label>
        <input
          v-model.number="selectedYear"
          type="number"
          placeholder="Например: 2023"
          min="1901"
          max="2025"
          class="filter-input"
          style="min-width: 140px"
          @keyup.enter="applyFilters"
        />
      </div>

      <button class="btn btn-primary" :disabled="loading" @click="applyFilters">
        Применить фильтр
      </button>

      <button class="btn btn-secondary" :disabled="loading" @click="resetFilters">
        Сбросить
      </button>

      <button class="btn btn-secondary" style="margin-left: auto" :disabled="loading" @click="fetchData">
        🔄 Обновить данные
      </button>
    </div>

    <!-- Сообщение об ошибке (если нет ни сети, ни кеша) -->
    <div v-if="errorMessage" class="error-banner">
      {{ errorMessage }}
    </div>

    <!-- Таблица данных -->
    <DataTable :columns="columns" :data="prizes" :loading="loading">
      <template #cell-category="{ value }">
        <span class="badge" :class="{ 'badge-gold': value === 'Премия мира' }">
          {{ value }}
        </span>
      </template>

      <template #cell-prizeAmount="{ value }">
        <strong>{{ Number(value).toLocaleString('ru-RU') }} SEK</strong>
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
import { prizesService, FormattedPrize } from '../api/PrizesService'
import { useNetworkStatus } from '../composables/useNetworkStatus'

const { isOnline } = useNetworkStatus()

const columns: Column<FormattedPrize>[] = [
  { key: 'category', title: 'Категория' },
  { key: 'awardYear', title: 'Год', align: 'center' },
  { key: 'dateAwarded', title: 'Дата вручения', align: 'center' },
  { key: 'prizeAmount', title: 'Размер гранта' },
  { key: 'laureatesList', title: 'Лауреаты' }
]

const prizes = ref<FormattedPrize[]>([])
const loading = ref(false)
const errorMessage = ref('')
const isDataFromCache = ref(false)

const selectedCategory = ref('')
const selectedYear = ref<number | undefined>(undefined)

const currentPage = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)

async function fetchData() {
  loading.value = true
  errorMessage.value = ''
  try {
    const offset = (currentPage.value - 1) * pageSize.value
    const res = await prizesService.getPrizes({
      offset,
      limit: pageSize.value,
      nobelPrizeCategory: selectedCategory.value || undefined,
      nobelPrizeYear: selectedYear.value || undefined
    })
    prizes.value = res.items
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
  selectedCategory.value = ''
  selectedYear.value = undefined
  currentPage.value = 1
  fetchData()
}

// Автоматическое обновление данных при восстановлении подключения к интернету
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

