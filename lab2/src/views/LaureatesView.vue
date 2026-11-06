<template>
  <div class="card">
    <h2 class="section-title">Список лауреатов</h2>
    <p class="section-desc">
      Реактивный компонент таблицы (Vue 3 + Composition API). Переходы осуществляются через Vue Router.
    </p>

    <DataTable :columns="columns" :data="laureates">
      <template #cell-prizesCount="{ value, row }">
        <span class="badge" :class="{ 'badge-gold': value > 1 }">
          {{ value }} {{ value > 1 ? 'премии' : 'премия' }}
        </span>
        <small style="margin-left: 8px; color: var(--text-muted)">({{ row.categories }})</small>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DataTable, { Column } from '../components/DataTable.vue'

interface LaureateItem {
  id: number
  name: string
  birthOrFounding: string
  country: string
  prizesCount: number
  categories: string
}

const columns: Column<LaureateItem>[] = [
  { key: 'id', title: '№', align: 'center' },
  { key: 'name', title: 'Имя / Организация' },
  { key: 'birthOrFounding', title: 'Дата рождения / основания', align: 'center' },
  { key: 'country', title: 'Страна' },
  { key: 'prizesCount', title: 'Число премий' }
]

const laureates = ref<LaureateItem[]>([
  { id: 1, name: 'Мария Склодовская-Кюри', birthOrFounding: '07.11.1867', country: 'Польша / Франция', prizesCount: 2, categories: 'Физика, Химия' },
  { id: 2, name: 'Лайнус Полинг', birthOrFounding: '28.02.1901', country: 'США', prizesCount: 2, categories: 'Химия, Мир' },
  { id: 3, name: 'Джон Бардин', birthOrFounding: '23.05.1908', country: 'США', prizesCount: 2, categories: 'Физика' },
  { id: 4, name: 'Фредерик Сенгер', birthOrFounding: '13.08.1918', country: 'Великобритания', prizesCount: 2, categories: 'Химия' },
  { id: 5, name: 'Карл Барри Шарплесс', birthOrFounding: '28.04.1941', country: 'США', prizesCount: 2, categories: 'Химия' },
  { id: 6, name: 'Международный комитет Красного Креста', birthOrFounding: '17.02.1863', country: 'Швейцария', prizesCount: 3, categories: 'Премия мира' },
  { id: 7, name: 'Управление Верховного комиссара ООН по делам беженцев', birthOrFounding: '14.12.1950', country: 'ООН', prizesCount: 2, categories: 'Премия мира' },
  { id: 8, name: 'Альберт Эйнштейн', birthOrFounding: '14.03.1879', country: 'Германия / Швейцария', prizesCount: 1, categories: 'Физика' }
])
</script>

