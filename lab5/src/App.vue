<template>
  <div id="app">
    <!-- Шапка сайта -->
    <header>
      <div class="header-content">
        <h1>Нобелевский справочник</h1>
        <p>Лабораторная работа №5: PWA и Service Worker кеширование для работы в офлайн-режиме</p>
      </div>
    </header>

    <!-- Индикатор сетевого статуса -->
    <div
      v-if="!isOnline"
      class="network-status-bar status-offline"
    >
      <div>
        <span class="status-badge-dot dot-offline"></span>
        <strong>Офлайн-режим:</strong> Подключение к интернету отсутствует. Отображаются закешированные данные.
      </div>
    </div>
    <div
      v-else-if="wasOffline"
      class="network-status-bar status-restored"
    >
      <div>
        <span class="status-badge-dot dot-online"></span>
        <strong>Сеть восстановлена:</strong> Соединение с интернетом возобновлено, данные синхронизируются.
      </div>
      <button class="btn btn-primary btn-sm" @click="resetRestoredState">
        Закрыть
      </button>
    </div>

    <!-- Навигация -->
    <nav>
      <div class="nav-container">
        <router-link to="/prizes" class="nav-link">Нобелевские премии</router-link>
        <router-link to="/laureates" class="nav-link">Лауреаты премий</router-link>
      </div>
    </nav>

    <!-- Основная часть -->
    <main>
      <router-view />
    </main>

    <!-- Подвал сайта -->
    <footer>
      <p>&copy; 2025 Нобелевский справочник. Лабораторная работа №5 (PWA + Service Worker + Offline Caching).</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useNetworkStatus } from './composables/useNetworkStatus'

const { isOnline, wasOffline, resetRestoredState } = useNetworkStatus()
</script>

