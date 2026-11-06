<template>
  <div class="table-wrapper">
    <table class="data-table">
      <thead>
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            :style="{ textAlign: col.align || 'left' }"
          >
            {{ col.title }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td :colspan="columns.length" class="empty-cell">
            Загрузка данных из API...
          </td>
        </tr>
        <tr v-else-if="data.length === 0">
          <td :colspan="columns.length" class="empty-cell">
            Нет данных для отображения
          </td>
        </tr>
        <tr v-else v-for="(row, index) in data" :key="getRowKey(row, index)">
          <td
            v-for="col in columns"
            :key="col.key"
            :style="{ textAlign: col.align || 'left' }"
          >
            <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]" :index="index">
              {{ formatCell(col, row) }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
export interface Column<T = any> {
  key: string
  title: string
  align?: 'left' | 'center' | 'right'
  formatter?: (val: any, row: T) => string | number
}

const props = withDefaults(
  defineProps<{
    columns: Column[]
    data: any[]
    keyField?: string
    loading?: boolean
  }>(),
  {
    keyField: 'id',
    loading: false
  }
)

function getRowKey(row: any, index: number): string | number {
  return row[props.keyField] ?? index
}

function formatCell(col: Column, row: any): any {
  const raw = row[col.key]
  if (col.formatter) {
    return col.formatter(raw, row)
  }
  return raw !== undefined && raw !== null ? raw : '—'
}
</script>

<style scoped>
.empty-cell {
  text-align: center;
  color: var(--text-muted);
  padding: 2.5rem !important;
  font-style: italic;
}
</style>

