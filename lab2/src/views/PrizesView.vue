<template>
  <div class="card">
    <h2 class="section-title">Список нобелевских премий</h2>
    <p class="section-desc">
      Реактивный компонент таблицы (Vue 3 + Composition API). Переходы осуществляются через Vue Router.
    </p>

    <DataTable :columns="columns" :data="prizes">
      <template #cell-category="{ value }">
        <span class="badge" :class="{ 'badge-gold': value === 'Премия мира' }">
          {{ value }}
        </span>
      </template>

      <template #cell-prizeAmount="{ value }">
        <strong>{{ Number(value).toLocaleString('ru-RU') }} SEK</strong>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DataTable, { Column } from '../components/DataTable.vue'

interface PrizeItem {
  id: number
  category: string
  awardYear: number
  prizeAmount: number
  laureatesCount: number
}

const columns: Column<PrizeItem>[] = [
  { key: 'id', title: '№', align: 'center' },
  { key: 'category', title: 'Категория' },
  { key: 'awardYear', title: 'Год вручения', align: 'center' },
  { key: 'prizeAmount', title: 'Размер гранта (SEK)' },
  { key: 'laureatesCount', title: 'Кол-во лауреатов', align: 'center', formatter: (val) => `${val} чел.` }
]

const prizes = ref<PrizeItem[]>([
  { id: 1, category: 'Физика', awardYear: 2024, prizeAmount: 11000000, laureatesCount: 2 },
  { id: 2, category: 'Химия', awardYear: 2024, prizeAmount: 11000000, laureatesCount: 3 },
  { id: 3, category: 'Физиология и медицина', awardYear: 2024, prizeAmount: 11000000, laureatesCount: 2 },
  { id: 4, category: 'Литература', awardYear: 2024, prizeAmount: 11000000, laureatesCount: 1 },
  { id: 5, category: 'Премия мира', awardYear: 2024, prizeAmount: 11000000, laureatesCount: 1 },
  { id: 6, category: 'Экономические науки', awardYear: 2024, prizeAmount: 11000000, laureatesCount: 3 },
  { id: 7, category: 'Физика', awardYear: 2023, prizeAmount: 11000000, laureatesCount: 3 },
  { id: 8, category: 'Химия', awardYear: 2023, prizeAmount: 11000000, laureatesCount: 3 }
])
</script>

