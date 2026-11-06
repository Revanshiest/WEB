<template>
  <div class="card">
    <h2 class="section-title">Список нобелевских премий</h2>
    <p class="section-desc">
      Данные загружаются через единый сервис <code>BaseApiService</code> с помощью <code>Axios</code> из официального Nobel Prize API.
    </p>

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
    </div>

    <!-- Сообщение об ошибке (если есть) -->
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
import { ref, onMounted } from 'vue'
import DataTable, { Column } from '../components/DataTable.vue'
import Pagination from '../components/Pagination.vue'
import { prizesService, FormattedPrize } from '../api/PrizesService'

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
  } catch (err: any) {
    errorMessage.value = `Не удалось загрузить данные из API: ${err.message}`
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

onMounted(() => {
  fetchData()
})
</script>

